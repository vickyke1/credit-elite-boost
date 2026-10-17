import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { providerById } from "../_shared/payments/registry.ts";
import { decideStatus } from "../_shared/payments/status.ts";
import { sendOwnerAlert } from "../_shared/telegram.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const provider = providerById(new URL(req.url).searchParams.get("provider") ?? "");
  if (!provider) return json({ error: "Unknown provider" }, 404);
  const raw = await req.text();
  if (raw.length > 20000) return json({ error: "Too large" }, 413);

  let event;
  try { event = await provider.verifyWebhook(raw, req.headers); }
  catch { return json({ error: "Provider verification unavailable; retry later" }, 503); }
  if (!event) return json({ error: "Invalid signature" }, 401); // nothing is written for unverified calls

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "Service unavailable" }, 503);
  const admin = createClient(url, key);
  const { data: order } = await admin.from("orders").select("id,total_usd,provider,provider_invoice_id,telegram,status").eq("id", event.orderId).maybeSingle();
  if (!order || order.provider !== provider.id) return json({ error: "Unknown order" }, 404);
  if (!event.invoiceId || !order.provider_invoice_id || event.invoiceId !== order.provider_invoice_id) return json({ error: "Invoice mismatch" }, 409);
  if (!event.payCurrency || (order.pay_currency && order.pay_currency !== event.payCurrency)) return json({ error: "Asset or network mismatch" }, 409);

  const decision = decideStatus(event, Number(order.total_usd));
  if (["invalid amount", "amount mismatch", "currency mismatch"].includes(decision.reason)) return json({ error: decision.reason }, 409);
  const { data: result, error } = await admin.rpc("apply_verified_payment_event", {
    p_order: order.id, p_provider: provider.id, p_event_key: event.eventKey,
    p_invoice: event.invoiceId, p_currency: event.payCurrency, p_to: decision.status,
    p_reason: `${provider.id}: ${decision.reason}`, p_raw: JSON.parse(raw),
  });
  if (error) return json({ error: "Payment storage failed; retry later" }, 500);

  const { data: notificationId, error: claimError } = await admin.rpc("claim_payment_notification", { p_provider: provider.id, p_event_key: event.eventKey });
  if (claimError) return json({ error: "Notification storage failed; retry later" }, 500);
  if (notificationId) {
    const sent = await sendOwnerAlert(`Verified payment update\nOrder: ${order.id}\nStatus: ${decision.status ?? order.status}\nAmount: $${order.total_usd} (${event.payCurrency})\nBuyer Telegram: @${order.telegram}`);
    const { error: notificationError } = await admin.from("payment_events").update({ notification_status: sent ? "sent" : "failed" }).eq("id", notificationId);
    if (!sent || notificationError) return json({ error: "Alert delivery unconfirmed; retry later" }, 503);
  }
  return json({ ok: true, duplicate: result?.duplicate === true });
});
