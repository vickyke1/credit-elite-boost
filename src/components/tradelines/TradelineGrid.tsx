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
      className={`grid grid-cols-[96px_1fr] items-center gap-x-4 gap-y-3 rounded-lg border bg-card px-3 py-3 transition-colors sm:grid-cols-[128px_1fr] lg:grid-cols-[128px_minmax(0,1.4fr)_repeat(3,minmax(0,1fr))_auto] ${
        isCompared ? "border-primary/60 bg-primary/5" : "border-border"
      } ${isSoldOut ? "opacity-70" : ""}`}
    >
      <div className="relative">
        <BankCardMockup bankName={tradeline.bankName} lastFour={tradeline.cardId.slice(-4)} className="!pb-1" />
        {isSoldOut && (
          <span className="absolute left-1 top-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
            Sold Out
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-semibold leading-tight">
          <Link to={getProductUrl(tradeline)} className="transition-colors hover:text-primary">
            {tradeline.bankName}
          </Link>
        </h3>
        <p className="truncate text-xs text-muted-foreground">Card {tradeline.cardId} · Buy by {tradeline.purchaseDeadline}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate">Reports {tradeline.firstReportingPeriod}</span>
        </p>
      </div>

      <dl className="col-span-2 grid grid-cols-3 gap-2 lg:col-span-3">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Limit</dt>
          <dd className="font-bold tabular-nums text-primary">${tradeline.creditLimit.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Age</dt>
          <dd className="font-semibold tabular-nums">{tradeline.age}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Price</dt>
          <dd className="text-lg font-bold tabular-nums">${tradeline.price.toLocaleString()}</dd>
        </div>
      </dl>

      <div className="col-span-2 flex items-center gap-2 lg:col-span-1">
        <Button
          className="min-h-11 flex-1 rounded-md bg-warning text-primary-foreground hover:bg-warning/90 lg:flex-none"
          disabled={isSoldOut}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {isSoldOut ? "Sold Out" : "Add"}
        </Button>
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
        <Button asChild variant="outline" className="min-h-11">
          <Link to={getProductUrl(tradeline)}>Details</Link>
        </Button>
      </div>
    </article>
  );
};

export const TradelineGrid = ({ tradelines, compareIds = [], onToggleCompare }: TradelineGridProps) => {
  return (
    <div className="flex flex-col gap-2">
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
