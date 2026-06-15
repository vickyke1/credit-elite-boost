import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  KeyRound,
  UserCheck,
  Repeat,
  CalendarClock,
  Layers,
  BadgeCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Users,
  Sprout,
  RefreshCcw,
  GraduationCap,
  LineChart,
} from "lucide-react";

const benefits = [
  {
    icon: KeyRound,
    title: "Direct Account Ownership",
    description:
      "The account belongs directly to you as the primary account holder.",
  },
  {
    icon: UserCheck,
    title: "Independent Credit Building",
    description:
      "History is established under your own credit file rather than someone else's.",
  },
  {
    icon: Repeat,
    title: "Ongoing Reporting Activity",
    description:
      "Active management of the account can generate continuous reporting over time.",
  },
  {
    icon: CalendarClock,
    title: "Long-Term Credit Development",
    description:
      "Accounts you own may contribute to long-term profile growth as they age.",
  },
  {
    icon: BadgeCheck,
    title: "Positive Payment History Opportunities",
    description:
      "Consistent, on-time payments offer the opportunity to build a positive record.",
  },
  {
    icon: Layers,
    title: "Stronger Credit Mix Potential",
    description:
      "Adding an account you manage may help diversify the types of credit on file.",
  },
];

const comparison = [
  {
    aspect: "Account relationship",
    authorized: "Added to an existing account",
    primary: "Account owner",
  },
  {
    aspect: "Credit history",
    authorized: "History may report",
    primary: "Builds personal history",
  },
  {
    aspect: "Ownership",
    authorized: "Not the account owner",
    primary: "Ongoing account management",
  },
  {
    aspect: "Timeline",
    authorized: "Faster reporting timeline",
    primary: "Long-term profile development",
  },
];

const audience = [
  { icon: Sprout, label: "Individuals building credit history" },
  { icon: RefreshCcw, label: "Consumers recovering from financial setbacks" },
  { icon: GraduationCap, label: "First-time credit users" },
  { icon: LineChart, label: "Those seeking long-term credit development" },
];

const PrimaryTradelinesSection = () => {
  return (
    <section
      id="primary-tradelines"
      aria-labelledby="pt-heading"
      className="relative py-20 sm:py-24 overflow-hidden scroll-mt-24 bg-card/20"
    >
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 right-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Hero */}
        <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--glass-border))] bg-card/40 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-md">
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Primary Tradelines
          </span>
          <h2
            id="pt-heading"
            className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
          >
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Primary Tradelines
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Primary tradelines are credit accounts opened and managed directly by
            the account holder and may contribute to long-term credit profile
            development.
          </p>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
            <h3 className="text-2xl font-bold mb-4">
              What Are Primary Tradelines?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Unlike authorized user tradelines, primary tradelines are accounts
              that belong directly to the individual. Payment history, account
              age, utilization, and account management are reported under the
              primary account holder's credit file.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h3 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            Potential Benefits
          </h3>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            How owning and managing an account directly may support credit
            profile development.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="premium-card group rounded-2xl p-6 h-full"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h4 className="mt-5 text-lg font-semibold">{benefit.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h3
            id="comparison-heading"
            className="text-center text-2xl sm:text-3xl font-bold mb-3"
          >
            Authorized User vs Primary Tradelines
          </h3>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            A side-by-side overview to help explain the differences between the
            two approaches.
          </p>

          <div className="max-w-5xl mx-auto glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <caption className="sr-only">
                  Comparison of authorized user tradelines and primary tradelines
                </caption>
                <thead>
                  <tr className="border-b border-[hsl(var(--glass-border))]">
                    <th
                      scope="col"
                      className="p-4 sm:p-5 text-sm font-semibold text-muted-foreground"
                    >
                      Aspect
                    </th>
                    <th
                      scope="col"
                      className="p-4 sm:p-5 text-sm font-semibold text-primary"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4" aria-hidden="true" />
                        Authorized User Tradelines
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="p-4 sm:p-5 text-sm font-semibold text-accent"
                    >
                      <span className="inline-flex items-center gap-2">
                        <KeyRound className="h-4 w-4" aria-hidden="true" />
                        Primary Tradelines
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, index) => (
                    <tr
                      key={row.aspect}
                      className={`border-b border-[hsl(var(--glass-border))] last:border-0 ${
                        index % 2 === 1 ? "bg-card/30" : ""
                      }`}
                    >
                      <th
                        scope="row"
                        className="p-4 sm:p-5 text-sm font-medium text-foreground/90"
                      >
                        {row.aspect}
                      </th>
                      <td className="p-4 sm:p-5 text-sm text-muted-foreground">
                        <span className="inline-flex items-start gap-2">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          {row.authorized}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-sm text-muted-foreground">
                        <span className="inline-flex items-start gap-2">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          {row.primary}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Who May Consider */}
        <div className="mb-16">
          <h3 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            Who May Consider Primary Tradelines?
          </h3>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Primary tradelines may be relevant for a range of credit-building
            situations.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 max-w-4xl mx-auto">
            {audience.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="glass-panel flex items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Educational Disclaimer + CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6 flex gap-4">
            <Info className="h-6 w-6 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <h4 className="font-semibold mb-1">Educational Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Opening and maintaining credit accounts involves financial
                responsibility. Approval requirements vary by issuer and are not
                guaranteed.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent min-h-[52px] text-base font-semibold w-full sm:w-auto"
            >
              <Link to="/tradelines">
                Explore Primary Tradeline Options
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
              Educational information only
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrimaryTradelinesSection;
