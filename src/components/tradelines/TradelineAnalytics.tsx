import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { Tradeline } from "@/utils/tradelineData";
import { BarChart3, PieChart as PieIcon } from "lucide-react";

interface TradelineAnalyticsProps {
  tradelines: Tradeline[];
}

const TEAL = "hsl(174, 90%, 45%)";
const EMERALD = "hsl(156, 80%, 45%)";
const AMBER = "hsl(42, 96%, 56%)";
const RED = "hsl(0, 84%, 62%)";

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 text-sm">
      {label && <div className="mb-1 font-semibold text-foreground">{label}</div>}
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color || entry.payload?.fill }} />
          <span>{entry.name}:</span>
          <span className="font-semibold text-foreground">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export const TradelineAnalytics = ({ tradelines }: TradelineAnalyticsProps) => {
  const limitTiers = useMemo(() => {
    const tiers = [
      { name: "$25K–40K", min: 0, max: 40000, count: 0 },
      { name: "$40K–75K", min: 40000, max: 75000, count: 0 },
      { name: "$75K–100K", min: 75000, max: 100000, count: 0 },
      { name: "$100K+", min: 100000, max: Infinity, count: 0 },
    ];
    tradelines.forEach((t) => {
      const tier = tiers.find((x) => t.creditLimit >= x.min && t.creditLimit < x.max);
      if (tier) tier.count += 1;
    });
    return tiers.map(({ name, count }) => ({ name, count }));
  }, [tradelines]);

  const statusData = useMemo(() => {
    const counts = { available: 0, limited: 0, "sold-out": 0 } as Record<string, number>;
    tradelines.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return [
      { name: "Available", value: counts.available, fill: EMERALD },
      { name: "Limited", value: counts.limited, fill: AMBER },
      { name: "Sold Out", value: counts["sold-out"], fill: RED },
    ].filter((d) => d.value > 0);
  }, [tradelines]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-14">
      {/* Inventory by limit tier */}
      <div className="glass-card rounded-2xl p-6 lg:col-span-2 animate-slide-up">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Inventory by Credit Limit</h3>
            <p className="text-xs text-muted-foreground">Distribution across available tradelines</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={limitTiers} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity={0.95} />
                <stop offset="100%" stopColor={EMERALD} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 45% 22%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "hsl(210 16% 68%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(210 16% 68%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(174 90% 45% / 0.06)" }} />
            <Bar dataKey="count" name="Tradelines" fill="url(#barTeal)" radius={[8, 8, 0, 0]} maxBarSize={64} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Availability breakdown */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
            <PieIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Availability</h3>
            <p className="text-xs text-muted-foreground">Live inventory status</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              stroke="none"
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
