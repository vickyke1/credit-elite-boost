import { createClient } from "npm:@supabase/supabase-js@2";
import { providerById } from "../_shared/payments/registry.ts";
import { decideStatus } from "../_shared/payments/status.ts";
import { sendOwnerAlert } from "../_shared/telegram.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const provider = providerById(new URL(req.url).searchParams.get("provider") ?? "");
  if (!provider) return json({ error: "Unknown provider" }, 404);
  const raw = await req.text();
  if (raw.length > 20000) return json({ error: "Too large" }, 413);

  const event = await provider.verifyWebhook(raw, req.headers);
  if (!event) return json({ error: "Invalid signature" }, 401); // nothing is written for unverified calls

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: order } = await admin.from("orders").select("id,total_usd,provider,provider_invoice_id,telegram,status").eq("id", event.orderId).maybeSingle();
  if (!order || order.provider !== provider.id) return json({ error: "Unknown order" }, 404);
  if (event.invoiceId && order.provider_invoice_id && event.invoiceId !== order.provider_invoice_id) return json({ error: "Invoice mismatch" }, 409);

  const { error: dup } = await admin.from("payment_events").insert({
    provider: provider.id, provider_event_key: event.eventKey, order_id: order.id, verified: true, payment_status: event.providerStatus, raw: JSON.parse(raw),
  });
  if (dup) {
    if (dup.code === "23505") return json({ ok: true, duplicate: true });
    console.error("payment_events insert failed", dup.message);
    return json({ error: "Storage failed" }, 500);
  }

  const decision = decideStatus(event, Number(order.total_usd));
  if (!decision.status) return json({ ok: true, note: decision.reason });
  if (event.payCurrency) await admin.from("orders").update({ pay_currency: event.payCurrency }).eq("id", order.id);
  const { data: newStatus, error } = await admin.rpc("transition_order", { p_order: order.id, p_to: decision.status, p_reason: `${provider.id}: ${decision.reason}` });
  if (error) return json({ error: "Transition failed" }, 500);

  if (newStatus === decision.status && order.status !== decision.status) {
    await sendOwnerAlert(`Verified payment update\nOrder: ${order.id}\nStatus: ${decision.status}\nAmount: $${order.total_usd} (${event.payCurrency ?? "crypto"})\nBuyer Telegram: @${order.telegram}`);
  }
  return json({ ok: true });
});
