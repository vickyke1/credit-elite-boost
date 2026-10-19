import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { refreshChannelInventoryPost } from "./channel_post.ts";
import { cashAppLink, transitionManualPayment } from "./manual-payments.ts";

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
    if (!message && !update.callback_query) return reply({ ok: true, ignored: true });
    const client = createClient(url, key);
    const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
    const sendTelegram = async (chatId: number | string, text: string, replyMarkup?: unknown) => {
      if (!gatewayKey) throw new Error("Telegram unavailable");
      const response = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
        method: "POST",
        headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Telegram delivery failed");
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

    const sendPhoto = async (chatId: number | string, photo: string, caption: string, replyMarkup?: unknown) => {
      if (!gatewayKey) return;
      await fetch("https://connector-gateway.lovable.dev/telegram/sendPhoto", {
        method: "POST",
        headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, photo, caption, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) }),
        signal: AbortSignal.timeout(15000),
      });
    };

    // Button taps: buy:<sku> (choose method), crypto:<sku>, fiat:<sku>, fiatsent:<orderId>.
    const callback = update.callback_query;
    if (callback) {
      const data = callback.data ?? "";
      const chatId = callback.message?.chat.id ?? callback.from.id;
      const [action, arg] = data.split(":");
      const username = callback.from.username;
      if (chatId !== callback.from.id) {
        await answerCallback(callback.id, "Open a private chat with this bot to purchase.");
        return reply({ ok: true });
      }

      if (action === "buy" && arg) {
        await answerCallback(callback.id);
        await sendTelegram(chatId, "How would you like to pay?", {
          inline_keyboard: [
            [{ text: "Pay with crypto (auto-confirmed)", callback_data: `crypto:${arg}` }],
            [{ text: "Pay with Cash App (owner reviewed)", callback_data: `cashapp:${arg}` }],
            [{ text: "Pay with Zelle / Venmo", callback_data: `fiat:${arg}` }],
          ],
        });
        return reply({ ok: true });
      }

      if ((action === "crypto" || action === "fiat" || action === "cashapp") && arg) {
        if (!username) {
          await answerCallback(callback.id, "Set a Telegram username first (Settings → Username), then tap again.");
          return reply({ ok: true });
        }
        if (action === "crypto") {
          await answerCallback(callback.id, "Creating your order…");
          try {
            const res = await fetch(`${url}/functions/v1/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ skus: [arg], telegram: username }),
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
        // Fiat: create a manual order and show the Zelle/Venmo handles.
        await answerCallback(callback.id, "Reserving your order…");
        const zelle = Deno.env.get("ZELLE_HANDLE");
        const venmo = Deno.env.get("VENMO_HANDLE");
        const cashUrl = cashAppLink(Deno.env.get("CASH_APP_CASHTAG"));
        if ((action === "cashapp" && !cashUrl) || (action === "fiat" && !zelle && !venmo)) {
          await sendTelegram(chatId, `${action === "cashapp" ? "Cash App" : "Zelle/Venmo"} checkout isn't set up yet. Please pay with crypto or message @cpncreditboost.`);
          return reply({ ok: true });
        }
        const ipHash = `tg:${callback.from.id}`;
        const { data: orderId, error: orderErr } = await client.rpc("create_checkout_order", {
          p_skus: [arg], p_telegram: username, p_user_id: null, p_ip_hash: ipHash, p_provider: action === "cashapp" ? "cashapp_manual" : "manual",
        });
        if (orderErr || !orderId) {
          const msg = String(orderErr?.message ?? "");
          await sendTelegram(chatId, msg.includes("sold_out") ? "That item just sold out." : msg.includes("rate_limit") ? "Too many attempts — please try again later." : "We couldn't start your order. Please try again or message @cpncreditboost.");
          return reply({ ok: true });
        }
        const { data: order, error: readError } = await client.from("orders").select("total_usd").eq("id", orderId).single();
        if (readError || !order || Number(order.total_usd) <= 0) throw new Error("Could not read order total");
        const handles = [zelle ? `Zelle: ${zelle}` : null, venmo ? `Venmo: ${venmo}` : null].filter(Boolean).join("\n");
        await sendTelegram(
          chatId,
          `Your order is reserved.\n\nOrder: ${String(orderId).slice(0, 8)}\nAmount: $${Number(order.total_usd).toFixed(2)} USD\n\n${action === "cashapp" ? "Open Cash App below and enter the exact amount shown above. This is a cash payment, not a Bitcoin transfer." : `Send the exact amount to:\n${handles}`}\n\nInclude your order number in the payment note, then tap "I've sent it" below. This only requests review; the owner must verify receipt before your order is marked paid.`,
          { inline_keyboard: [...(action === "cashapp" && cashUrl ? [[{ text: "Open Cash App", url: cashUrl }]] : []), [{ text: "I've sent it", callback_data: `fiatsent:${orderId}` }], [{ text: "Check order status", url: `https://credit-elite-boost.lovable.app/order/${orderId}` }]] },
        );
        return reply({ ok: true });
      }

      if (action === "fiatsent" && arg) {
        const { data: order } = await client.from("orders").select("id,status,total_usd,telegram,provider,ip_hash").eq("id", arg).maybeSingle();
        if (!order || order.ip_hash !== `tg:${callback.from.id}` || !["manual", "cashapp_manual"].includes(order.provider)) {
          await answerCallback(callback.id, "This manual order isn't yours.");
          return reply({ ok: true });
        }
        const transition = await transitionManualPayment((name, args) => client.rpc(name, args), order.id, callback.from.id, "review");
        if (!transition.changed) {
          await answerCallback(callback.id, "This order is no longer awaiting payment.");
          return reply({ ok: true });
        }
        await answerCallback(callback.id, "Thanks! We'll confirm as soon as your payment arrives.");
        await sendTelegram(chatId, "Thanks — your payment is being reviewed. You'll get a message here as soon as it's confirmed.");
        await sendTelegram(ownerChat, `${order.provider === "cashapp_manual" ? "Cash App" : "Fiat"} payment to review (not verified):\nOrder ${order.id} — $${order.total_usd} — @${order.telegram}\n\nVerify receipt in your payment account first.\nConfirm with: /confirm ${order.id}\nReject with: /reject ${order.id}`);
        return reply({ ok: true });
      }

      await answerCallback(callback.id);
      return reply({ ok: true });
    }

    // Public command: "/shop" or "/start" lists approved products as buy buttons, with photos when set.
    if (!message) return reply({ ok: true, ignored: true });
    const command = (message.text ?? "").trim().toLowerCase();
    if (command.startsWith("/shop") || command.startsWith("/start")) {
      const { data: products } = await client.from("checkout_products").select("sku,name,price_usd,inventory,image_url").eq("compliance_status", "approved").gt("inventory", 0).order("price_usd", { ascending: true }).limit(20);
      const list = products ?? [];
      if (list.length > 0) {
        const withPhoto = list.filter((p) => p.image_url);
        const withoutPhoto = list.filter((p) => !p.image_url);
        await sendTelegram(message.chat.id, "CpnCreditBoost — live inventory.\n\nTap a package to start your order. Crypto payments are verified automatically; Cash App and Zelle/Venmo require owner review when configured.");
        for (const p of withPhoto) {
          await sendPhoto(
            message.chat.id,
            p.image_url,
            `$${p.price_usd} — ${p.name}\n${p.inventory} available`,
            { inline_keyboard: [[{ text: "Buy this package", callback_data: `buy:${p.sku}` }]] },
          );
        }
        if (withoutPhoto.length > 0) {
          const keyboard = withoutPhoto.map((p) => [{ text: `$${p.price_usd} — ${p.name} (${p.inventory} left)`, callback_data: `buy:${p.sku}` }]);
          await sendTelegram(message.chat.id, "More packages:", { inline_keyboard: keyboard });
        }
      } else {
        await sendTelegram(message.chat.id, "Our inventory is being restocked. Message @cpncreditboost for availability.");
      }
    }

    if (message.chat.id !== ownerChat || message.from?.id !== ownerChat) return reply({ ok: true, ignored: true });
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

    // Owner command: "/confirm <orderId8>" marks a reviewed fiat order paid; "/reject <orderId8>" cancels it and restocks.
    const confirmMatch = (message.text ?? "").trim().match(/^\/(confirm|reject)\s+([0-9a-f]{8}(?:-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?)$/i);
    if (confirmMatch) {
      const [, action, prefix] = confirmMatch;
      const { data: candidates, error: lookupError } = await client.from("orders").select("id,status,total_usd,telegram,ip_hash").eq("status", "review").in("provider", ["manual", "cashapp_manual"]).gte("id", prefix.length === 8 ? `${prefix}-0000-0000-0000-000000000000` : prefix).lte("id", prefix.length === 8 ? `${prefix}-ffff-ffff-ffff-ffffffffffff` : prefix).limit(2);
      if (lookupError) throw new Error("Order lookup failed");
      const order = candidates?.length === 1 ? candidates[0] : null;
      if (!order) {
        await sendTelegram(ownerChat, `No unique manual order awaiting review found for ${prefix}. Use the full order ID from the alert.`);
      } else {
        const to = action.toLowerCase() === "confirm" ? "paid" : "failed";
        const transition = await transitionManualPayment((name, args) => client.rpc(name, args), order.id, message.from.id, to);
        await sendTelegram(ownerChat, transition.changed ? `Order ${prefix} (@${order.telegram}, $${order.total_usd}) marked ${transition.status}.${to === "failed" ? " Stock returned." : ""}` : `Order ${prefix} was already processed; no change made.`);
        if (transition.changed && /^tg:[0-9]+$/.test(order.ip_hash)) {
          await sendTelegram(Number(order.ip_hash.slice(3)), `Order ${order.id.slice(0, 8)}: ${to === "paid" ? "your payment has been confirmed by the owner." : "your payment was not confirmed. Please message @cpncreditboost for help."}`);
        }
      }
    }

    // Owner command: "/setphoto SKU | https://image-url" sets a product photo and posts it to the channel.
    if (command.startsWith("/setphoto ")) {
      const parts = (message.text ?? "").trim().slice(10).split("|").map((s) => s.trim());
      const [sku, imageUrl] = parts;
      if (!sku || !imageUrl || !/^https:\/\//i.test(imageUrl)) {
        await sendTelegram(ownerChat, "Usage: /setphoto SKU | https://image-url.jpg");
      } else {
        const { data: product, error: photoErr } = await client
          .from("checkout_products")
          .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
          .eq("sku", sku)
          .select("sku,name,price_usd,inventory")
          .maybeSingle();
        if (photoErr || !product) {
          await sendTelegram(ownerChat, `Could not set photo: ${photoErr?.message ?? "product not found"}`);
        } else {
          await sendTelegram(ownerChat, `Photo set for ${sku}. It now shows in /shop.`);
          await sendPhoto(
            "@cpncreditboost",
            imageUrl,
            `$${product.price_usd} — ${product.name}\n${product.inventory ?? 0} available\n\nOrder here: https://t.me/Cpn_creditboost_Bot`,
            { inline_keyboard: [[{ text: "View all packages", url: "https://cpncreditboost.com/tradelines" }]] },
          );
          await refreshChannelInventoryPost(client);
        }
      }
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