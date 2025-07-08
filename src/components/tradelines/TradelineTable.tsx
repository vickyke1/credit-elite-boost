import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Tradeline } from "@/utils/tradelineData";

interface TradelineTableProps {
  tradelines: Tradeline[];
}

export const TradelineTable = ({ tradelines }: TradelineTableProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const getStatusBadge = (status: string, availability: number) => {
    switch (status) {
      case 'available':
        return <Badge variant="secondary" className="bg-accent/20 text-accent">Available ({availability})</Badge>;
      case 'limited':
        return <Badge variant="outline" className="border-orange-500 text-orange-400">Limited ({availability})</Badge>;
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
    <div className="surface-elevated rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Bank Name</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Card ID</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Credit Limit</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Date Opened</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Purchase Deadline</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Reporting Period</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Availability</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Price</th>
              <th className="text-left p-4 font-semibold text-foreground border-b border-border">Action</th>
            </tr>
          </thead>
          <tbody>
            {tradelines.map((tradeline) => (
              <tr key={tradeline.id} className="hover:bg-surface-hover transition-colors border-b border-border/50">
                <td className="p-4">
                  <div className="font-medium text-foreground">{tradeline.bankName}</div>
                  <div className="text-sm text-muted-foreground">{tradeline.age} old</div>
                </td>
                <td className="p-4">
                  <code className="text-sm bg-muted px-2 py-1 rounded text-primary">{tradeline.cardId}</code>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-accent">${tradeline.creditLimit.toLocaleString()}</div>
                </td>
                <td className="p-4 text-muted-foreground">{tradeline.dateOpened}</td>
                <td className="p-4 text-muted-foreground">{tradeline.purchaseDeadline}</td>
                <td className="p-4 text-muted-foreground">{tradeline.reportingPeriod}</td>
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
                        : 'bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent'
                    }`}
                  >
                    {tradeline.status === 'sold-out' ? 'Sold Out' : 'Add Individual to Cart'}
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