// Pinned, auto-updating inventory post in the Telegram channel.
// The bot must be an administrator of the channel with post + pin rights.

import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

const CHANNEL_ID = "@cpncreditboost";

async function channelApi(
  method: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; body?: any; status: number }> {
  const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
  const apiKey = Deno.env.get("TELEGRAM_API_KEY");
  if (!gatewayKey || !apiKey) return { ok: false, status: 0 };
  const res = await fetch(`https://connector-gateway.lovable.dev/telegram/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${gatewayKey}`,
      "X-Connection-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const json = await res.json().catch(() => undefined);
  return { ok: res.ok && json?.ok === true, body: json, status: res.status };
}

export function buildChannelInventoryText(
  products: Array<{ name: string; price_usd: number; inventory: number }>,
): string {
  const lines: string[] = ["CpnCreditBoost — Live Inventory", ""];
  if (products.length === 0) {
    lines.push("Inventory is being restocked. Check back soon.");
  } else {
    for (const p of products) {
      const stock = p.inventory > 0 ? `${p.inventory} available` : "sold out";
      lines.push(`• $${p.price_usd.toLocaleString("en-US")} — ${p.name} (${stock})`);
    }
  }
  lines.push(
    "",
    "View details and check out securely:",
    "https://cpncreditboost.com/tradelines",
    "",
    `Updated ${new Date().toUTCString()}`,
  );
  return lines.join("\n");
}

// Creates the pinned post on first run, then edits it in place on every update.
export async function refreshChannelInventoryPost(
  client: SupabaseClient,
): Promise<{ ok: boolean; error?: string }> {
  const { data: products, error: prodErr } = await client
    .from("checkout_products")
    .select("name, price_usd, inventory")
    .eq("compliance_status", "approved")
    .order("price_usd", { ascending: true })
    .limit(30);
  if (prodErr) return { ok: false, error: prodErr.message };

  const text = buildChannelInventoryText(products ?? []);

  const { data: state } = await client
    .from("telegram_channel_post")
    .select("message_id")
    .eq("id", true)
    .maybeSingle();

  if (state?.message_id) {
    const edit = await channelApi("editMessageText", {
      chat_id: CHANNEL_ID,
      message_id: state.message_id,
      text,
      disable_web_page_preview: true,
    });
    if (edit.ok) {
      await client
        .from("telegram_channel_post")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", true);
      return { ok: true };
    }
    const desc = String(edit.body?.description ?? "");
    if (!/message to edit not found|message can't be edited|message_id_invalid|message is not modified/i.test(desc)) {
      return { ok: false, error: desc || `editMessageText failed (${edit.status})` };
    }
    if (/message is not modified/i.test(desc)) return { ok: true };
    // Message was deleted — fall through and post a new one.
  }

  const sent = await channelApi("sendMessage", {
    chat_id: CHANNEL_ID,
    text,
    disable_web_page_preview: true,
  });
  if (!sent.ok) {
    return { ok: false, error: String(sent.body?.description ?? `sendMessage failed (${sent.status})`) };
  }
  const messageId = sent.body?.result?.message_id as number | undefined;
  if (!messageId) return { ok: false, error: "Telegram did not return a message id" };

  await client.from("telegram_channel_post").upsert({
    id: true,
    message_id: messageId,
    updated_at: new Date().toISOString(),
  });

  // Pin it (best-effort: the post is live even if pinning fails).
  await channelApi("pinChatMessage", {
    chat_id: CHANNEL_ID,
    message_id: messageId,
    disable_notification: true,
  });

  return { ok: true };
}
