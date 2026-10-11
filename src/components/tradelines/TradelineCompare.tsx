import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tradeline } from "@/utils/tradelineData";
import { ShoppingCart, X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tradelines: Tradeline[];
  onRemove: (id: string) => void;
  onAddToCart: (t: Tradeline) => void;
}

const rows: { label: string; render: (t: Tradeline) => string; best?: (ts: Tradeline[]) => string }[] = [
  { label: "Issuer", render: (t) => t.bankName },
  { label: "Card ID", render: (t) => t.cardId },
  { label: "Credit Limit", render: (t) => `$${t.creditLimit.toLocaleString()}`, best: (ts) => ts.reduce((a, b) => (b.creditLimit > a.creditLimit ? b : a)).id },
  { label: "Age", render: (t) => t.age, best: (ts) => ts.reduce((a, b) => (b.ageInYears > a.ageInYears ? b : a)).id },
  { label: "Price", render: (t) => `$${t.price.toLocaleString()}`, best: (ts) => ts.reduce((a, b) => (b.price < a.price ? b : a)).id },
  { label: "Limit per $1", render: (t) => `$${Math.round(t.creditLimit / t.price).toLocaleString()}`, best: (ts) => ts.reduce((a, b) => (b.creditLimit / b.price > a.creditLimit / a.price ? b : a)).id },
  { label: "Purchase Deadline", render: (t) => t.purchaseDeadline },
  { label: "1st Reporting Period", render: (t) => t.firstReportingPeriod },
  { label: "Reporting Cycles", render: (t) => t.reportingPeriod },
  { label: "Spots Left", render: (t) => String(t.availability) },
];

export const TradelineCompare = ({ open, onOpenChange, tradelines, onRemove, onAddToCart }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[calc(100vw-1rem)] max-w-5xl max-h-[90dvh] overflow-y-auto overscroll-contain p-4 sm:p-6">
      <DialogHeader>
        <DialogTitle>Compare Tradelines</DialogTitle>
        <DialogDescription>Best value in each row is highlighted.</DialogDescription>
      </DialogHeader>
      {tradelines.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No tradelines selected.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-secondary">
              <tr>
                <th scope="col" className="sticky left-0 bg-secondary p-3 text-left font-semibold">Feature</th>
                {tradelines.map((t) => (
                  <th key={t.id} scope="col" className="p-3 text-left font-semibold">
                    <div className="flex items-start justify-between gap-2">
                      <span>{t.bankName}</span>
                      <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => onRemove(t.id)} aria-label={`Remove ${t.bankName} ${t.cardId} from comparison`}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const bestId = tradelines.length > 1 && r.best ? r.best(tradelines) : null;
                return (
                  <tr key={r.label} className={i % 2 ? "bg-secondary/30" : "bg-background/25"}>
                    <th scope="row" className="sticky left-0 bg-card p-3 text-left font-medium text-muted-foreground">{r.label}</th>
                    {tradelines.map((t) => (
                      <td key={t.id} className={`p-3 ${bestId === t.id ? "font-bold text-primary" : "text-foreground"}`}>{r.render(t)}</td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <th scope="row" className="sticky left-0 bg-card p-3" />
                {tradelines.map((t) => (
                  <td key={t.id} className="p-3">
                    <Button size="sm" className="min-h-11 w-full" disabled={t.status === "sold-out"} onClick={() => onAddToCart(t)}>
                      <ShoppingCart className="h-4 w-4" />
                      {t.status === "sold-out" ? "Sold Out" : "Add to Cart"}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
