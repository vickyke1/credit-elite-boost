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
          {/* Bank card mockup */}
          <Link to={getProductUrl(tradeline)} className="mb-4 block">
            <BankCardMockup
              bankName={tradeline.bankName}
              lastFour={tradeline.cardId.slice(-4)}
            />
          </Link>

          {/* Status */}
          <div className="mb-2">
            {getStatusBadge(tradeline.status, tradeline.availability)}
          </div>

          {/* Title */}
          <Link to={getProductUrl(tradeline)}>
            <h3 className="mb-3 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              ${tradeline.creditLimit.toLocaleString()} Seasoned {tradeline.bankName} Tradeline {tradeline.cardId}
            </h3>
          </Link>

          {/* Specs */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credit Limit:</span>
              <span className="font-semibold text-accent">${tradeline.creditLimit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-semibold text-primary">{tradeline.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purchase Deadline:</span>
              <span className="font-medium text-foreground">{tradeline.purchaseDeadline}</span>
            </div>
          </div>

          {/* Price + actions pinned to the bottom for consistent card heights */}
          <div className="mt-auto">
            <div className="mb-4 text-2xl font-bold text-foreground">${tradeline.price}</div>
            <div className="flex items-center gap-2">
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
        </div>
      ))}
    </div>
  );
};
