import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Shield, Zap, CreditCard, ShoppingBag, AlertCircle, Home } from "lucide-react";
import { faqSchema, breadcrumbSchema } from "@/utils/schemaMarkup";

const TypesOfTradelines = () => {
  const faqs = [
    {
      question: "What are tradelines?",
      answer: "Tradelines are accounts that appear on your credit report, including credit cards, loans, mortgages, and other financial accounts. Each tradeline shows your payment history, credit limit, balance, and account age, all of which impact your credit score."
    },
    {
      question: "How do authorized user tradelines work?",
      answer: "When you become an authorized user on someone else's credit card, that account's positive payment history and credit limit can be added to your credit report. This can boost your credit score by improving your credit utilization ratio and adding positive payment history."
    },
    {
      question: "Which tradelines build credit fastest?",
      answer: "Primary tradelines (accounts in your own name) build credit most effectively long-term. For quick boosts, authorized user tradelines with high limits, low balances, and long payment histories can show results within 30-45 days. Credit-builder loans and secured credit cards are also effective for establishing new credit."
    },
    {
      question: "Are CPN tradelines legal?",
      answer: "CPNs (Credit Privacy Numbers) themselves are controversial. Using a CPN to misrepresent your identity to obtain credit is illegal. However, establishing legitimate tradelines using legal methods is perfectly legal. We recommend consulting with a credit professional to ensure compliance with all federal laws."
    },
    {
      question: "How many tradelines do I need?",
      answer: "Most credit experts recommend having 3-5 active tradelines for optimal credit scoring. A good mix includes revolving accounts (credit cards) and installment loans. Quality matters more than quantity—focus on tradelines with positive payment history and low utilization."
    },
    {
      question: "How long does it take for tradelines to appear on my credit report?",
      answer: "Authorized user tradelines typically appear on your credit report within 30-45 days after being added. Primary tradelines you open yourself appear within 30-60 days. Timing can vary depending on when the creditor reports to the credit bureaus."
    }
  ];

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://cpncreditboost.com" },
    { name: "Types of Tradelines", url: "https://cpncreditboost.com/types-of-tradelines" }
  ]);

  const tradelineTypes = [
    {
      icon: CreditCard,
      title: "Primary Tradelines",
      description: "Accounts opened in your own name where you are the primary account holder.",
      benefits: [
        "Builds credit history in your name",
        "You have full control over the account",
        "Strongest impact on long-term credit building",
        "Demonstrates creditworthiness to lenders"
      ],
      example: "Opening your own credit card, personal loan, or auto loan.",
      proTip: "Start with a secured credit card if you have limited or poor credit. Make small purchases and pay the balance in full each month to build positive payment history."
    },
    {
      icon: Shield,
      title: "Authorized User Tradelines",
      description: "Added as an authorized user to someone else's credit card account.",
      benefits: [
        "Inherit the account's positive payment history",
        "Can boost credit score quickly (30-45 days)",
        "No responsibility for debt payment",
        "Ideal for credit score improvement"
      ],
      example: "Being added as an authorized user on a parent's or spouse's credit card with excellent payment history.",
      proTip: "Choose accounts with high credit limits, low balances, and a long history of on-time payments. The older and cleaner the account, the better the impact on your score."
    },
    {
      icon: TrendingUp,
      title: "Business Tradelines",
      description: "Credit accounts established for business purposes under your business entity.",
      benefits: [
        "Separates personal and business credit",
        "Builds business credit profile",
        "Can access higher credit limits",
        "Protects personal credit from business expenses"
      ],
      example: "Business credit card, business line of credit, vendor accounts with net-30 terms.",
      proTip: "Establish your business with a registered EIN and open accounts with vendors that report to business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Business)."
    },
    {
      icon: Zap,
      title: "Revolving Tradelines",
      description: "Credit accounts with a credit limit that renews as you pay down the balance.",
      benefits: [
        "Improves credit utilization ratio",
        "Demonstrates ongoing credit management",
        "Most impactful for FICO scores",
        "Flexible borrowing as needed"
      ],
      example: "Credit cards, home equity lines of credit (HELOC), personal lines of credit.",
      proTip: "Keep utilization below 30% on all revolving accounts (ideally under 10%). Pay balances before the statement date to report lower utilization to credit bureaus."
    },
    {
      icon: Home,
      title: "Installment Tradelines",
      description: "Fixed-payment loans with a set repayment schedule and end date.",
      benefits: [
        "Shows ability to manage fixed obligations",
        "Adds variety to your credit mix",
        "Predictable monthly payments",
        "Builds long-term payment history"
      ],
      example: "Auto loans, personal loans, student loans, mortgages, credit-builder loans.",
      proTip: "Never miss a payment—installment loans heavily impact your payment history. Consider a credit-builder loan if you're starting from scratch; they're designed to help you save while building credit."
    },
    {
      icon: ShoppingBag,
      title: "Retail/Store Tradelines",
      description: "Store-specific credit cards or financing for purchases at particular retailers.",
      benefits: [
        "Easier approval for limited credit",
        "Often offer special financing or discounts",
        "Can help establish credit history",
        "Lower credit limits reduce risk"
      ],
      example: "Store credit cards from retailers like Target, Amazon, or department stores.",
      proTip: "These cards often have higher interest rates. Use them for planned purchases you can pay off immediately, and avoid carrying a balance. They're stepping stones to better credit products."
    },
    {
      icon: AlertCircle,
      title: "Collection Tradelines",
      description: "Negative accounts resulting from unpaid debts sent to collections.",
      benefits: [
        "Understanding helps you avoid them",
        "Can be negotiated or removed",
        "Knowing your rights protects your credit",
        "Dispute errors to remove invalid collections"
      ],
      example: "Unpaid medical bills, utility bills, or credit card debt sent to collection agencies.",
      proTip: "Never ignore collections. Request debt validation, negotiate pay-for-delete agreements, or dispute inaccuracies. Collections can remain on your report for 7 years but have less impact over time."
    },
    {
      icon: CheckCircle2,
      title: "Rental & Utility Tradelines",
      description: "Monthly rent and utility payments reported to credit bureaus through reporting services.",
      benefits: [
        "Turns existing payments into credit history",
        "No new debt required",
        "Helps those with thin credit files",
        "Demonstrates consistent payment ability"
      ],
      example: "Rent payments reported via services like RentTrack or CreditBoost, utility accounts through Experian Boost.",
      proTip: "Use services like Experian Boost (free) to add utility, phone, and streaming service payments to your credit report. These can provide an instant score boost, especially if you have limited credit history."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Types of Tradelines Explained | Complete Guide to Credit Tradelines 2025"
        description="Learn about all types of tradelines: primary, authorized user, business, revolving, installment & more. Expert guide to choosing the right tradelines to boost your credit score fast."
        keywords="types of tradelines, primary tradelines, authorized user tradelines, business credit tradelines, revolving tradelines, installment tradelines, CPN tradelines, credit boosting services, tradeline types explained"
        canonicalUrl="https://cpncreditboost.com/types-of-tradelines"
        schemaData={[breadcrumbs, faqSchema(faqs)]}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Understand Every Type of Tradeline — Build the Credit Profile You Deserve
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Master the different types of tradelines and discover which ones will help you achieve your credit goals faster.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">What Are Tradelines?</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    A <strong className="text-foreground">tradeline</strong> is any account that appears on your credit report. Every credit card, loan, mortgage, or other credit account you have is a tradeline. These accounts tell the story of your financial responsibility and creditworthiness to lenders, employers, and landlords.
                  </p>
                  <p>
                    Each tradeline contains critical information that impacts your credit score: your payment history, credit limit or loan amount, current balance, account age, and whether payments are made on time. The more positive tradelines you have, the stronger your credit profile becomes.
                  </p>
                  <p>
                    Understanding the different types of tradelines is essential for strategic credit building. Whether you're starting from scratch, repairing damaged credit, or optimizing your score for a major purchase, knowing which tradelines to prioritize can accelerate your success and save you thousands in interest over your lifetime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tradeline Types Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              8 Essential Types of Tradelines
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore each tradeline type, understand how it works, and learn expert strategies to maximize your credit-building results.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {tradelineTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="hover:shadow-elegant transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{type.title}</CardTitle>
                        <CardDescription className="text-base">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Key Benefits
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {type.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Real-World Example:</h4>
                      <p className="text-muted-foreground">{type.example}</p>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                        <Zap className="h-5 w-5" />
                        Pro Tip
                      </h4>
                      <p className="text-muted-foreground">{type.proTip}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Build Your Credit Profile?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get professional help setting up tradelines that work for you. Our experts will create a customized credit-building strategy tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="min-h-[48px] text-lg">
              <Link to="/tradelines">Browse Tradelines</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-h-[48px] text-lg border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Get Expert Advice</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Get answers to the most common questions about tradelines and credit building.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-card">
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center p-8 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-4">
                Our credit experts are here to help you understand your options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                <a href="tel:+18555551234" className="text-primary hover:underline font-medium">
                  📞 (855) 555-1234
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="mailto:support@cpncreditboost.com" className="text-primary hover:underline font-medium">
                  ✉️ support@cpncreditboost.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingChat />
    </div>
  );
};

export default TypesOfTradelines;
