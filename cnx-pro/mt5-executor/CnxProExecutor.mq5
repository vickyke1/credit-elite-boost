//+------------------------------------------------------------------+
//| CnxProExecutor.mq5                                               |
//| Executes CNX PRO v3 TradingView signals relayed by the           |
//| tv-telegram Cloudflare Worker (GET /signal-<HOOK_SECRET>).       |
//|                                                                  |
//| Setup:                                                           |
//|  1. MT5 → Tools → Options → Expert Advisors →                    |
//|     tick "Allow WebRequest for listed URL" and add your worker   |
//|     base URL, e.g. https://tv-telegram.yourname.workers.dev      |
//|  2. Attach this EA to any chart (one chart only). It trades      |
//|     whatever symbol each signal maps to, not the chart symbol.   |
//|  3. TEST ON A DEMO ACCOUNT FIRST.                                |
//+------------------------------------------------------------------+
#property copyright "CNX PRO v3"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>

//--- connection
input string InpWorkerBaseUrl   = "https://tv-telegram.yourname.workers.dev"; // Worker base URL (no trailing slash)
input string InpHookSecret      = "";      // HOOK_SECRET set in the worker
input int    InpPollSeconds     = 5;       // Poll interval (seconds)
input int    InpMaxSignalAgeSec = 180;     // Ignore signals older than this

//--- risk
input double InpRiskPercent     = 1.0;     // Risk per trade, % of equity (SL-based sizing)
input double InpFixedLots       = 0.0;     // Fixed lot size (>0 overrides risk %)
input bool   InpSplitTP         = true;    // Split position: half to TP1, half to TP2
input double InpMaxDailyLossPct = 3.0;     // Stop opening trades after this daily equity loss %
input int    InpMaxSpreadPoints = 60;      // Skip trade if spread exceeds this (points)
input int    InpMaxEntryDriftPts= 150;     // Skip if price drifted further than this from signal entry
input int    InpMinScore        = 0;       // Minimum confluence score (0 = accept all)

//--- mapping / housekeeping
input string InpSymbolMap       = "US100=US100;XAUUSD=XAUUSD"; // TVsymbol=BrokerSymbol;...
input long   InpMagicNumber     = 20260702;
input int    InpSlippagePoints  = 30;

CTrade g_trade;
double g_lastSignalId = 0;   // Date.now() ms epoch of last processed signal
string GV_LAST_ID;           // global-variable name persisting last id

//+------------------------------------------------------------------+
int OnInit()
{
   if(StringLen(InpHookSecret) == 0)
   {
      Print("CnxProExecutor: InpHookSecret is empty - set it to your worker HOOK_SECRET.");
      return(INIT_PARAMETERS_INCORRECT);
   }

   g_trade.SetExpertMagicNumber(InpMagicNumber);
   g_trade.SetDeviationInPoints(InpSlippagePoints);

   GV_LAST_ID = "CNXEA_lastid_" + (string)InpMagicNumber;
   if(GlobalVariableCheck(GV_LAST_ID))
      g_lastSignalId = GlobalVariableGet(GV_LAST_ID);

   // Skip whatever signal is already stored at attach time: only trade
   // signals that arrive after the EA starts.
   string json = FetchLatestSignal();
   if(json != "")
   {
      double id = JsonNumber(json, "id");
      if(id > g_lastSignalId) SetLastId(id);
   }

   EventSetTimer(MathMax(1, InpPollSeconds));
   Print("CnxProExecutor started. Polling ", SignalUrl());
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) { EventKillTimer(); }

//+------------------------------------------------------------------+
void OnTimer()
{
   string json = FetchLatestSignal();
   if(json == "") return;

   double id = JsonNumber(json, "id");
   if(id <= g_lastSignalId) return;           // nothing new

   // Mark as seen immediately so a failed order is never retried blindly
   // on every poll (avoids accidental order spam on transient errors).
   SetLastId(id);

   // freshness: id is a ms epoch set by the worker
   double ageSec = ((double)TimeGMT() * 1000.0 - id) / 1000.0;
   if(ageSec > InpMaxSignalAgeSec)
   {
      Print("Signal skipped: too old (", DoubleToString(ageSec, 0), "s).");
      return;
   }

   ProcessSignal(json);
}

//+------------------------------------------------------------------+
void ProcessSignal(const string json)
{
   string dir      = JsonString(json, "direction");
   string tvSymbol = JsonString(json, "symbol");
   double entry    = StringToDouble(JsonString(json, "entry"));
   double sl       = StringToDouble(JsonString(json, "sl"));
   double tp1      = StringToDouble(JsonString(json, "tp1"));
   double tp2      = StringToDouble(JsonString(json, "tp2"));
   int    score    = ScoreValue(JsonString(json, "score"));

   if(dir != "LONG" && dir != "SHORT") { Print("Skip: bad direction '", dir, "'"); return; }
   if(entry <= 0 || sl <= 0)           { Print("Skip: missing entry/SL");          return; }
   if(score < InpMinScore)             { Print("Skip: score ", score, " < min ", InpMinScore); return; }

   if(DailyLossLimitHit())
   {
      Print("Skip: daily loss limit reached - no new trades today.");
      return;
   }

   string symbol = MapSymbol(tvSymbol);
   if(symbol == "" || !SymbolSelect(symbol, true))
   {
      Print("Skip: no broker symbol for TradingView symbol '", tvSymbol, "'. Fix InpSymbolMap.");
      return;
   }

   long spread = SymbolInfoInteger(symbol, SYMBOL_SPREAD);
   if(spread > InpMaxSpreadPoints)
   {
      Print("Skip: spread ", spread, " > max ", InpMaxSpreadPoints);
      return;
   }

   bool  isLong = (dir == "LONG");
   double point = SymbolInfoDouble(symbol, SYMBOL_POINT);
   double price = isLong ? SymbolInfoDouble(symbol, SYMBOL_ASK)
                         : SymbolInfoDouble(symbol, SYMBOL_BID);

   if(MathAbs(price - entry) / point > InpMaxEntryDriftPts)
   {
      Print("Skip: price ", price, " drifted too far from signal entry ", entry);
      return;
   }

   double lots = CalcLots(symbol, price, sl);
   if(lots <= 0) { Print("Skip: lot calculation failed."); return; }

   double minLot  = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MIN);
   double lotStep = SymbolInfoDouble(symbol, SYMBOL_VOLUME_STEP);
   string comment = "CNXPROv3 " + dir;

   bool split = InpSplitTP && tp1 > 0 && tp2 > 0 &&
                NormalizeLots(symbol, lots / 2.0) >= minLot;

   if(split)
   {
      double half = NormalizeLots(symbol, lots / 2.0);
      OpenOrder(symbol, isLong, half, sl, tp1, comment + " TP1");
      OpenOrder(symbol, isLong, half, sl, tp2, comment + " TP2");
   }
   else
   {
      double tp = (tp1 > 0 ? tp1 : tp2);   // bank the nearer target when not splitting
      OpenOrder(symbol, isLong, NormalizeLots(symbol, lots), sl, tp, comment);
   }
}

//+------------------------------------------------------------------+
void OpenOrder(const string symbol, const bool isLong, const double lots,
               const double sl, const double tp, const string comment)
{
   int digits = (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS);
   double nsl = NormalizeDouble(sl, digits);
   double ntp = (tp > 0) ? NormalizeDouble(tp, digits) : 0.0;

   bool ok = isLong ? g_trade.Buy(lots, symbol, 0.0, nsl, ntp, comment)
                    : g_trade.Sell(lots, symbol, 0.0, nsl, ntp, comment);

   if(ok) Print("Opened ", (isLong ? "BUY " : "SELL "), DoubleToString(lots, 2),
                " ", symbol, " SL=", nsl, " TP=", ntp);
   else   Print("Order FAILED ", symbol, ": ", g_trade.ResultRetcode(), " ",
                g_trade.ResultRetcodeDescription());
}

//+------------------------------------------------------------------+
double CalcLots(const string symbol, const double price, const double sl)
{
   if(InpFixedLots > 0) return(InpFixedLots);

   double slDist = MathAbs(price - sl);
   if(slDist <= 0) return(0);

   double tickSize  = SymbolInfoDouble(symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(symbol, SYMBOL_TRADE_TICK_VALUE);
   if(tickSize <= 0 || tickValue <= 0) return(0);

   double lossPerLot = slDist / tickSize * tickValue;
   if(lossPerLot <= 0) return(0);

   double riskMoney = AccountInfoDouble(ACCOUNT_EQUITY) * InpRiskPercent / 100.0;
   return(riskMoney / lossPerLot);
}

double NormalizeLots(const string symbol, double lots)
{
   double minLot  = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MIN);
   double maxLot  = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(symbol, SYMBOL_VOLUME_STEP);
   if(lotStep > 0) lots = MathFloor(lots / lotStep) * lotStep;
   return(MathMin(MathMax(lots, minLot), maxLot));
}

//+------------------------------------------------------------------+
bool DailyLossLimitHit()
{
   if(InpMaxDailyLossPct <= 0) return(false);

   MqlDateTime t; TimeToStruct(TimeCurrent(), t);
   string gv = StringFormat("CNXEA_daystart_%04d%02d%02d_%I64d",
                            t.year, t.mon, t.day, InpMagicNumber);

   if(!GlobalVariableCheck(gv))
      GlobalVariableSet(gv, AccountInfoDouble(ACCOUNT_EQUITY));

   double dayStart = GlobalVariableGet(gv);
   double equity   = AccountInfoDouble(ACCOUNT_EQUITY);
   return(equity <= dayStart * (1.0 - InpMaxDailyLossPct / 100.0));
}

//+------------------------------------------------------------------+
string SignalUrl() { return(InpWorkerBaseUrl + "/signal-" + InpHookSecret); }

string FetchLatestSignal()
{
   char   data[], result[];
   string headers;
   ResetLastError();
   int status = WebRequest("GET", SignalUrl(), "", 5000, data, result, headers);

   if(status == -1)
   {
      static datetime lastWarn = 0;
      if(TimeCurrent() - lastWarn > 300)
      {
         lastWarn = TimeCurrent();
         Print("WebRequest failed (err ", GetLastError(),
               "). Add '", InpWorkerBaseUrl,
               "' to Tools > Options > Expert Advisors > Allow WebRequest.");
      }
      return("");
   }
   if(status != 200 || ArraySize(result) == 0) return("");   // 204 = no signal yet
   return(CharArrayToString(result, 0, WHOLE_ARRAY, CP_UTF8));
}

void SetLastId(const double id)
{
   g_lastSignalId = id;
   GlobalVariableSet(GV_LAST_ID, id);
}

//+------------------------------------------------------------------+
//| Minimal JSON field extraction for the worker's flat payload      |
//+------------------------------------------------------------------+
string JsonString(const string json, const string key)
{
   string needle = "\"" + key + "\":\"";
   int start = StringFind(json, needle);
   if(start < 0) return("");
   start += StringLen(needle);
   int end = StringFind(json, "\"", start);
   if(end < 0) return("");
   return(StringSubstr(json, start, end - start));
}

double JsonNumber(const string json, const string key)
{
   string needle = "\"" + key + "\":";
   int start = StringFind(json, needle);
   if(start < 0) return(0);
   start += StringLen(needle);
   int end = start;
   while(end < StringLen(json))
   {
      ushort c = StringGetCharacter(json, end);
      if((c < '0' || c > '9') && c != '.' && c != '-') break;
      end++;
   }
   return(StringToDouble(StringSubstr(json, start, end - start)));
}

int ScoreValue(const string score)   // "5/7" -> 5
{
   if(score == "") return(0);
   int slash = StringFind(score, "/");
   return((int)StringToInteger(slash > 0 ? StringSubstr(score, 0, slash) : score));
}

string MapSymbol(const string tvSymbol)
{
   string pairs[];
   int n = StringSplit(InpSymbolMap, ';', pairs);
   for(int i = 0; i < n; i++)
   {
      string kv[];
      if(StringSplit(pairs[i], '=', kv) == 2)
      {
         StringTrimLeft(kv[0]); StringTrimRight(kv[0]);
         StringTrimLeft(kv[1]); StringTrimRight(kv[1]);
         if(kv[0] == tvSymbol) return(kv[1]);
      }
   }
   // no mapping entry: try the TradingView name directly
   return(tvSymbol);
}
//+------------------------------------------------------------------+
