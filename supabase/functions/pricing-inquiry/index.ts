import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { z } from "npm:zod@3.23.8";
import DOMPurify from "npm:isomorphic-dompurify@2.22.0";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const schema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  telegram: z.string().trim().regex(/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/),
  service: z.enum(["credit-education", "credit-repair", "authorized-user-tradelines"]),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const clean = (text: string) => DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 12000) return reply({ error: "Request too large" }, 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request" }, 400); }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return reply({ error: "Please check your inquiry details." }, 400);
    const values = parsed.data;
    const name = clean(values.name);
    const message = clean(values.message);
    if (!name || message.length < 10) return reply({ error: "Please enter a name and a meaningful message." }, 400);
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return reply({ error: "Inquiries are temporarily unavailable." }, 503);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${key}:${ip}`));
    const ipHash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
    const client = createClient(url, key);
    const { data, error } = await client.rpc("save_pricing_inquiry", { p_id: values.id, p_name: name, p_telegram: values.telegram.replace(/^@/, ""), p_service: values.service, p_message: message, p_ip_hash: ipHash });
    if (error) {
      if (error.message.includes("rate_limit_exceeded")) return reply({ error: "Too many inquiries. Please try again in an hour." }, 429);
      return reply({ error: "We couldn't save your inquiry. Please try again." }, 500);
    }
    return reply({ success: true, id: data, notificationStatus: "not_configured" });
  } catch {
    return reply({ error: "We couldn't save your inquiry. Please try again." }, 500);
  }
});