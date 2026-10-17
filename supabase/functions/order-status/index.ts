import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { activeProvider } from "../_shared/payments/registry.ts";
import { checkoutAvailable } from "../_shared/payments/availability.ts";

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Read-only: returns status for an order id (unguessable UUID) or the enabled coins.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  let body: { orderId?: string; currencies?: boolean; skus?: unknown };
  try { body = await req.json(); } catch { return reply({ error: "Invalid request" }, 400); }
  const provider = activeProvider();
  if (body.skus !== undefined) {
    if (!Array.isArray(body.skus) || body.skus.length === 0 || body.skus.length > 10 ||
      !body.skus.every((sku) => typeof sku === "string" && sku.length > 0 && sku.length <= 120)) {
      return reply({ error: "Invalid cart" }, 400);
    }
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return reply({ error: "Checkout temporarily unavailable" }, 503);
    const admin = createClient(url, key);
    const { data, error } = await admin.from("checkout_products")
      .select("sku,compliance_status,inventory").in("sku", body.skus);
    if (error) return reply({ error: "Couldn't check availability" }, 503);
    return reply({ available: checkoutAvailable(body.skus, data ?? []) });
  }
  if (body.currencies) {
    if (!provider.isConfigured()) return reply({ configured: false, currencies: [] });
    try { return reply({ configured: true, currencies: await provider.listCurrencies() }); }
    catch { return reply({ configured: true, currencies: [] }); }
  }
  if (!body.orderId || !uuid.test(body.orderId)) return reply({ error: "Invalid order" }, 400);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data } = await admin.from("orders").select("status,total_usd,pay_currency,created_at").eq("id", body.orderId).maybeSingle();
  if (!data) return reply({ error: "Order not found" }, 404);
  return reply(data);
});
