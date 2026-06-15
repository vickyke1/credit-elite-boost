import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Lets a customer attach proof of payment to their order (BTC tx hash, or a
// Cash App / Venmo sender note). This NEVER marks the order paid — an admin or
// the verified Bitcoin webhook does that. It only records the reference and
// flips the order to "awaiting_review".
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

  try {
    const body = await req.json();
    const accessToken = typeof body?.accessToken === "string" ? body.accessToken.trim() : "";
    const reference = typeof body?.reference === "string" ? body.reference.trim().slice(0, 200) : "";
    if (!accessToken || !reference) return json({ error: "Missing access token or reference." }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order } = await supabase
      .from("orders")
      .select("id, payment_method, payment_status")
      .eq("access_token", accessToken)
      .maybeSingle();

    if (!order) return json({ error: "Order not found." }, 404);
    if (order.payment_status === "paid") return json({ error: "Order is already paid." }, 409);

    if (order.payment_method === "bitcoin") {
      await supabase
        .from("bitcoin_payments")
        .update({ tx_hash: reference, status: "awaiting_review" })
        .eq("order_id", order.id);
    } else {
      await supabase
        .from("manual_payment_reviews")
        .update({ reference_note: reference })
        .eq("order_id", order.id);
    }

    await supabase.from("orders").update({ payment_status: "awaiting_review" }).eq("id", order.id);
    await supabase.from("payment_events").insert({
      order_id: order.id,
      event_type: "payment_reference_submitted",
      detail: { method: order.payment_method },
    });

    return json({ ok: true, status: "awaiting_review" });
  } catch (error) {
    console.error("submit-payment-reference error:", error);
    return json({ error: "Failed to submit reference." }, 500);
  }
});
