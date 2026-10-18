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
    if (!message) return reply({ ok: true, ignored: true });
    const client = createClient(url, key);
    const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
    const sendTelegram = async (chatId: number, text: string) => {
      if (!gatewayKey) return;
      await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
        method: "POST",
        headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(10000),
      });
    };

    // Public command: "/shop" or "/start" lists approved products with buy links.
    const command = (message.text ?? "").trim().toLowerCase();
    if (command.startsWith("/shop") || command.startsWith("/start")) {
      const { data: products } = await client.from("checkout_products").select("sku,name,price_usd,inventory").eq("compliance_status", "approved").gt("inventory", 0).order("price_usd", { ascending: true }).limit(20);
      const lines = (products ?? []).map((p) => `$${p.price_usd} — ${p.name}\nhttps://cpncreditboost.com/tradelines`);
      const text = lines.length > 0
        ? `CpnCreditBoost inventory (${lines.length} available):\n\n${lines.join("\n\n")}\n\nTap a link to view details and check out securely with crypto.`
        : "Our inventory is being restocked. Message @cpncreditboost for availability.";
      await sendTelegram(message.chat.id, text);
    }

    if (message.chat.id !== ownerChat) return reply({ ok: true, ignored: true });
    let inquiryId: string | null = null;
    if (message.reply_to_message) {
      const { data, error } = await client.from("pricing_inquiries").select("id").eq("telegram_message_id", message.reply_to_message.message_id).maybeSingle();
      if (error) return reply({ error: "Could not link reply" }, 500);
      inquiryId = data?.id ?? null;
    }
    const { error } = await client.from("telegram_messages").upsert({ update_id: update.update_id, chat_id: message.chat.id, user_id: message.from?.id ?? null, text: message.text ?? message.caption ?? null, inquiry_id: inquiryId, raw_update: value }, { onConflict: "update_id" });
    if (error) return reply({ error: "Could not save reply" }, 500);

    // Owner command: "/orders" lists recent orders with status, amount and buyer.
    if ((message.text ?? "").trim().toLowerCase().startsWith("/orders")) {
      const { data: orders } = await client.from("orders").select("id,status,total_usd,telegram,created_at,fulfillment_status").order("created_at", { ascending: false }).limit(10);
      const lines = (orders ?? []).map((o) =>
        `${o.status.toUpperCase()} $${o.total_usd} — @${o.telegram} — ${o.fulfillment_status} — ${o.id.slice(0, 8)}`
      );
      const text = lines.length > 0 ? `Recent orders (newest first):\n${lines.join("\n")}` : "No orders yet.";
      const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
      if (gatewayKey) {
        await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
          method: "POST",
          headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: ownerChat, text }),
          signal: AbortSignal.timeout(10000),
        });
      }
    }
    return reply({ ok: true });
  } catch { return reply({ error: "Could not process update" }, 500); }
});