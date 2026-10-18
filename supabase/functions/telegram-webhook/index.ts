import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { refreshChannelInventoryPost } from "./channel_post.ts";

const ownerChat = 7086831521;
const messageSchema = z.object({
  chat: z.object({ id: z.number().int() }),
  from: z.object({ id: z.number().int() }).optional(),
  text: z.string().max(4096).optional(),
  caption: z.string().max(4096).optional(),
  reply_to_message: z.object({ message_id: z.number().int() }).optional(),
}).passthrough();
const callbackSchema = z.object({
  id: z.string(),
  from: z.object({ id: z.number().int(), username: z.string().max(64).optional() }),
  message: z.object({ chat: z.object({ id: z.number().int() }) }).optional(),
  data: z.string().max(128).optional(),
}).passthrough();
const updateSchema = z.object({ update_id: z.number().int().nonnegative(), message: messageSchema.optional(), edited_message: messageSchema.optional(), callback_query: callbackSchema.optional() }).passthrough();
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
    const sendTelegram = async (chatId: number, text: string, replyMarkup?: unknown) => {
      if (!gatewayKey) return;
      await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
        method: "POST",
        headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) }),
        signal: AbortSignal.timeout(10000),
      });
    };
    const answerCallback = async (id: string, text?: string) => {
      if (!gatewayKey) return;
      await fetch("https://connector-gateway.lovable.dev/telegram/answerCallbackQuery", {
        method: "POST",
        headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: id, ...(text ? { text } : {}) }),
        signal: AbortSignal.timeout(10000),
      });
    };

    // Button tap: "buy:<sku>" creates the order and returns a secure payment link.
    const callback = update.callback_query;
    if (callback) {
      const data = callback.data ?? "";
      const chatId = callback.message?.chat.id ?? callback.from.id;
      if (!data.startsWith("buy:")) {
        await answerCallback(callback.id);
        return reply({ ok: true });
      }
      const sku = data.slice(4).trim();
      const username = callback.from.username;
      if (!username) {
        await answerCallback(callback.id, "Set a Telegram username first (Settings → Username), then tap again.");
        return reply({ ok: true });
      }
      await answerCallback(callback.id, "Creating your order…");
      try {
        const res = await fetch(`${url}/functions/v1/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skus: [sku], telegram: username }),
          signal: AbortSignal.timeout(20000),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.paymentUrl) {
          await sendTelegram(
            chatId,
            `Your order is ready.\n\nOrder: ${String(body.orderId).slice(0, 8)}\nTap below to pay securely with crypto. Your order is confirmed automatically once the payment is verified.`,
            { inline_keyboard: [[{ text: "Pay securely", url: body.paymentUrl }], [{ text: "Check order status", url: `https://cpncreditboost.com/order/${body.orderId}` }]] },
          );
        } else {
          await sendTelegram(chatId, body.error ?? "We couldn't start checkout for that item. Please try again or message @cpncreditboost.");
        }
      } catch {
        await sendTelegram(chatId, "Checkout is temporarily unavailable. Please try again shortly.");
      }
      return reply({ ok: true });
    }

    // Public command: "/shop" or "/start" lists approved products as buy buttons.
    const command = (message.text ?? "").trim().toLowerCase();
    if (command.startsWith("/shop") || command.startsWith("/start")) {
      const { data: products } = await client.from("checkout_products").select("sku,name,price_usd,inventory").eq("compliance_status", "approved").gt("inventory", 0).order("price_usd", { ascending: true }).limit(20);
      if ((products ?? []).length > 0) {
        const keyboard = (products ?? []).map((p) => [{ text: `$${p.price_usd} — ${p.name} (${p.inventory} left)`, callback_data: `buy:${p.sku}` }]);
        await sendTelegram(
          message.chat.id,
          "CpnCreditBoost — live inventory.\n\nTap a package below to start your order. You'll get a secure crypto payment link right here in chat, and your order confirms automatically once payment is verified.",
          { inline_keyboard: keyboard },
        );
      } else {
        await sendTelegram(message.chat.id, "Our inventory is being restocked. Message @cpncreditboost for availability.");
      }
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
      await sendTelegram(ownerChat, text);
    }

    // Owner command: "/postshop" publishes/refreshes the pinned inventory post in the channel.
    if (command.startsWith("/postshop")) {
      const result = await refreshChannelInventoryPost(client);
      await sendTelegram(ownerChat, result.ok
        ? "Channel inventory post is up to date and pinned in @cpncreditboost."
        : `Could not update the channel post: ${result.error}\n\nMake sure this bot is an administrator of the channel with permission to post and pin messages.`);
    }

    // Owner command: "/add SKU | Name | price | inventory" adds an approved product to the shop.
    if (command.startsWith("/add ")) {
      const parts = (message.text ?? "").trim().slice(5).split("|").map((s) => s.trim());
      const [sku, name, priceStr, invStr] = parts;
      const price = Number(priceStr);
      const inv = Number(invStr ?? "1");
      if (parts.length < 3 || !sku || !name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(inv) || inv < 0) {
        await sendTelegram(ownerChat, "Usage: /add SKU | Name | price | inventory\nExample: /add TL0030 | Chase Sapphire $50,000 limit, 12y age | 850 | 5");
      } else {
        const { error } = await client.from("checkout_products").upsert(
          { sku, name, category: "tradeline", price_usd: price, inventory: inv, compliance_status: "approved", updated_at: new Date().toISOString() },
          { onConflict: "sku" },
        );
        await sendTelegram(ownerChat, error
          ? `Could not save product: ${error.message}`
          : `Product saved: ${sku} — ${name} — $${price} — ${inv} in stock. It now appears in /shop.`);
        if (!error) await refreshChannelInventoryPost(client);
      }
    }
    return reply({ ok: true });
  } catch { return reply({ error: "Could not process update" }, 500); }
});