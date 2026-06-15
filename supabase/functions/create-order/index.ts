import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { validateCart, type IncomingItem } from "../_shared/catalog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FALLBACK_BTC_ADDRESS = "18zzeUz9UXTZ58W6TxdKCh94un8JK7Jc3t";
const BTC_WINDOW_MINUTES = 30;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const sanitize = (v: unknown, max = 200): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
const isPhone = (p: string) => p === "" || /^\+?[\d\s\-()]{10,}$/.test(p);

const genOrderNumber = () =>
  `CB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

// Best-effort spot price (USD per BTC). Runs on Supabase infra, not the dev
// sandbox, so outbound calls are allowed in production. Returns null on failure.
const fetchBtcUsd = async (): Promise<number | null> => {
  const url = Deno.env.get("BTC_RATE_API_URL") ||
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.bitcoin?.usd ?? data?.price ?? data?.data?.amount;
    const num = Number(price);
    return Number.isFinite(num) && num > 0 ? num : null;
  } catch (_e) {
    return null;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

  try {
    const body = await req.json();

    // --- Validate customer details (server-side) ---
    const customerName = sanitize(body?.customer?.name, 120);
    const email = sanitize(body?.customer?.email, 254).toLowerCase();
    const phone = sanitize(body?.customer?.phone, 20);
    const method = sanitize(body?.paymentMethod, 16);
    const consent = body?.consentAccepted === true;
    const billing = body?.billingAddress ?? null;

    if (customerName.length < 2) return json({ error: "A valid full name is required." }, 400);
    if (!isEmail(email)) return json({ error: "A valid email is required." }, 400);
    if (!isPhone(phone)) return json({ error: "A valid phone number is required." }, 400);
    if (!["card", "cashapp", "venmo", "bitcoin"].includes(method)) {
      return json({ error: "Unsupported payment method." }, 400);
    }
    if (!consent) return json({ error: "You must accept the terms to continue." }, 400);

    // --- Re-validate the cart from server data (never trust the client) ---
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const validation = validateCart(items);
    if (!validation.valid) {
      return json({ error: "Cart validation failed.", validation }, 422);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Optional: link order to an authenticated user if a valid JWT was sent.
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userId = data?.user?.id ?? null;
    }

    const orderNumber = genOrderNumber();
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_name: customerName,
        email,
        phone: phone || null,
        billing_address: billing,
        payment_method: method,
        payment_status: method === "bitcoin" ? "pending" : "awaiting_review",
        subtotal_cents: validation.subtotalCents,
        discount_cents: 0,
        total_cents: validation.totalCents,
        consent_accepted: true,
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error("order insert error:", orderErr);
      return json({ error: "Could not create order." }, 500);
    }

    // Order items
    const itemRows = validation.items.map((it) => ({
      order_id: order.id,
      product_type: it.productType,
      product_ref: it.productRef,
      name: it.name,
      unit_price_cents: it.unitPriceCents,
      quantity: it.quantity,
    }));
    await supabase.from("order_items").insert(itemRows);

    // Payment-method specific records
    let btc: Record<string, unknown> | null = null;
    if (method === "bitcoin") {
      const address = Deno.env.get("BITCOIN_ADDRESS") || FALLBACK_BTC_ADDRESS;
      const rate = await fetchBtcUsd();
      const usd = validation.totalCents / 100;
      const expectedBtc = rate ? Number((usd / rate).toFixed(8)) : null;
      const expiresAt = new Date(Date.now() + BTC_WINDOW_MINUTES * 60_000).toISOString();

      const { data: btcRow } = await supabase
        .from("bitcoin_payments")
        .insert({
          order_id: order.id,
          wallet_address: address,
          expected_amount_btc: expectedBtc,
          expected_amount_usd_cents: validation.totalCents,
          status: "pending",
          expires_at: expiresAt,
        })
        .select()
        .single();
      btc = btcRow;
    } else if (method === "cashapp" || method === "venmo") {
      await supabase.from("manual_payment_reviews").insert({
        order_id: order.id,
        method,
        review_status: "pending",
      });
    }

    await supabase.from("payment_events").insert({
      order_id: order.id,
      event_type: "order_created",
      detail: { method, total_cents: validation.totalCents },
    });

    return json({
      orderId: order.id,
      orderNumber,
      accessToken: order.access_token,
      paymentMethod: method,
      totalCents: validation.totalCents,
      bitcoin: btc
        ? {
          address: btc.wallet_address,
          expectedBtc: btc.expected_amount_btc,
          expiresAt: btc.expires_at,
        }
        : null,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return json({ error: "An error occurred creating your order." }, 500);
  }
});
