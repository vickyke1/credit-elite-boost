import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { sendOwnerAlert } from "../_shared/telegram.ts";

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("transition_order"), orderId: z.string().regex(uuid), to: z.enum(["paid", "failed"]), reason: z.string().trim().min(1).max(200) }),
  z.object({ action: z.literal("fulfill_order"), orderId: z.string().regex(uuid), note: z.string().trim().min(1).max(2000) }),
  z.object({ action: z.literal("update_inquiry"), inquiryId: z.string().regex(uuid), status: z.enum(["new", "read", "replied", "archived"]) }),
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return reply({ error: "Service unavailable" }, 503);
  const admin = createClient(url, key);

  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return reply({ error: "Sign in required" }, 401);
  const { data: userData } = await admin.auth.getUser(auth.slice(7));
  const userId = userData.user?.id;
  if (!userId) return reply({ error: "Sign in required" }, 401);
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (isAdmin !== true) return reply({ error: "Admins only" }, 403);

  let json: unknown;
  try { json = await req.json(); } catch { return reply({ error: "Invalid request" }, 400); }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return reply({ error: "Invalid request" }, 400);
  const body = parsed.data;

  if (body.action === "transition_order") {
    const { data, error } = await admin.rpc("transition_order", { p_order: body.orderId, p_to: body.to, p_reason: `admin: ${body.reason}` });
    if (error) return reply({ error: "Could not update the order" }, 500);
    return reply({ ok: true, status: data });
  }

  if (body.action === "fulfill_order") {
    const { data: order } = await admin.from("orders").select("id,status,telegram,fulfillment_status").eq("id", body.orderId).maybeSingle();
    if (!order) return reply({ error: "Order not found" }, 404);
    if (!["paid", "overpaid"].includes(order.status)) return reply({ error: "Only paid orders can be fulfilled" }, 409);
    if (order.fulfillment_status === "fulfilled") return reply({ ok: true, already: true });
    const { error } = await admin.from("orders").update({ fulfillment_status: "fulfilled", fulfillment_note: body.note, fulfilled_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", body.orderId);
    if (error) return reply({ error: "Could not mark the order fulfilled" }, 500);
    await sendOwnerAlert(`Order fulfilled\nOrder: ${order.id}\nBuyer Telegram: @${order.telegram}\nNote: ${body.note}`);
    return reply({ ok: true });
  }

  const { error } = await admin.from("pricing_inquiries").update({ status: body.status }).eq("id", body.inquiryId);
  if (error) return reply({ error: "Could not update the inquiry" }, 500);
  return reply({ ok: true });
});
