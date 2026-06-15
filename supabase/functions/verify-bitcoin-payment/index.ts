import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// =====================================================================
// Bitcoin payment verification webhook (scaffold).
//
// This endpoint is INERT until a blockchain/payment processor is configured.
// Required environment variables (set as Supabase function secrets):
//   BTC_WEBHOOK_SECRET   - shared secret; incoming `x-webhook-signature` must match
//   BTC_MIN_CONFIRMATIONS - integer, default 2
//
// Expected JSON payload from your processor (BlockCypher / Blockchain.com /
// self-hosted node listener), normalised to:
//   { orderNumber, address, amountBtc, confirmations, txHash }
//
// On a verified payment it marks the order paid EXACTLY once (idempotent),
// moves delivery to "processing", and logs the event. It never fakes success.
// =====================================================================
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

  const webhookSecret = Deno.env.get("BTC_WEBHOOK_SECRET");
  if (!webhookSecret) {
    // No processor configured yet — secure structure exists, but inert.
    return json({
      error: "Bitcoin verification is not configured.",
      configured: false,
      requiredEnv: ["BTC_WEBHOOK_SECRET", "BTC_MIN_CONFIRMATIONS"],
    }, 501);
  }

  // Authenticate the webhook caller.
  const signature = req.headers.get("x-webhook-signature");
  if (!signature || signature !== webhookSecret) {
    return json({ error: "Invalid signature." }, 401);
  }

  try {
    const body = await req.json();
    const orderNumber = String(body?.orderNumber ?? "").trim();
    const address = String(body?.address ?? "").trim();
    const amountBtc = Number(body?.amountBtc);
    const confirmations = Number(body?.confirmations ?? 0);
    const txHash = String(body?.txHash ?? "").trim();

    if (!orderNumber || !address || !Number.isFinite(amountBtc)) {
      return json({ error: "Malformed payload." }, 400);
    }

    const minConfirmations = Number(Deno.env.get("BTC_MIN_CONFIRMATIONS") ?? "2");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (!order) return json({ error: "Order not found." }, 404);

    const { data: btc } = await supabase
      .from("bitcoin_payments")
      .select("*")
      .eq("order_id", order.id)
      .maybeSingle();

    if (!btc) return json({ error: "No Bitcoin payment record for order." }, 404);

    // Idempotency: prevent duplicate payment confirmation.
    if (order.payment_status === "paid" || btc.status === "paid") {
      return json({ ok: true, alreadyPaid: true });
    }

    // Verify address, amount and confirmations.
    const addressOk = address === btc.wallet_address;
    const expectedBtc = btc.expected_amount_btc ? Number(btc.expected_amount_btc) : null;
    // Allow a small tolerance for fee/rounding (1%).
    const amountOk = expectedBtc === null ? false : amountBtc >= expectedBtc * 0.99;
    const confirmationsOk = confirmations >= minConfirmations;
    const notExpired = new Date(btc.expires_at).getTime() > Date.now();

    await supabase.from("payment_events").insert({
      order_id: order.id,
      event_type: "btc_webhook_received",
      detail: { addressOk, amountOk, confirmationsOk, notExpired, confirmations, txHash },
    });

    if (!addressOk || !amountOk || !confirmationsOk) {
      await supabase
        .from("bitcoin_payments")
        .update({ confirmations, tx_hash: txHash || btc.tx_hash })
        .eq("order_id", order.id);
      return json({ ok: false, addressOk, amountOk, confirmationsOk });
    }

    // Verified — mark paid once and queue delivery.
    await supabase
      .from("bitcoin_payments")
      .update({ status: "paid", confirmations, tx_hash: txHash || btc.tx_hash })
      .eq("order_id", order.id);

    await supabase
      .from("orders")
      .update({ payment_status: "paid", delivery_status: "processing" })
      .eq("id", order.id);

    await supabase.from("payment_events").insert({
      order_id: order.id,
      event_type: "payment_verified",
      detail: { method: "bitcoin", txHash, confirmations },
    });

    return json({ ok: true, paid: true });
  } catch (error) {
    console.error("verify-bitcoin-payment error:", error);
    return json({ error: "Verification failed." }, 500);
  }
});
