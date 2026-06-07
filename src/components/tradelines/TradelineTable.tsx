import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Tradeline } from "@/utils/tradelineData";
import { ShoppingCart, Building2 } from "lucide-react";

interface TradelineTableProps {
  tradelines: Tradeline[];
}

export const TradelineTable = ({ tradelines }: TradelineTableProps) => {
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
      name: tradeline.bankName,
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
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-hover/60">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Bank Name</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Card ID</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Credit Limit</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Date Opened</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Purchase Deadline</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Reporting Period</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Availability</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Price</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">Action</th>
            </tr>
          </thead>
          <tbody>
            {tradelines.map((tradeline) => (
              <tr key={tradeline.id} className="group hover:bg-surface-hover/50 transition-colors border-b border-border/40 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{tradeline.bankName}</div>
                      <div className="text-sm text-muted-foreground">{tradeline.age} old</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <code className="text-xs bg-muted/60 px-2 py-1 rounded-md text-primary border border-primary/10">{tradeline.cardId}</code>
                </td>
                <td className="p-4">
                  <div className="font-bold text-accent">${tradeline.creditLimit.toLocaleString()}</div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{tradeline.dateOpened}</td>
                <td className="p-4 text-sm text-muted-foreground">{tradeline.purchaseDeadline}</td>
                <td className="p-4 text-sm text-muted-foreground">{tradeline.reportingPeriod}</td>
                <td className="p-4">
                  {getStatusBadge(tradeline.status, tradeline.availability)}
                </td>
                <td className="p-4">
                  <div className="text-xl font-bold text-foreground">${tradeline.price}</div>
                </td>
                <td className="p-4">
                  <Button
                    size="sm"
                    disabled={tradeline.status === 'sold-out'}
                    onClick={() => handleAddToCart(tradeline)}
                    className={`${
                      tradeline.status === 'sold-out'
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-gradient-cta text-accent-foreground hover:scale-105 transition-transform duration-300 glow-accent'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {tradeline.status === 'sold-out' ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
