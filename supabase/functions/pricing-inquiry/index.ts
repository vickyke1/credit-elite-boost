import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { z } from "npm:zod@3.23.8";
import DOMPurify from "npm:isomorphic-dompurify@2.22.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { inquiryNotification } from "./telegram-message.ts";

const cors = corsHeaders;
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
    const { data: claimed, error: claimError } = await client.rpc("claim_inquiry_notification", { p_id: values.id, p_ip_hash: ipHash });
    if (claimError) return reply({ success: true, id: data, notificationStatus: "failed" });
    const inquiry = claimed?.[0];
    if (!inquiry) {
      const { data: existing } = await client.from("pricing_inquiries").select("notification_status").eq("id", values.id).eq("ip_hash", ipHash).maybeSingle();
      return reply({ success: true, id: data, notificationStatus: existing?.notification_status ?? "failed" });
    }
    let notificationStatus = "failed";
    let messageId: number | null = null;
    let providerFailure: { status: number; details: string } | undefined;
    try {
      const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
      const telegramKey = Deno.env.get("TELEGRAM_API_KEY");
      if (!gatewayKey || !telegramKey) throw new Error("Telegram connection is not configured");
      const response = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
        method: "POST", headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": telegramKey, "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: 7086831521, text: inquiryNotification(inquiry) }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        const details = await response.text();
        console.error(`Telegram failed [${response.status}]: ${details}`);
        providerFailure = { status: response.status, details };
      } else {
        const result = await response.json();
        if (result.ok === true && typeof result.result?.message_id === "number") {
          messageId = result.result.message_id;
          notificationStatus = "sent";
        } else {
          providerFailure = { status: result.error_code ?? 502, details: result.description ?? "Telegram rejected the notification" };
          console.error("Telegram rejected notification", providerFailure);
        }
      }
    } catch (error) { console.error("Telegram delivery failed", error instanceof Error ? error.message : "Unknown error"); }
    const { error: statusError } = await client.from("pricing_inquiries").update({ notification_status: notificationStatus, telegram_message_id: messageId }).eq("id", values.id).eq("ip_hash", ipHash);
    if (statusError) console.error("Could not persist Telegram delivery status");
    return reply({ success: true, id: data, notificationStatus, ...(providerFailure ? { notificationError: providerFailure } : {}) });
  } catch {
    return reply({ error: "We couldn't save your inquiry. Please try again." }, 500);
  }
});