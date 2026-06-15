import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DollarSign,
  ShieldCheck,
  Clock,
  TrendingUp,
  CreditCard,
  CalendarClock,
  Banknote,
  UserCheck,
  CheckCircle2,
  Lock,
  Headphones,
  Home,
} from "lucide-react";
import {
  useSellTradelineForm,
  sellTradelineSchema,
  type SellTradelineFormData,
} from "@/hooks/useSellTradelineForm";
import { faqSchema, breadcrumbSchema, serviceSchema } from "@/utils/schemaMarkup";

const PAGE_URL = "https://cpncreditboost.com/sell-tradelines";

const benefits = [
  {
    icon: DollarSign,
    title: "Recurring Passive Income",
    description:
      "Earn payouts every time you add an authorized user to an eligible card. Strong, seasoned accounts can generate income month after month with zero impact on how you use your card.",
  },
  {
    icon: ShieldCheck,
    title: "Your Information Stays Protected",
    description:
      "Authorized users never receive your card, account number, or personal details. You stay in complete control of your account and statements at all times.",
  },
  {
    icon: TrendingUp,
    title: "No Cost, No Credit Impact",
    description:
      "Joining is free, and adding authorized users does not lower your score or your available credit. Your own spending and limits remain entirely your own.",
  },
  {
    icon: Headphones,
    title: "Dedicated Partner Support",
    description:
      "A real account manager walks you through every step, confirms each add, and makes sure your payouts arrive on schedule. Questions are answered the same day.",
  },
];

const process = [
  {
    step: 1,
    icon: UserCheck,
    title: "Apply in Minutes",
    description:
      "Submit the short application below with details about your eligible cards. There is no obligation and no credit pull.",
  },
  {
    step: 2,
    icon: CheckCircle2,
    title: "Eligibility Review",
    description:
      "Our team verifies your card age, limit, and payment history to confirm which accounts qualify and estimate your earning potential.",
  },
  {
    step: 3,
    icon: CreditCard,
    title: "Add Authorized Users",
    description:
      "When a buyer is matched, we send clear instructions to add an authorized user. You stay in control and can add them online or by phone in minutes.",
  },
  {
    step: 4,
    icon: Banknote,
    title: "Get Paid",
    description:
      "Once the user posts to the account, your payout is released. Keep the account in good standing and continue earning on every cycle.",
  },
];

const requirements = [
  {
    icon: CalendarClock,
    title: "Seasoned Accounts",
    description:
      "Cards that are at least 2 years old qualify, and older accounts earn more. The longer the history, the higher the demand.",
  },
  {
    icon: CreditCard,
    title: "Healthy Credit Limit",
    description:
      "A limit of $5,000 or higher is preferred. Higher limits with low utilization command the best payouts.",
  },
  {
    icon: CheckCircle2,
    title: "Spotless Payment History",
    description:
      "Accounts must have on-time payments with no late marks, charge-offs, or derogatory activity.",
  },
  {
    icon: TrendingUp,
    title: "Low Utilization",
    description:
      "Keep balances under roughly 15% of the limit so the account stays attractive to buyers.",
  },
  {
    icon: Banknote,
    title: "Eligible Issuers",
    description:
      "Major banks that report authorized users qualify, including most revolving cards from leading national issuers.",
  },
  {
    icon: UserCheck,
    title: "Account Holder Control",
    description:
      "You must be the primary cardholder and able to add or remove authorized users through your bank.",
  },
];

const stats = [
  { value: "$0", label: "Cost to Join" },
  { value: "24 hr", label: "Application Review" },
  { value: "100%", label: "Account Control Retained" },
  { value: "1,200+", label: "Active Credit Partners" },
];

const faqs = [
  {
    question: "How much can I earn selling tradelines?",
    answer:
      "Payouts depend on the age and limit of each card. Newer accounts with mid-range limits typically earn a modest amount per authorized user, while older accounts with high limits can earn significantly more on every reporting cycle. After your eligibility review we provide a clear estimate for each of your cards before you commit to anything.",
  },
  {
    question: "Is becoming a credit partner safe?",
    answer:
      "Yes. Authorized users are added in name only. They never receive a physical card, your account number, online login, or any personal information, and they cannot make charges or access your funds. You remain the sole account holder and can remove an authorized user at any time.",
  },
  {
    question: "Will adding authorized users hurt my credit score?",
    answer:
      "No. Adding an authorized user to a well-managed account does not lower your credit score or reduce the credit available to you. As long as you keep balances low and payments on time, your own credit profile is unaffected.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Once an authorized user is added and posts to the account, your payout is released through your chosen method. Your account manager confirms each add and keeps you updated on payout timing so you always know what to expect.",
  },
  {
    question: "Which banks and cards qualify?",
    answer:
      "Most revolving credit cards from major national issuers that report authorized user history qualify. The best candidates are accounts that are at least two years old, have a limit of $5,000 or more, carry low balances, and show a flawless payment history. Submit your card details and we will confirm exactly which accounts are eligible.",
  },
  {
    question: "Is this legal?",
    answer:
      "Adding authorized users is a feature that card issuers themselves offer. Our program helps responsible cardholders share their well-managed accounts with people working to build credit. We provide guidance to keep your participation compliant with your card agreements, and you should always review your issuer's terms.",
  },
];

const numCardOptions = ["1 card", "2 cards", "3 cards", "4 cards", "5 or more cards"];
const limitOptions = [
  "Under $5,000",
  "$5,000 – $9,999",
  "$10,000 – $19,999",
  "$20,000 – $34,999",
  "$35,000 or more",
];
const ageOptions = [
  "Under 2 years",
  "2 – 4 years",
  "5 – 9 years",
  "10 – 15 years",
  "Over 15 years",
];
const contactOptions = ["Email", "Phone call", "Text message", "Telegram"];

type FormState = SellTradelineFormData;

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  numCards: "",
  avgLimit: "",
  cardAge: "",
  banks: "",
  contactMethod: "",
  message: "",
};

const SellTradelines = () => {
  const { submitForm, isSubmitting } = useSellTradelineForm();
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = sellTradelineSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const submission = await submitForm(result.data);
    if (submission.success) {
      setFormData(initialForm);
    }
  };

  const errorText = (field: keyof FormState) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-destructive">{errors[field]}</p>
    ) : null;

  return (
    <>
      <SEOHead
        title="Sell Tradelines — Become a Credit Partner & Earn | CPN Credit Boost"
        description="Turn your seasoned credit cards into passive income. Become a CPN Credit Boost credit partner, add authorized users safely, and get paid on every cycle. Free to join, no credit impact, full account control."
        keywords="sell tradelines, become a credit partner, authorized user income, sell authorized user spots, earn money with tradelines, credit card partner program, passive income tradelines"
        canonicalUrl={PAGE_URL}
        ogType="website"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home", url: "https://cpncreditboost.com" },
              { name: "Sell Tradelines", url: PAGE_URL },
            ]),
            serviceSchema({
              name: "Credit Partner Program",
              description:
                "Earn passive income by adding authorized users to your seasoned credit cards. Free to join, no credit impact, and full account control retained.",
              url: PAGE_URL,
            }),
            faqSchema(faqs),
          ],
        }}
      />

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1">
                      <Home className="h-4 w-4" /> Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sell Tradelines</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Hero */}
          <section className="relative overflow-hidden py-16 md:py-24">
            <div className="absolute inset-0 bg-gradient-hero opacity-40" aria-hidden="true" />
            <div className="container relative mx-auto px-6">
              <div className="mx-auto max-w-4xl text-center">
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <DollarSign className="h-4 w-4" /> Credit Partner Program
                </span>
                <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                  Sell Tradelines &{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Earn Passive Income
                  </span>
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Put your seasoned, well-managed credit cards to work. Add authorized
                  users through your bank and get paid on every reporting cycle — your
                  card, your account number, and your personal details always stay
                  private.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="px-8">
                    <a href="#apply">Apply to Become a Partner</a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8">
                    <a href="#how-it-works">See How It Works</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Credibility / stats */}
          <section className="border-y border-border bg-surface-elevated py-12">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="mb-1 text-3xl font-bold text-primary md:text-4xl">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Bank-level data security
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> You keep full account control
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Same-day partner support
                </span>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-6">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Why Cardholders Partner With Us
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your strong credit history is a valuable asset. Our credit partner
                  program lets you earn from it safely, with none of the hassle and full
                  transparency at every step.
                </p>
              </div>
              <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
                {benefits.map((benefit) => (
                  <Card
                    key={benefit.title}
                    className="border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-elevated"
                  >
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <benefit.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section id="how-it-works" className="bg-surface-elevated py-16 md:py-20">
            <div className="container mx-auto px-6">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  How Selling Tradelines Works
                </h2>
                <p className="text-lg text-muted-foreground">
                  From application to payout, the process is simple, transparent, and
                  built around keeping your accounts secure.
                </p>
              </div>
              <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
                {process.map((item) => (
                  <div key={item.step} className="relative rounded-2xl bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-cta text-lg font-bold text-accent-foreground">
                        {item.step}
                      </div>
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-6">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Do Your Cards Qualify?
                </h2>
                <p className="text-lg text-muted-foreground">
                  The strongest tradelines share a few key traits. If your accounts check
                  most of these boxes, you are a great fit for the program.
                </p>
              </div>
              <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requirements.map((req) => (
                  <div
                    key={req.title}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <req.icon className="mb-4 h-8 w-8 text-primary" />
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {req.title}
                    </h3>
                    <p className="text-muted-foreground">{req.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Application form */}
          <section id="apply" className="bg-surface-elevated py-16 md:py-20">
            <div className="container mx-auto px-6">
              <div className="mx-auto max-w-2xl">
                <div className="mb-10 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    Apply to Become a Credit Partner
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Tell us about your eligible cards. There is no cost, no obligation,
                    and no credit pull — just a quick review and an honest earning
                    estimate.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Jordan Carter"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.fullName}
                    />
                    {errorText("fullName")}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                        aria-invalid={!!errors.email}
                      />
                      {errorText("email")}
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
                        Phone *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        disabled={isSubmitting}
                        aria-invalid={!!errors.phone}
                      />
                      {errorText("phone")}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Eligible Credit Cards *
                      </label>
                      <Select
                        value={formData.numCards}
                        onValueChange={(v) => updateField("numCards", v)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger aria-invalid={!!errors.numCards}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {numCardOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errorText("numCards")}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Average Credit Limit *
                      </label>
                      <Select
                        value={formData.avgLimit}
                        onValueChange={(v) => updateField("avgLimit", v)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger aria-invalid={!!errors.avgLimit}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {limitOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errorText("avgLimit")}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Card Age *
                      </label>
                      <Select
                        value={formData.cardAge}
                        onValueChange={(v) => updateField("cardAge", v)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger aria-invalid={!!errors.cardAge}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errorText("cardAge")}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="banks" className="mb-2 block text-sm font-medium text-foreground">
                      Issuing Banks *
                    </label>
                    <Input
                      id="banks"
                      value={formData.banks}
                      onChange={(e) => updateField("banks", e.target.value)}
                      placeholder="e.g. Chase, American Express, Capital One"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.banks}
                    />
                    {errorText("banks")}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Preferred Contact Method *
                    </label>
                    <Select
                      value={formData.contactMethod}
                      onValueChange={(v) => updateField("contactMethod", v)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger aria-invalid={!!errors.contactMethod}>
                        <SelectValue placeholder="How should we reach you?" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errorText("contactMethod")}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                      Message <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Anything else you'd like us to know about your accounts or goals."
                      rows={4}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.message}
                    />
                    {errorText("message")}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    By applying you agree to be contacted about the credit partner
                    program. We never share your information with third parties.
                  </p>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-6">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Credit Partner FAQ
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to know before you start earning from your
                  tradelines.
                </p>
              </div>
              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="rounded-xl border border-border bg-card px-6 transition-colors hover:border-primary/50"
                    >
                      <AccordionTrigger className="py-6 text-left hover:text-primary hover:no-underline">
                        <span className="text-lg font-semibold">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Closing CTA */}
          <section className="bg-surface-elevated py-16">
            <div className="container mx-auto px-6 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Ready to Turn Your Credit Into Income?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Join a community of credit partners earning from accounts they already
                own. Applying takes just a couple of minutes.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="px-8">
                  <a href="#apply">Start My Application</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link to="/contact">Talk to Our Team</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="py-12">
            <div className="container mx-auto px-6">
              <div className="mx-auto max-w-4xl rounded-lg border-l-4 border-primary bg-surface-elevated p-8">
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Important Disclosure
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Earnings vary based on the age, limit, and history of each account and
                  are not guaranteed. Adding authorized users is a standard feature
                  offered by card issuers; you are responsible for reviewing your own
                  cardholder agreement and ensuring participation complies with its
                  terms. CPN Credit Boost provides guidance and matching services and does
                  not provide legal or financial advice.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <FloatingChat />
      </div>
    </>
  );
};

export default SellTradelines;
