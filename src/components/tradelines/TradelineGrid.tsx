import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Tradeline, getProductUrl } from "@/utils/tradelineData";
import { BankCardMockup } from "@/components/BankCardMockup";
import { Columns3, ShoppingCart, ShieldCheck } from "lucide-react";

interface TradelineGridProps {
  tradelines: Tradeline[];
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
}

export const useAddTradelineToCart = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  return (tradeline: Tradeline) => {
    addToCart({ id: tradeline.id, type: 'tradeline' as const, name: `${tradeline.bankName} Tradeline ${tradeline.cardId}`, price: tradeline.price, bankName: tradeline.bankName, cardId: tradeline.cardId, creditLimit: tradeline.creditLimit, age: tradeline.age });
    toast({ title: "Added to Cart!", description: `${tradeline.bankName} tradeline added to your cart` });
  };
};

const TradelineCard = ({
  tradeline,
  isCompared,
  compareFull,
  onToggleCompare,
}: {
  tradeline: Tradeline;
  isCompared: boolean;
  compareFull: boolean;
  onToggleCompare?: (id: string) => void;
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isSoldOut = tradeline.status === "sold-out";

  const handleAddToCart = () => {
    addToCart({
      id: tradeline.id,
      type: 'tradeline' as const,
      name: `${tradeline.bankName} Tradeline ${tradeline.cardId}`,
      price: tradeline.price,
      bankName: tradeline.bankName,
      cardId: tradeline.cardId,
      creditLimit: tradeline.creditLimit,
      age: tradeline.age,
    });
    toast({
      title: "Added to Cart!",
      description: `${tradeline.bankName} tradeline added to your cart`,
    });
  };

  const handleCompare = () => onToggleCompare?.(tradeline.id);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border bg-card shadow-elevated transition-colors ${
        isCompared ? "border-primary/60" : "border-border"
      }`}
    >
      {/* Replica bank card visual */}
      <div className={`relative bg-secondary/60 px-5 pb-1 pt-5 ${isSoldOut ? "opacity-60" : ""}`}>
        <BankCardMockup bankName={tradeline.bankName} lastFour={tradeline.cardId.slice(-4)} />
        {isSoldOut && (
          <span className="absolute right-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
            Sold Out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Bank identity */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold leading-tight">
              <Link to={getProductUrl(tradeline)} className="transition-colors hover:text-primary">
                {tradeline.bankName}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{tradeline.cardName} · Card {tradeline.cardId}</p>
          </div>
          <button
            type="button"
            onClick={handleCompare}
            disabled={!isCompared && compareFull}
            aria-pressed={isCompared}
            aria-label={`Compare ${tradeline.bankName} ${tradeline.cardId}`}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors ${
              isCompared
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <Columns3 className="h-4 w-4" />
          </button>
        </div>

        {/* Key numbers */}
        <dl className="my-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <dt className="text-xs text-muted-foreground">Credit limit</dt>
            <dd className="mt-0.5 text-lg font-bold text-primary tabular-nums">${tradeline.creditLimit.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Account age</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">{tradeline.age}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">1st reporting period</dt>
            <dd className="mt-0.5 text-sm font-medium">{tradeline.firstReportingPeriod}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Price</dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums">
              ${tradeline.price.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-muted-foreground">USD</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Purchase by</dt>
            <dd className="mt-0.5 text-sm font-medium text-muted-foreground">{tradeline.purchaseDeadline}</dd>
          </div>
        </dl>

        <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          {tradeline.reportingPeriod} · No late payments · ≤15% utilization
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
          <Button
            className="min-h-11 flex-1 rounded-md bg-warning text-primary-foreground hover:bg-warning/90"
            disabled={isSoldOut}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {isSoldOut ? "Sold Out" : "Add to Cart"}
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link to={getProductUrl(tradeline)}>Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

export const TradelineGrid = ({ tradelines, compareIds = [], onToggleCompare }: TradelineGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tradelines.map((tradeline) => (
        <TradelineCard
          key={tradeline.id}
          tradeline={tradeline}
          isCompared={compareIds.includes(tradeline.id)}
          compareFull={!compareIds.includes(tradeline.id) && compareIds.length >= 4}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
};
