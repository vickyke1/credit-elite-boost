import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  History,
  Gauge,
  TrendingDown,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";

const benefits = [
  {
    icon: History,
    title: "Established Account History",
    description:
      "Being added to a seasoned account may allow its age and history to appear within your credit profile.",
  },
  {
    icon: Gauge,
    title: "Higher Available Credit Limits",
    description:
      "Accounts with larger limits can contribute additional available credit to the overall picture.",
  },
  {
    icon: TrendingDown,
    title: "Lower Utilization Potential",
    description:
      "A higher limit paired with a low balance may help reflect a lower credit utilization ratio.",
  },
  {
    icon: ShieldCheck,
    title: "Positive Payment History",
    description:
      "An account with a consistent on-time payment record may add positive history to the profile.",
  },
  {
    icon: Rocket,
    title: "Faster Credit Profile Development",
    description:
      "Authorized user reporting can update relatively quickly compared with opening new accounts.",
  },
];

const steps = [
  {
    number: "01",
    title: "Select an eligible tradeline",
    description:
      "Review available accounts and choose one that aligns with your profile and goals.",
  },
  {
    number: "02",
    title: "Become an authorized user",
    description:
      "You are added to the existing account holder's credit card as an authorized user.",
  },
  {
    number: "03",
    title: "Wait for reporting",
    description:
      "Allow time for the account to report to participating credit bureaus.",
  },
  {
    number: "04",
    title: "Monitor your profile",
    description:
      "Keep an eye on your credit profile for updates and reported changes.",
  },
];

const AuthorizedUserTradelinesSection = () => {
  return (
    <section
      id="authorized-user-tradelines"
      aria-labelledby="aut-heading"
      className="relative py-20 sm:py-24 overflow-hidden scroll-mt-24"
    >
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Hero */}
        <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--glass-border))] bg-card/40 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
            <Users className="h-4 w-4" aria-hidden="true" />
            Authorized User Tradelines
          </span>
          <h2
            id="aut-heading"
            className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
          >
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Authorized User Tradelines
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Learn how authorized user tradelines may help strengthen the overall
            appearance of a credit profile by adding positive account history
            from an established credit account.
          </p>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
            <h3 className="text-2xl font-bold mb-4">
              What Are Authorized User Tradelines?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Authorized user tradelines are credit accounts that allow an
              individual to be added to an existing account holder's credit
              card. In many situations, the account history, age, credit limit,
              and payment history may appear on the authorized user's credit
              report depending on the reporting practices of the card issuer.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h3 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            Potential Benefits
          </h3>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            How authorized user reporting may contribute to the overall
            appearance of a credit profile.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="premium-card group rounded-2xl p-6 h-full"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
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

        {/* How It Works */}
        <div className="mb-16">
          <h3 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            How It Works
          </h3>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            A clear, four-step overview of the authorized user process.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="glass-panel h-full rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span className="text-3xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                    {step.number}
                  </span>
                  <h4 className="mt-3 text-lg font-semibold">{step.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight
                    className="hidden lg:block absolute top-1/2 -right-3 h-5 w-5 -translate-y-1/2 text-primary/40"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Educational Disclaimer + CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6 flex gap-4">
            <Info
              className="h-6 w-6 shrink-0 text-warning"
              aria-hidden="true"
            />
            <div>
              <h4 className="font-semibold mb-1">Educational Disclaimer</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Results vary by individual credit profile, reporting practices,
                and credit bureau policies. No credit score increase or approval
                outcome is guaranteed.
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
                View Available Tradelines
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Educational information only
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorizedUserTradelinesSection;
