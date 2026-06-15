import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { validateCart, type IncomingItem } from "../_shared/catalog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stateless server-side validation of a cart. Never trusts browser totals:
// every price, availability and the total are recomputed from server data.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const result = validateCart(items);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("validate-purchase error:", error);
    return new Response(JSON.stringify({ error: "Validation failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
