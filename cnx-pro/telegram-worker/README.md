# CNX PRO v3 → Telegram alert forwarder

A Cloudflare Worker that receives TradingView webhook alerts from the
CNX PRO v3 Pine Script and pushes them to Telegram as formatted trade cards.

Alerts that match the CNX PRO payload format arrive looking like:

> 🟢 **CNX PRO v3 — LONG**
> 📊 US100 · 15m
>
> Entry:  `29789.85`
> SL:     `29714.20`
> TP1:    `29900.10`
> TP2:    `30010.55`
>
> ⚖️ Confluence: 5/7

Anything else (plain-text alerts from other scripts) is forwarded verbatim
with a 🔔 prefix, so nothing is ever dropped.

## Requirements

- TradingView **Essential plan or higher** (webhooks are not on the free tier)
- A free [Cloudflare](https://dash.cloudflare.com) account
- A Telegram bot (below)

## Setup

### 1. Telegram bot (~5 min)

1. Message **@BotFather** → `/newbot` → pick a name and a username ending in `bot`.
2. Copy the token it gives you (looks like `7712345678:AAHfk3x...`). Treat it like a password.
3. Open your new bot's chat and send it any message (bots can't message you first).
4. Get your chat id: open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a
   browser and find `"chat":{"id": <number>}`. If `result` is empty, message the
   bot again and refresh.

### 2. Deploy the Worker (~7 min)

1. Cloudflare dashboard → **Workers & Pages → Create → Create Worker**,
   name it `tv-telegram`, deploy the hello-world.
2. **Edit code** → replace everything with [`worker.js`](./worker.js) → **Deploy**.
3. **Settings → Variables and Secrets** → add:
   | Name | Type | Value |
   |------|------|-------|
   | `BOT_TOKEN` | Secret | your bot token |
   | `CHAT_ID` | Secret | your chat id |
   | `HOOK_SECRET` | Secret | any random string, e.g. `x7k2m9qp` (optional but recommended) |
4. Your webhook URL is:
   - with `HOOK_SECRET`: `https://tv-telegram.<yourname>.workers.dev/hook-x7k2m9qp`
   - without: `https://tv-telegram.<yourname>.workers.dev`

   With `HOOK_SECRET` set, POSTs to any other path get a 404 — so only
   TradingView (which knows the full URL) can trigger your bot.

**Test before touching TradingView:** in the Worker editor's HTTP panel, send a
POST to the webhook path with body
`CNX PRO v3 LONG | US100 | 15 | Entry 29789.85 | SL 29714.20 | TP1 29900.10 | TP2 30010.55 | Score 5/7`
— a formatted trade card should arrive in Telegram within a second.

### 3. Point TradingView at it (~3 min)

1. Open the chart with CNX PRO v3 applied → **Alt+A** to create an alert.
2. Condition: `CNX PRO v3 — SMC Toolkit` → **"Any alert() function call"**.
3. Notifications tab → tick **Webhook URL** → paste the full webhook URL
   (including the `/hook-...` path if you set `HOOK_SECRET`).
4. Optionally tick "Notify in app" as a backup, name it, **Create**.

The same worker URL serves every chart/timeframe/script — just repeat the
alert creation per chart.

> TradingView gotcha: alerts snapshot the indicator settings they were created
> with. If you change the script's inputs, delete and re-create the alert.

## Safety notes

- Never share the bot token; if it leaks, `/revoke` it in BotFather.
- Don't post the webhook URL publicly — with `HOOK_SECRET` set the URL *is*
  the credential.
