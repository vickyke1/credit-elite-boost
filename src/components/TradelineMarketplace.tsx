import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BankCardMockup } from "@/components/BankCardMockup";
import { generateTradelines, getProductUrl } from "@/utils/tradelineData";
import { ArrowRight } from "lucide-react";

const TradelineMarketplace = () => {
  const tradelines = useMemo(() => generateTradelines().filter(t => t.status !== "sold-out").sort((a, b) => a.price - b.price).slice(0, 3), []);
  return <section id="tradelines" className="bg-surface-elevated py-10 md:py-16">
    <div className="container px-4 sm:px-6">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-semibold text-primary">THE INVENTORY</p><h2 className="text-2xl font-bold sm:text-3xl">Explore aged tradelines</h2><p className="mt-3 text-sm text-muted-foreground">USD prices per tradeline · One-time purchase, not a monthly rate</p></div><Button asChild variant="ghost" className="min-h-11"><Link to="/tradelines">View all <ArrowRight className="h-4 w-4" /></Link></Button></div>
      <div className="grid gap-4 md:grid-cols-3">
        {tradelines.map(t => <article key={t.id} className="rounded-lg border border-border bg-card p-5">
          <div className="hidden sm:block"><BankCardMockup bankName={t.bankName} className="mb-5" /></div>
          <h3 className="text-lg font-semibold">{t.bankName}</h3><p className="mt-1 text-xs text-muted-foreground">Card {t.cardId}</p>
          <dl className="my-5 grid grid-cols-2 gap-4"><div><dt className="text-xs text-muted-foreground">Credit limit</dt><dd className="mt-1 text-xl font-bold text-primary">${t.creditLimit.toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Account age</dt><dd className="mt-1 text-lg font-semibold">{t.age}</dd></div></dl>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4"><p className="text-2xl font-bold tabular-nums">${t.price.toLocaleString()}<span className="ml-1 text-xs font-normal text-muted-foreground">USD</span></p><Button asChild variant="outline" className="min-h-11"><Link to={getProductUrl(t)}>View details</Link></Button></div>
        </article>)}
      </div>
    </div>
  </section>;
};
export default TradelineMarketplace;
