import { Tradeline } from "@/utils/tradelineData";
import { Layers, CreditCard, TrendingUp, CalendarClock, Tag, Trophy } from "lucide-react";

interface TradelineStatsProps {
  tradelines: Tradeline[];
}

export const TradelineStats = ({ tradelines }: TradelineStatsProps) => {
  const totalLimit = tradelines.reduce((sum, t) => sum + t.creditLimit, 0);
  const avgLimit = Math.round(totalLimit / tradelines.length);
  const avgAge = (tradelines.reduce((sum, t) => sum + t.ageInYears, 0) / tradelines.length).toFixed(1);
  const startingPrice = Math.min(...tradelines.map((t) => t.price));
  const highestLimit = Math.max(...tradelines.map((t) => t.creditLimit));

  const stats = [
    {
      icon: Layers,
      value: `${tradelines.length.toLocaleString()}+`,
      title: "Total Tradelines",
      description: "Verified premium inventory",
      accent: "primary" as const,
    },
    {
      icon: CreditCard,
      value: `$${(totalLimit / 1_000_000).toFixed(1)}M`,
      title: "Total Credit Limit",
      description: "Combined buying power",
      accent: "accent" as const,
    },
    {
      icon: TrendingUp,
      value: `$${avgLimit.toLocaleString()}`,
      title: "Average Credit Limit",
      description: "Across all tradelines",
      accent: "primary" as const,
    },
    {
      icon: CalendarClock,
      value: `${avgAge} yrs`,
      title: "Average Account Age",
      description: "Seasoned, aged history",
      accent: "accent" as const,
    },
    {
      icon: Tag,
      value: `$${startingPrice}`,
      title: "Starting Price",
      description: "Lowest entry point",
      accent: "primary" as const,
    },
    {
      icon: Trophy,
      value: `$${highestLimit.toLocaleString()}`,
      title: "Highest Limit",
      description: "Top-tier tradeline",
      accent: "accent" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPrimary = stat.accent === "primary";
        return (
          <div
            key={stat.title}
            className="premium-card rounded-2xl p-6 animate-slide-up"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-3xl font-bold tracking-tight ${
                    isPrimary ? "text-primary" : "text-accent"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">{stat.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
              </div>
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${
                  isPrimary
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-accent/30 bg-accent/10 text-accent"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
