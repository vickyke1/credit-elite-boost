/**
 * TradingView → Telegram forwarder for CNX PRO v3 alerts.
 *
 * Deploy as a Cloudflare Worker. Secrets to configure (Settings → Variables and Secrets):
 *   BOT_TOKEN   (Secret)     – Telegram bot token from @BotFather
 *   CHAT_ID     (Secret/text)– your Telegram chat id
 *   HOOK_SECRET (Secret)     – optional; if set, the webhook URL becomes
 *                              https://<worker>.workers.dev/hook-<HOOK_SECRET>
 *                              and any other path is rejected.
 *
 * Optional KV binding (Settings → Bindings → KV Namespace, variable name SIGNALS):
 *   when bound, every parsed alert is stored and the latest one is served at
 *   GET /signal-<HOOK_SECRET> as JSON — this is what the MT5 executor EA polls.
 *
 * Expected alert payload (pipe-separated, as emitted by the CNX PRO v3 script):
 *   CNX PRO v3 LONG | US100 | 15 | Entry 29789.85 | SL 29714.20 | TP1 29900.10 | TP2 30010.55 | Score 5/7
 * Anything that doesn't match is forwarded verbatim, so plain-text alerts still arrive.
 */

// MarkdownV2 requires escaping these characters in regular text; inside
// code spans only backslash and backtick are escaped.
const MDV2_SPECIALS = /[_*[\]()~`>#+\-=|{}.!\\]/g;
const esc = (s) => String(s).replace(MDV2_SPECIALS, "\\$&");
const escCode = (s) => String(s).replace(/[\\`]/g, "\\$&");

function parseCnxAlert(text) {
  const parts = text.split("|").map((p) => p.trim());
  if (parts.length < 4) return null;

  const head = parts[0].match(/^(.*?)\s+(LONG|SHORT)$/i);
  if (!head) return null;

  const fields = {};
  for (const part of parts.slice(3)) {
    const m = part.match(/^([A-Za-z0-9 ]+?)\s+([\d.,/]+)$/);
    if (m) fields[m[1].toUpperCase()] = m[2];
  }

  return {
    title: head[1],
    direction: head[2].toUpperCase(),
    symbol: parts[1],
    timeframe: parts[2],
    entry: fields["ENTRY"],
    sl: fields["SL"],
    tp1: fields["TP1"],
    tp2: fields["TP2"],
    score: fields["SCORE"],
  };
}

function formatTradeCard(a) {
  const icon = a.direction === "LONG" ? "🟢" : "🔴";
  const lines = [
    `${icon} *${esc(a.title)} — ${esc(a.direction)}*`,
    `📊 ${esc(a.symbol)} · ${esc(a.timeframe)}m`,
    "",
  ];
  if (a.entry) lines.push(`Entry:  \`${escCode(a.entry)}\``);
  if (a.sl) lines.push(`SL:     \`${escCode(a.sl)}\``);
  if (a.tp1) lines.push(`TP1:    \`${escCode(a.tp1)}\``);
  if (a.tp2) lines.push(`TP2:    \`${escCode(a.tp2)}\``);
  if (a.score) lines.push("", `⚖️ Confluence: ${esc(a.score)}`);
  return lines.join("\n");
}

async function sendTelegram(env, body) {
  return fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.CHAT_ID, ...body }),
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    // Polling endpoint for the MT5 executor EA: returns the latest stored
    // signal as JSON, or 204 when none exists yet. Requires the SIGNALS KV
    // binding and HOOK_SECRET (the secret gates reads the same way it gates
    // webhook posts).
    if (request.method === "GET" && env.SIGNALS && env.HOOK_SECRET) {
      if (pathname === `/signal-${env.HOOK_SECRET}`) {
        const latest = await env.SIGNALS.get("latest");
        if (!latest) return new Response(null, { status: 204 });
        return new Response(latest, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method !== "POST") return new Response("ok");

    if (env.HOOK_SECRET) {
      if (pathname !== `/hook-${env.HOOK_SECRET}`) {
        return new Response("not found", { status: 404 });
      }
    }

    const text = (await request.text()).trim();
    if (!text) return new Response("empty body", { status: 400 });

    const alert = parseCnxAlert(text);

    if (alert && env.SIGNALS) {
      await env.SIGNALS.put(
        "latest",
        JSON.stringify({ id: Date.now(), ts: new Date().toISOString(), ...alert })
      );
    }
    let r;
    if (alert) {
      r = await sendTelegram(env, {
        text: formatTradeCard(alert),
        parse_mode: "MarkdownV2",
      });
      // If Telegram rejects the formatting for any reason, fall back to plain text
      // so the alert is never lost.
      if (!r.ok) r = await sendTelegram(env, { text: "🔔 " + text });
    } else {
      r = await sendTelegram(env, { text: "🔔 " + text });
    }

    return new Response(r.ok ? "sent" : "telegram error", {
      status: r.ok ? 200 : 502,
    });
  },
};
