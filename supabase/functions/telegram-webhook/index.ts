import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const ownerChat = 7086831521;
const messageSchema = z.object({
  chat: z.object({ id: z.number().int() }),
  from: z.object({ id: z.number().int() }).optional(),
  text: z.string().max(4096).optional(),
  caption: z.string().max(4096).optional(),
  reply_to_message: z.object({ message_id: z.number().int() }).optional(),
}).passthrough();
const updateSchema = z.object({ update_id: z.number().int().nonnegative(), message: messageSchema.optional(), edited_message: messageSchema.optional() }).passthrough();
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  try {
    const apiKey = Deno.env.get("TELEGRAM_API_KEY");
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!apiKey || !url || !key) return reply({ error: "Not configured" }, 503);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`telegram-webhook:${apiKey}`));
    const expected = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    const actual = req.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
    let diff = actual.length ^ expected.length;
    for (let i = 0; i < expected.length; i++) diff |= (actual.charCodeAt(i) || 0) ^ expected.charCodeAt(i);
    if (diff !== 0) return reply({ error: "Unauthorized" }, 401);
    const raw = await req.text();
    if (raw.length > 100000) return reply({ error: "Request too large" }, 413);
    let value: unknown;
    try { value = JSON.parse(raw); } catch { return reply({ error: "Invalid JSON" }, 400); }
    const parsed = updateSchema.safeParse(value);
    if (!parsed.success) return reply({ error: "Invalid update" }, 400);
    const update = parsed.data;
    const message = update.message ?? update.edited_message;
    if (!message || message.chat.id !== ownerChat) return reply({ ok: true, ignored: true });
    const client = createClient(url, key);
    let inquiryId: string | null = null;
    if (message.reply_to_message) {
      const { data, error } = await client.from("pricing_inquiries").select("id").eq("telegram_message_id", message.reply_to_message.message_id).maybeSingle();
      if (error) return reply({ error: "Could not link reply" }, 500);
      inquiryId = data?.id ?? null;
    }
    const { error } = await client.from("telegram_messages").upsert({ update_id: update.update_id, chat_id: message.chat.id, user_id: message.from?.id ?? null, text: message.text ?? message.caption ?? null, inquiry_id: inquiryId, raw_update: value }, { onConflict: "update_id" });
    if (error) return reply({ error: "Could not save reply" }, 500);
    return reply({ ok: true });
  } catch { return reply({ error: "Could not process update" }, 500); }
});