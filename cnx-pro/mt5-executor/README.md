# CNX PRO v3 — MT5 Signal Executor EA

An MetaTrader 5 Expert Advisor that automatically executes CNX PRO v3 signals.
TradingView stays the "brain": the Pine Script fires the alert, the Cloudflare
Worker stores it, and this EA polls the worker every few seconds and places the
trade — direction, SL, and split TP1/TP2 — with risk-based position sizing.

```
TradingView alert ──▶ Cloudflare Worker ──▶ Telegram (you)
                            │
                            └──▶ GET /signal-<secret> ◀── this EA (MT5)
```

> ⚠️ **Run this on a DEMO account first.** It places real orders. No signal
> logic is perfect and broker conditions (spread, slippage, symbol specs)
> change results. Only go live once you've watched it behave for a while.

## 1. Upgrade the worker (one-time)

The worker needs somewhere to store the latest signal:

1. Cloudflare dashboard → **Storage & Databases → KV** → **Create namespace**
   → name it `cnx-signals`.
2. Your worker → **Settings → Bindings → Add → KV Namespace**:
   - Variable name: `SIGNALS` (exact, all caps)
   - Namespace: `cnx-signals`
3. Make sure the worker code is the latest version from
   [`../telegram-worker/worker.js`](../telegram-worker/worker.js) (it serves
   `GET /signal-<HOOK_SECRET>`), then Deploy.

Test in a browser: `https://<worker-url>/signal-<HOOK_SECRET>` should return
JSON after you POST a test alert (or nothing/204 before any alert has fired).

## 2. Install the EA

1. MT5 → **File → Open Data Folder** → `MQL5/Experts/` → copy
   `CnxProExecutor.mq5` there.
2. In MetaEditor (F4), open the file and **Compile** (F7) — expect 0 errors.
3. MT5 → **Tools → Options → Expert Advisors**:
   - tick **Allow WebRequest for listed URL**
   - add your worker base URL, e.g. `https://tv-telegram.yourname.workers.dev`
4. Enable **Algo Trading** (toolbar button).
5. Drag the EA onto **one chart** (any symbol — it trades what the signal says,
   not the chart symbol).

## 3. Inputs that matter

| Input | Meaning |
|-------|---------|
| `InpWorkerBaseUrl` | your worker URL, no trailing slash |
| `InpHookSecret` | the `HOOK_SECRET` you set in the worker |
| `InpRiskPercent` | % of equity risked per trade, sized off the signal's SL distance |
| `InpFixedLots` | set > 0 to use a fixed lot size instead |
| `InpSplitTP` | half position closes at TP1, half at TP2 |
| `InpMinScore` | ignore signals below this confluence score (e.g. 5) |
| `InpMaxDailyLossPct` | stops opening new trades after this % equity drawdown in a day |
| `InpMaxEntryDriftPts` | skips a signal if price already ran away from the alert's entry |
| `InpSymbolMap` | maps TradingView names to your broker's, e.g. `US100=US100.cash;XAUUSD=GOLD` |

Broker symbol names vary (`US100` might be `US100.cash`, `NAS100`, `USTEC`;
`XAUUSD` might be `GOLD`). Check your broker's Market Watch and set
`InpSymbolMap` accordingly.

## Safety behavior built in

- Signals already stored when the EA starts are **not** traded — only new ones.
- Each signal is traded **once** (persisted across restarts), never retried blindly.
- Stale signals (older than `InpMaxSignalAgeSec`) are skipped.
- Spread, entry-drift, daily-loss, and min-score guards all veto entries.
- All orders carry a magic number so the EA never touches your manual trades.
