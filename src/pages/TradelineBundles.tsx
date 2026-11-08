import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart, MessageCircle, Layers3 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BankCardMockup } from "@/components/BankCardMockup";
import { Button } from "@/components/ui/button";
import { useTradelineInventory } from "@/hooks/useTradelineInventory";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { buildTradelineBundles } from "@/lib/tradelineBundles";
import { getProductUrl } from "@/utils/tradelineData";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function TradelineBundles() {
  const { inventory, isPending, error } = useTradelineInventory();
  const bundles = useMemo(() => buildTradelineBundles(inventory), [inventory]);
  const { items: cartItems, addToCart } = useCart();

  const addBundle = (bundle: typeof bundles[number]) => {
    if (!bundle.complete || isPending || error) return;
    for (const item of bundle.items) {
      addToCart({ id: item.id, type: "tradeline", name: `${item.bankName} Tradeline ${item.cardId}`, price: item.price, bankName: item.bankName, cardId: item.cardId, creditLimit: item.creditLimit, age: item.age });
    }
    toast({ title: "Bundle added to cart", description: `${bundle.name} selected. Existing cart items are kept; duplicate listings are not added.` });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Authorized-User Tradeline Bundles | CpnCreditBoost" description="Explore ready-made authorized-user tradeline bundles with individual listing details, credit limits, account ages and transparent USD totals." canonicalUrl="https://cpncreditboost.com/tradeline-bundles" />
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pb-16 pt-24 md:px-6">
        <Button asChild variant="ghost" className="mb-6 min-h-11"><Link to="/tradelines"><ArrowLeft className="h-4 w-4" /> All tradelines</Link></Button>
        <header className="mb-8 border-b border-border pb-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><Layers3 className="h-4 w-4" /> CpnCreditBoost</p>
          <h1 className="text-3xl font-bold md:text-4xl">Authorized-user tradeline bundles</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">Ready-made selections from the existing inventory. Compare each account before choosing a bundle. Listed totals are the sum of individual prices, with no added bundle fee.</p>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">These bundles contain authorized-user tradeline listings only—not CPN numbers or identity documents. Availability, reporting and suitability require review; credit-score changes and lending approval are not guaranteed.</p>
        </header>
        {isPending ? <p role="status" className="py-12 text-muted-foreground">Loading current inventory…</p> : error ? <div role="alert" className="py-12"><p className="text-destructive">Current purchase deadlines could not be loaded.</p><Button className="mt-4 min-h-11" onClick={() => window.location.reload()}>Try again</Button></div> : <>
          <section aria-label="Ready-made bundles" className="grid items-stretch gap-6 lg:grid-cols-3">
            {bundles.map(bundle => {
              const selected = bundle.complete && bundle.items.every(item => cartItems.some(cartItem => cartItem.id === item.id));
              return <article key={bundle.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-primary">{bundle.count} tradelines</span><span className="text-xs text-muted-foreground">One-time USD total</span></div>
                <h2 className="text-2xl font-bold">{bundle.name}</h2>
                <p className="mt-2 min-h-12 text-sm text-muted-foreground">{bundle.description}</p>
                <p className="mt-5 text-3xl font-bold text-primary">{bundle.complete ? money(bundle.totalPrice) : "Unavailable"}</p>
                <p className="mt-2 text-sm text-muted-foreground">{money(bundle.totalLimit)} combined listed credit limits</p>
                <ul className="my-6 flex-1 divide-y divide-border border-y border-border">
                  {bundle.items.map(item => <li key={item.id} className="py-4">
                    <div className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3">
                      <BankCardMockup bankName={item.bankName} lastFour={item.cardId.slice(-4)} className="!pb-1" />
                      <div className="min-w-0"><Link to={getProductUrl(item)} className="inline-flex min-h-11 items-center break-words text-sm font-semibold hover:text-primary">{item.bankName}<ArrowRight className="ml-1 h-3 w-3 shrink-0" /></Link><p className="text-xs text-muted-foreground">Card {item.cardId} · {item.age}</p><p className="mt-1 text-sm">{money(item.creditLimit)} limit · {money(item.price)}</p></div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Buy by {item.purchaseDeadline} · Reports {item.firstReportingPeriod} · {item.reportingPeriod}</p>
                  </li>)}
                  {!bundle.complete && <li className="py-4 text-sm text-muted-foreground">Not enough eligible listings for this selection. Ask us about alternatives.</li>}
                </ul>
                <Button className="min-h-11 w-full" disabled={!bundle.complete || selected} onClick={() => addBundle(bundle)}><ShoppingCart className="h-4 w-4" />{selected ? "Already in cart" : "Add bundle to cart"}</Button>
                <Button asChild variant="outline" className="mt-3 min-h-11 w-full"><a href={`https://t.me/Cpn_creditboost?text=${encodeURIComponent(`I'd like to discuss the ${bundle.name} authorized-user tradeline bundle. Listings: ${bundle.items.map(item => item.id).join(", ")}. Listed total: ${money(bundle.totalPrice)}.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Ask about this bundle</a></Button>
              </article>;
            })}
          </section>
          <p className="mt-6 text-sm text-muted-foreground">Adding a bundle does not reserve stock or approve a product for sale. Online payment is available only for approved, in-stock products after checkout validation; other selections require Telegram review.</p>
          <section aria-labelledby="comparison-heading" className="mt-12 border-t border-border pt-8">
            <h2 id="comparison-heading" className="mb-5 text-2xl font-bold">Compare bundles</h2>
            <div className="max-h-96 overflow-auto rounded-lg border border-border" tabIndex={0} aria-label="Bundle comparison">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-card"><tr><th scope="col" className="p-4">Selection</th>{bundles.map(bundle => <th key={bundle.id} scope="col" className="p-4">{bundle.name}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">{[
                  ["Tradelines", ...bundles.map(bundle => bundle.count)],
                  ["Minimum listed account age", ...bundles.map(bundle => `${bundle.minimumAge} years`)],
                  ["Minimum limit per account", ...bundles.map(bundle => money(bundle.minimumLimit))],
                  ["Combined listed limits", ...bundles.map(bundle => money(bundle.totalLimit))],
                  ["Listed total", ...bundles.map(bundle => bundle.complete ? money(bundle.totalPrice) : "Unavailable")],
                ].map(([label, ...values]) => <tr key={label} className="even:bg-muted/30"><th scope="row" className="p-4 font-medium">{label}</th>{values.map((value, index) => <td key={index} className="p-4">{value}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </section>
        </>}
      </main>
      <Footer />
    </div>
  );
}