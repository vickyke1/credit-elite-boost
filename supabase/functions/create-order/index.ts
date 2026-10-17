import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { activeProvider } from "../_shared/payments/registry.ts";

const schema = z.object({
  skus: z.array(z.string().trim().min(1).max(120)).min(1).max(10),
  telegram: z.string().trim().regex(/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/),
  returnOrigin: z.string().url().optional(),
});
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const allowedOrigins = ["https://cpncreditboost.com", "https://www.cpncreditboost.com", "https://credit-elite-boost.lovable.app"];
const errors: Record<string, [string, number]> = {
  item_not_available: ["One or more items aren't available for online checkout yet. Message us on Telegram to order.", 409],
  sold_out: ["One of these items just sold out.", 409],
  rate_limit_exceeded: ["Too many checkout attempts. Please try again later.", 429],
  duplicate_items: ["Your cart has a duplicate item.", 400],
  invalid_items: ["Your cart is empty or too large.", 400],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  const raw = await req.text();
  if (raw.length > 4000) return reply({ error: "Request too large" }, 413);
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return reply({ error: "Invalid request" }, 400); }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return reply({ error: "Please check your checkout details." }, 400);

  const provider = activeProvider();
  if (!provider.isConfigured()) return reply({ error: "Crypto checkout isn't open yet. Message us on Telegram to order.", code: "provider_not_configured" }, 503);

  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, key);

  let userId: string | null = null;
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    const { data } = await admin.auth.getUser(auth.slice(7));
    userId = data.user?.id ?? null;
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${key}:${ip}`));
  const ipHash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");

  const { data: orderId, error } = await admin.rpc("create_checkout_order", {
    p_skus: parsed.data.skus, p_telegram: parsed.data.telegram.replace(/^@/, ""), p_user_id: userId, p_ip_hash: ipHash, p_provider: provider.id,
  });
  if (error) {
    const hit = Object.keys(errors).find((k) => error.message.includes(k));
    if (hit) return reply({ error: errors[hit][0], code: hit }, errors[hit][1]);
    console.error("create_checkout_order failed", error.message);
    return reply({ error: "We couldn't start checkout. Please try again." }, 500);
  }
  const { data: order } = await admin.from("orders").select("total_usd").eq("id", orderId).single();
  const origin = parsed.data.returnOrigin && allowedOrigins.some((o) => parsed.data.returnOrigin!.startsWith(o)) ? new URL(parsed.data.returnOrigin).origin : allowedOrigins[0];
  try {
    const invoice = await provider.createInvoice({
      orderId, amountUsd: Number(order!.total_usd), description: `CpnCreditBoost order ${orderId.slice(0, 8)}`,
      callbackUrl: `${url}/functions/v1/payment-webhook?provider=${provider.id}`,
      successUrl: `${origin}/order/${orderId}`, cancelUrl: `${origin}/order/${orderId}`,
    });
    await admin.from("orders").update({ provider_invoice_id: invoice.invoiceId, updated_at: new Date().toISOString() }).eq("id", orderId);
    return reply({ orderId, paymentUrl: invoice.paymentUrl });
  } catch (e) {
    console.error("Invoice creation failed", e instanceof Error ? e.message : e);
    await admin.rpc("transition_order", { p_order: orderId, p_to: "failed", p_reason: "invoice creation failed" });
    return reply({ error: "The payment provider is unavailable. Please try again shortly." }, 502);
  }
});
