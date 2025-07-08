import { Tradeline } from "@/utils/tradelineData";

interface TradelineStatsProps {
  tradelines: Tradeline[];
}

export const TradelineStats = ({ tradelines }: TradelineStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
      <div className="surface-elevated rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-accent">{tradelines.length}+</div>
        <div className="text-muted-foreground">Total Tradelines</div>
      </div>
      <div className="surface-elevated rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-primary">${Math.min(...tradelines.map(t => t.price))}</div>
        <div className="text-muted-foreground">Starting Price</div>
      </div>
      <div className="surface-elevated rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-accent">${Math.max(...tradelines.map(t => t.creditLimit)).toLocaleString()}</div>
        <div className="text-muted-foreground">Highest Limit</div>
      </div>
      <div className="surface-elevated rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-primary">{Math.max(...tradelines.map(t => t.ageInYears)).toFixed(0)}+</div>
        <div className="text-muted-foreground">Years Aged</div>
      </div>
    </div>
  );
};