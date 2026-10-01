import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Tradeline, getProductUrl } from "@/utils/tradelineData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";

interface TradelineGridProps {
  tradelines: Tradeline[];
}

export const TradelineGrid = ({ tradelines }: TradelineGridProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

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
    <div className="animate-fade-in overflow-hidden rounded-lg border border-border bg-card shadow-elevated">
      <Table className="min-w-[1120px]">
        <TableHeader className="sticky top-0 z-20 bg-secondary">
          <TableRow className="hover:bg-secondary">
            <TableHead className="h-14 min-w-[180px] font-semibold text-foreground">Bank</TableHead>
            <TableHead className="min-w-[100px] font-semibold text-foreground">Card ID</TableHead>
            <TableHead className="min-w-[130px] font-semibold text-foreground">Credit Limit</TableHead>
            <TableHead className="min-w-[110px] font-semibold text-foreground">Age</TableHead>
            <TableHead className="min-w-[145px] font-semibold text-foreground">Purchase Deadline</TableHead>
            <TableHead className="min-w-[190px] font-semibold text-foreground">1st Reporting Period</TableHead>
            <TableHead className="min-w-[100px] font-semibold text-foreground">Price</TableHead>
            <TableHead className="sticky right-0 min-w-[155px] bg-secondary text-right font-semibold text-foreground">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tradelines.map((tradeline, index) => {
            const isSoldOut = tradeline.status === "sold-out";
            return (
              <TableRow
                key={tradeline.id}
                className={index % 2 === 0 ? "bg-background/25" : "bg-secondary/30"}
              >
                <TableCell className="py-3.5 font-semibold">
                  <Link
                    to={getProductUrl(tradeline)}
                    className="inline-flex min-h-11 items-center text-foreground transition-colors hover:text-primary"
                  >
                    {tradeline.bankName}
                  </Link>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">{tradeline.cardId}</TableCell>
                <TableCell className="font-semibold text-primary">${tradeline.creditLimit.toLocaleString()}</TableCell>
                <TableCell className="text-foreground">{tradeline.age}</TableCell>
                <TableCell className="text-muted-foreground">{tradeline.purchaseDeadline}</TableCell>
                <TableCell className="text-muted-foreground">{tradeline.firstReportingPeriod}</TableCell>
                <TableCell className="font-bold text-foreground">${tradeline.price.toLocaleString()}</TableCell>
                <TableCell className={index % 2 === 0 ? "sticky right-0 bg-card text-right" : "sticky right-0 bg-secondary text-right"}>
                  <Button
                    size="sm"
                    disabled={isSoldOut}
                    onClick={() => handleAddToCart(tradeline)}
                    className="min-w-[130px] rounded-md"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isSoldOut ? "Sold Out" : "Add to Cart"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="border-t border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground md:hidden">
        Swipe sideways to view every column.
      </div>
    </div>
  );
};
