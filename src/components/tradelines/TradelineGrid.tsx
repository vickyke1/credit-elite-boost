import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Tradeline, getProductUrl } from "@/utils/tradelineData";
import { BankCardMockup } from "@/components/BankCardMockup";
import { ShoppingCart, Eye } from "lucide-react";

interface TradelineGridProps {
  tradelines: Tradeline[];
}

export const TradelineGrid = ({ tradelines }: TradelineGridProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const getStatusBadge = (status: string, availability: number) => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="success" className="gap-1.5">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-current" />
            Available ({availability})
          </Badge>
        );
      case 'limited':
        return (
          <Badge variant="warning" className="gap-1.5">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-current" />
            Limited ({availability})
          </Badge>
        );
      case 'sold-out':
        return <Badge variant="destructive">Sold Out</Badge>;
      default:
        return null;
    }
  };

  const handleAddToCart = (tradeline: Tradeline) => {
    const cartItem = {
      id: tradeline.id,
      type: 'tradeline' as const,
      name: `${tradeline.bankName} Tradeline ${tradeline.cardId}`,
      price: tradeline.price,
      bankName: tradeline.bankName,
      cardId: tradeline.cardId,
      creditLimit: tradeline.creditLimit,
      age: tradeline.age
    };

    addToCart(cartItem);
    toast({
      title: "Added to Cart!",
      description: `${tradeline.bankName} tradeline added to your cart`,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {tradelines.map((tradeline) => (
        <div
          key={tradeline.id}
          className="glass-card group flex flex-col rounded-2xl border border-border/60 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-glow-primary"
        >
          {/* Bank card mockup with the status badge overlaid on top */}
          <Link to={getProductUrl(tradeline)} className="relative mb-4 block">
            <BankCardMockup
              bankName={tradeline.bankName}
              lastFour={tradeline.cardId.slice(-4)}
            />
            <div className="absolute left-2 top-2 z-10">
              {getStatusBadge(tradeline.status, tradeline.availability)}
            </div>
          </Link>

          {/* Title + headline price share a row so the cost reads at a glance */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <Link to={getProductUrl(tradeline)} className="min-w-0">
              <h3 className="font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                ${tradeline.creditLimit.toLocaleString()} Seasoned {tradeline.bankName} Tradeline {tradeline.cardId}
              </h3>
            </Link>
            <div className="shrink-0 text-right">
              <div className="text-2xl font-bold leading-none text-foreground">${tradeline.price}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">Price</div>
            </div>
          </div>

          {/* Specs grouped in an inset panel with dividers */}
          <div className="mb-4 divide-y divide-border/50 rounded-xl border border-border/50 bg-background/30 px-4 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Credit Limit</span>
              <span className="font-semibold text-accent">${tradeline.creditLimit.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Age</span>
              <span className="font-semibold text-primary">{tradeline.age}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Purchase Deadline</span>
              <span className="font-medium text-foreground">{tradeline.purchaseDeadline}</span>
            </div>
          </div>

          {/* Actions pinned to the bottom for consistent card heights */}
          <div className="mt-auto flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link to={getProductUrl(tradeline)}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>
            <Button
              size="sm"
              disabled={tradeline.status === 'sold-out'}
              onClick={() => handleAddToCart(tradeline)}
              className={`flex-1 ${
                tradeline.status === 'sold-out'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gradient-cta text-accent-foreground hover:scale-105 transition-transform duration-300 glow-accent'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {tradeline.status === 'sold-out' ? 'Sold Out' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
