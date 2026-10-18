// Pinned, auto-updating inventory post in the Telegram channel.
// The bot must be an administrator of the channel with post + pin rights.

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { escapeHtml, telegramApi } from "./telegram.ts";

const CHANNEL_ID = "@cpncreditboost";

const fmtMoney = (n: number) => `$${n.toLocaleString("en-US")}`;

export function buildChannelInventoryText(
  products: Array<{ name: string; price: number; stock: number }>,
): string {
  const lines: string[] = [
    "<b>CpnCreditBoost — Live Inventory</b>",
    "",
  ];
  if (products.length === 0) {
    lines.push("No products listed right now. Check back soon.");
  } else {
    for (const p of products) {
      const stock = p.stock > 0 ? `${p.stock} available` : "sold out";
      lines.push(`• <b>${escapeHtml(p.name)}</b> — ${fmtMoney(p.price)} (${stock})`);
    }
  }
  lines.push(
    "",
    "To order or ask questions, message us on Telegram:",
    "https://t.me/cpncreditboost",
    "",
    `<i>Updated ${new Date().toUTCString()}</i>`,
  );
  return lines.join("\n");
}

// Creates the pinned post on first run, then edits it in place on every update.
// Returns { ok, error? } so callers can surface setup problems (e.g. bot not admin).
export async function refreshChannelInventoryPost(
  supabase: SupabaseClient,
): Promise<{ ok: boolean; error?: string }> {
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("name, price, stock")
    .eq("is_active", true)
    .order("price", { ascending: true });
  if (prodErr) return { ok: false, error: prodErr.message };

  const text = buildChannelInventoryText(products ?? []);

  const { data: state } = await supabase
    .from("telegram_channel_post")
    .select("message_id")
    .eq("id", true)
    .maybeSingle();

  if (state?.message_id) {
    const edit = await telegramApi("editMessageText", {
      chat_id: CHANNEL_ID,
      message_id: state.message_id,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    if (edit.ok) {
      await supabase
        .from("telegram_channel_post")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", true);
      return { ok: true };
    }
    // Message was deleted or is otherwise uneditable — fall through and post a new one.
    const desc = String(edit.body?.description ?? "");
    if (!/message to edit not found|message can't be edited|message_id_invalid/i.test(desc)) {
      return { ok: false, error: desc || `editMessageText failed (${edit.status})` };
    }
  }

  const sent = await telegramApi("sendMessage", {
    chat_id: CHANNEL_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  if (!sent.ok) {
    const desc = String(sent.body?.description ?? `sendMessage failed (${sent.status})`);
    return { ok: false, error: desc };
  }
  const messageId = sent.body?.result?.message_id as number | undefined;
  if (!messageId) return { ok: false, error: "Telegram did not return a message id" };

  await supabase.from("telegram_channel_post").upsert({
    id: true,
    message_id: messageId,
    updated_at: new Date().toISOString(),
  });

  // Pin it (best-effort: posting succeeded even if pinning fails).
  await telegramApi("pinChatMessage", {
    chat_id: CHANNEL_ID,
    message_id: messageId,
    disable_notification: true,
  });

  return { ok: true };
}
