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

// Returns a single order by its opaque access_token (guest-safe) OR a list of
// orders by email + access_token. Delivered content is only returned once the
// order is marked paid, protecting downloads to the correct customer.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

  try {
    const body = await req.json();
    const accessToken = typeof body?.accessToken === "string" ? body.accessToken.trim() : "";
    if (!accessToken) return json({ error: "Missing access token." }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("access_token", accessToken)
      .maybeSingle();

    if (error || !order) return json({ error: "Order not found." }, 404);

    const [{ data: items }, { data: btc }, { data: reviews }, { data: deliveries }] =
      await Promise.all([
        supabase.from("order_items").select("*").eq("order_id", order.id),
        supabase.from("bitcoin_payments").select("*").eq("order_id", order.id).maybeSingle(),
        supabase.from("manual_payment_reviews").select("*").eq("order_id", order.id),
        supabase.from("order_deliveries").select("*").eq("order_id", order.id),
      ]);

    // Payment instructions resolved server-side from env (no secrets in client).
    const instructions = {
      cashappHandle: Deno.env.get("CASHAPP_HANDLE") || null,
      venmoHandle: Deno.env.get("VENMO_HANDLE") || null,
      cardGatewayConfigured: Boolean(Deno.env.get("CARD_GATEWAY_PUBLIC_KEY")),
    };

    // Only expose delivered content if the order is actually paid.
    const safeDeliveries = order.payment_status === "paid" ? (deliveries ?? []) : [];

    return json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        email: order.email,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        deliveryStatus: order.delivery_status,
        subtotalCents: order.subtotal_cents,
        totalCents: order.total_cents,
        createdAt: order.created_at,
      },
      items: items ?? [],
      bitcoin: btc ?? null,
      manualReviews: reviews ?? [],
      deliveries: safeDeliveries,
      instructions,
    });
  } catch (error) {
    console.error("get-order error:", error);
    return json({ error: "Failed to load order." }, 500);
  }
});
