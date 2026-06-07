import { ShieldCheck, Zap, Sparkles, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Curated Quality",
    description:
      "Every product is hand-reviewed for design, usability, and value before it reaches the hive.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description:
      "Find it here, check out on Etsy, and download your files immediately — no waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description:
      "Payments are handled by Etsy's trusted, buyer-protected checkout. Your details stay safe.",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale",
    description:
      "A platform that grows with creators — from an Etsy funnel today to direct sales tomorrow.",
  },
];

export function CreatorBenefits() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="rounded-xl border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
}
