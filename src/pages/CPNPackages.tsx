import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { productSchema, breadcrumbSchema } from "@/utils/schemaMarkup";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Star, Zap } from "lucide-react";

const priceToNumber = (price: string) => parseInt(price.replace(/[$,]/g, ""), 10);

type Tier = "standard" | "popular" | "premium";

interface Package {
  name: string;
  price: string;
  tier: Tier;
  badge?: string;
  description: string;
  features: string[];
}

const tierStyles: Record<
  Tier,
  { card: string; price: string; check: string; button: string }
> = {
  standard: {
    card: "border-border hover:border-primary/50 hover:shadow-glow-primary",
    price: "text-primary",
    check: "text-primary",
    button: "",
  },
  popular: {
    card: "border-primary shadow-glow-primary",
    price: "text-primary",
    check: "text-primary",
    button: "",
  },
  premium: {
    card: "border-accent shadow-glow-accent",
    price: "text-accent",
    check: "text-accent",
    button: "bg-accent text-accent-foreground hover:bg-accent/90",
  },
};

const CPNPackages = () => {
  const { addToCart } = useCart();

  const handleAddPackage = (pkg: {
    name: string;
    price: string;
    description: string;
    features: string[];
  }) => {
    addToCart({
      id: `cpn-package-${pkg.name}`,
      type: "package",
      name: pkg.name,
      price: priceToNumber(pkg.price),
      description: pkg.description,
      features: pkg.features,
    });
    toast({
      title: "Added to Cart",
      description: `${pkg.name} has been added to your cart.`,
    });
  };

  const packages: Package[] = [
    {
      name: "Starter",
      price: "$149",
      tier: "standard",
      description:
        "Everything you need to establish a fresh CPN profile and start building from day one.",
      features: [
        "New CPN Number (SSN Alternative)",
        "Complete DOB + Address + Phone Setup",
        "Disposable Email Account Setup",
        "Soft-Pull Ready Format",
        "Basic Identity Protection Guide",
        "CPN Number Verification",
        "24/7 Email Support",
      ],
    },
    {
      name: "Bronze",
      price: "$299",
      tier: "standard",
      description:
        "A complete identity packet with the documentation needed to support your new CPN.",
      features: [
        "Everything in Starter Package",
        "Full CPN Identity Packet (PDF Format)",
        "Basic Utility Bill Documentation",
        "Income Stub Template (Editable)",
        "Address Verification Letter",
        "Identity Profile Setup Guide",
        "Credit Building Strategy PDF",
        "Priority Email Support",
      ],
    },
    {
      name: "Silver",
      price: "$499",
      tier: "standard",
      description:
        "A full document set plus dispute tools and a vendor roadmap to grow your file fast.",
      features: [
        "Everything in Bronze Package",
        "Full Identity Document Set (Lease Agreement)",
        "Bank Statement Documentation",
        "Complete CPN Credit File Setup Guide",
        "Professional Dispute Letter Templates (10+)",
        "Credit Bureau Contact Information",
        "Vendor Creditor List (50+ Vendors)",
        "30-Day Credit Building Roadmap",
        "Live Chat Support Access",
      ],
    },
    {
      name: "Gold",
      price: "$850",
      tier: "popular",
      badge: "Most Popular",
      description:
        "Our most popular package — tri-merge ready with premium vendors and tradeline strategy.",
      features: [
        "Everything in Silver Package",
        "Tri-Merge Bureau Ready Formatting",
        "Premium Vendor Starter List (100+ Vendors)",
        "AU Tradeline Strategy & Recommendations",
        "Credit Mix Optimization Guide",
        "Secured Card Application Templates",
        "Business Credit Setup Instructions",
        "Tax ID (EIN) Application Guide",
        "Credit Monitoring Service (6 Months Free)",
        "Priority Phone Support",
      ],
    },
    {
      name: "Platinum",
      price: "$1500",
      tier: "standard",
      description:
        "Aged identity assets and advanced strategies for serious profile strengthening.",
      features: [
        "Everything in Gold Package",
        "Aged Phone Number (6+ Months Old)",
        "Aged Email Account (6+ Months Old)",
        "Complete Profile Strengthening Report",
        "Synthetic Risk Score Enhancement Tools",
        "Advanced Dispute & Removal Strategies",
        "LLC/Corporation Setup Guide",
        "Business Banking Recommendations",
        "Funding Source Directory (200+ Sources)",
        "Personal Credit Specialist (1 Hour Consultation)",
        "VIP 24/7 Phone Support",
      ],
    },
    {
      name: "Ultimate",
      price: "$2500",
      tier: "premium",
      badge: "Premium",
      description:
        "The complete business and personal credit identity suite with a dedicated manager.",
      features: [
        "Everything in Platinum Package",
        "Full CPN Business Identity Package",
        "Bank-Ready Complete Document Set",
        "Exclusive Private Vendor Network (500+)",
        "Premium Tradeline Connection Map",
        "Business Credit Card Strategy Guide",
        "Net-30 Vendor Account Setup (10 Accounts)",
        "Business Credit Profile Building Plan",
        "Store Credit Card Application Templates",
        "Financial Management Software (1 Year License)",
        "Dedicated Account Manager",
        "Weekly Check-ins for 3 Months",
      ],
    },
  ];

  const premiumTradelines: Package = {
    name: "Premium Tradelines",
    price: "$2000",
    tier: "premium",
    badge: "Premium",
    description:
      "Five seasoned, high-limit US bank tradelines reporting to all three major bureaus.",
    features: [
      "5 Premium US Bank Tradelines",
      "High Credit Limits ($25K–$50K each)",
      "Perfect Payment History (0% Late Payments)",
      "Aged Accounts (5–15+ Years History)",
      "Low Utilization (<10% on all accounts)",
      "Major US Banks Only (Chase, Amex, BoA, Citi)",
      "Instant Score Boost (50–100+ Points Estimated)",
      "Reports to All 3 Bureaus (Experian, Equifax, TransUnion)",
      "Fast Posting (14–45 Days)",
      "60-Day Reporting Guarantee",
      "Primary Account Holder Verification",
      "Tradeline Performance Report",
    ],
  };

  return (
    <>
      <SEOHead
        title="CPN Packages & Premium Tradelines — Complete Credit Building Solutions | CPN Credit Boost"
        description="Choose from six CPN identity packages (Starter to Ultimate) plus premium aged tradelines. Fresh CPN numbers, full identity documentation, dispute tools, vendor lists, and expert support. One-time pricing from $149."
        keywords="CPN packages, CPN identity package, credit privacy number packages, CPN with tradelines, premium tradelines, aged tradeline packages, credit building packages, CPN services"
        canonicalUrl="https://cpncreditboost.com/cpn-packages"
        ogType="website"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home", url: "https://cpncreditboost.com" },
              { name: "CPN Packages", url: "https://cpncreditboost.com/cpn-packages" },
            ]),
            ...[...packages, premiumTradelines].map((pkg) =>
              productSchema({
                name: pkg.name,
                description: pkg.description,
                price: pkg.price.replace("$", ""),
                rating: 4.8,
                reviewCount: 127,
              })
            ),
          ],
        }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>CPN Packages</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Hero Section */}
          <header className="relative overflow-hidden py-16 md:py-20">
            <div className="absolute inset-0 bg-gradient-hero opacity-40" aria-hidden="true" />
            <div className="container relative mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  CPN Packages &{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Premium Tradelines
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Six complete CPN identity packages — from a fresh Starter profile to the
                  full Ultimate business suite — plus premium aged tradelines. Every
                  package is a one-time payment with documentation, strategy, and expert
                  support included.
                </p>
              </div>
            </div>
          </header>

          {/* Package Grid */}
          <section className="py-16" aria-labelledby="packages-heading">
            <div className="container mx-auto px-6">
              <h2 id="packages-heading" className="sr-only">
                Available CPN Packages
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {packages.map((pkg) => {
                  const styles = tierStyles[pkg.tier];
                  return (
                    <article
                      key={pkg.name}
                      className={`relative flex flex-col rounded-2xl border bg-surface-elevated p-8 transition-all duration-300 ${styles.card}`}
                      itemScope
                      itemType="https://schema.org/Product"
                    >
                      {pkg.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-sm font-semibold ${
                              pkg.tier === "premium"
                                ? "bg-accent text-accent-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {pkg.tier === "premium" ? (
                              <Zap className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                            {pkg.badge}
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-foreground mb-2" itemProp="name">
                          {pkg.name}
                        </h3>
                        <div
                          className={`text-4xl font-bold mb-1 ${styles.price}`}
                          itemProp="offers"
                          itemScope
                          itemType="https://schema.org/Offer"
                        >
                          <span itemProp="price" content={pkg.price.replace("$", "")}>
                            {pkg.price}
                          </span>
                          <meta itemProp="priceCurrency" content="USD" />
                        </div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
                          one-time payment
                        </div>
                        <p className="text-muted-foreground text-sm" itemProp="description">
                          {pkg.description}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2
                              className={`mt-0.5 h-5 w-5 flex-shrink-0 ${styles.check}`}
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${styles.button}`}
                        onClick={() => handleAddPackage(pkg)}
                      >
                        Select {pkg.name}
                      </Button>
                    </article>
                  );
                })}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-8">
                All packages include secure processing, legal compliance verification, and
                a quality guarantee.
              </p>
            </div>
          </section>

          {/* Premium Tradelines Feature */}
          <section className="py-16 bg-surface-elevated" aria-labelledby="tradelines-heading">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2
                  id="tradelines-heading"
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  Add Premium Aged Tradelines
                </h2>
                <p className="text-lg text-muted-foreground">
                  Pair any CPN package with seasoned, high-limit tradelines from major US
                  banks for an instant, bureau-reported credit boost.
                </p>
              </div>

              <article
                className="relative mx-auto max-w-lg rounded-2xl border border-accent bg-background p-8 shadow-glow-accent"
                itemScope
                itemType="https://schema.org/Product"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
                    <Zap className="h-4 w-4" />
                    {premiumTradelines.badge}
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h3
                    className="text-2xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent"
                    itemProp="name"
                  >
                    {premiumTradelines.name}
                  </h3>
                  <div
                    className="text-4xl font-bold text-accent mb-1"
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer"
                  >
                    <span itemProp="price" content="2000">
                      {premiumTradelines.price}
                    </span>
                    <meta itemProp="priceCurrency" content="USD" />
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    one-time payment
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {premiumTradelines.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleAddPackage(premiumTradelines)}
                >
                  Select {premiumTradelines.name}
                </Button>
              </article>
            </div>
          </section>

          {/* Process */}
          <section className="py-16" aria-labelledby="process-heading">
            <div className="container mx-auto px-6">
              <h2
                id="process-heading"
                className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              >
                How Our CPN Package Process Works
              </h2>
              <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { n: 1, t: "Choose Package", d: "Select the package that best fits your credit goals" },
                  { n: 2, t: "Secure Processing", d: "Complete secure order and verification process" },
                  { n: 3, t: "Setup & Delivery", d: "Receive your CPN and documents with a setup guide" },
                  { n: 4, t: "Build Credit", d: "Follow guidance to establish strong credit history" },
                ].map((step) => (
                  <div key={step.n} className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-primary-foreground font-bold">{step.n}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.t}</h3>
                    <p className="text-sm text-muted-foreground">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Guarantees */}
          <section className="py-16 bg-surface-elevated" aria-labelledby="guarantees-heading">
            <div className="container mx-auto px-6">
              <h2
                id="guarantees-heading"
                className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              >
                Our Service Guarantees
              </h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Legal Compliance</h3>
                  <p className="text-muted-foreground">
                    All our services comply with FCRA regulations and federal laws.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">🔒</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Secure Process</h3>
                  <p className="text-muted-foreground">
                    Bank-level encryption and security for all transactions and data.
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">💎</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Quality Tradelines</h3>
                  <p className="text-muted-foreground">
                    Only premium aged tradelines from reputable financial institutions.
                  </p>
                </div>
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

export default CPNPackages;
