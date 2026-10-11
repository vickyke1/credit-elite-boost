import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tradeline } from "@/utils/tradelineData";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  tradelines: Tradeline[];
  onCompare: (ids: string[]) => void;
}

interface Result { summary: string; picks: { id: string; reason: string }[] }

export const TradelineAdvisor = ({ tradelines, onCompare }: Props) => {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    const candidates = tradelines
      .filter((t) => t.status !== "sold-out")
      .sort((a, b) => b.creditLimit / b.price - a.creditLimit / a.price)
      .slice(0, 80)
      .map((t) => ({ id: t.id, bank: t.bankName, limit: t.creditLimit, ageYears: Math.round(t.ageInYears * 10) / 10, price: t.price, firstReporting: t.firstReportingPeriod, status: t.status }));
    const { data, error: fnError } = await supabase.functions.invoke("recommend-tradelines", { body: { goal, candidates } });
    setLoading(false);
    if (fnError || data?.error) {
      let msg = data?.error;
      try { msg ??= (await (fnError as { context?: Response }).context?.json())?.error; } catch { /* ignore */ }
      setError(msg ?? "Something went wrong. Please try again.");
      return;
    }
    setResult(data as Result);
  };

  const byId = new Map(tradelines.map((t) => [t.id, t]));
  const picks = result?.picks.filter((p) => byId.has(p.id)) ?? [];

  return (
    <section aria-labelledby="advisor-title" className="mb-8 rounded-lg border border-primary/30 bg-card p-5 shadow-elevated">
      <h2 id="advisor-title" className="mb-1 flex items-center gap-2 text-lg font-bold">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" /> AI Tradeline Advisor
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">Describe your credit-building goal and budget, and get matching tradelines from today's inventory.</p>
      <form onSubmit={submit} className="flex flex-col gap-3 md:flex-row">
        <label htmlFor="advisor-goal" className="sr-only">Your credit-building goal</label>
        <Textarea id="advisor-goal" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={800} rows={2}
          placeholder="e.g. Applying for an apartment in 2 months, budget around $600, want high limits that report soon" className="flex-1" />
        <Button type="submit" disabled={loading || goal.trim().length < 10} className="min-h-11 md:self-end">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Finding matches..." : "Get Recommendations"}
        </Button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      {result && (
        <div className="mt-5" aria-live="polite">
          <p className="mb-3 text-sm text-foreground">{result.summary}</p>
          {picks.length > 0 ? (
            <>
              <ul className="grid gap-2 md:grid-cols-2">
                {picks.map((p) => {
                  const t = byId.get(p.id)!;
                  return (
                    <li key={p.id} className="rounded-md border border-border bg-secondary/30 p-3 text-sm">
                      <div className="font-semibold">{t.bankName} · {t.cardId}</div>
                      <div className="text-muted-foreground">${t.creditLimit.toLocaleString()} limit · {t.age} · <span className="font-semibold text-primary">${t.price.toLocaleString()}</span></div>
                      <div className="mt-1">{p.reason}</div>
                    </li>
                  );
                })}
              </ul>
              <Button variant="outline" className="mt-3 min-h-11" onClick={() => onCompare(picks.slice(0, 4).map((p) => p.id))}>
                Compare these side by side
              </Button>
            </>
          ) : <p className="text-sm text-muted-foreground">No matching tradelines found — try adjusting your budget or goal.</p>}
          <p className="mt-3 text-xs text-muted-foreground">Educational suggestions only; results and approvals are not guaranteed.</p>
        </div>
      )}
    </section>
  );
};
