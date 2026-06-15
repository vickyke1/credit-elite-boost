import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import SEOHead from "@/components/SEOHead";
import ParticlesBackground from "@/components/ParticlesBackground";
import AuthorizedUserTradelinesSection from "@/components/tradelines/AuthorizedUserTradelinesSection";
import PrimaryTradelinesSection from "@/components/tradelines/PrimaryTradelinesSection";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Building2, Users, KeyRound, ArrowRight } from "lucide-react";
import { faqSchema, breadcrumbSchema } from "@/utils/schemaMarkup";

const faqs = [
  {
    question: "What are authorized user tradelines?",
    answer:
      "Authorized user tradelines are credit accounts that allow an individual to be added to an existing account holder's credit card. Depending on the card issuer's reporting practices, the account's history, age, credit limit, and payment history may appear on the authorized user's credit report. This is educational information only and no specific outcome is guaranteed.",
  },
  {
    question: "What are primary tradelines?",
    answer:
      "Primary tradelines are credit accounts opened and managed directly by the account holder. Payment history, account age, utilization, and account management are reported under the primary account holder's own credit file, which may contribute to long-term credit profile development.",
  },
  {
    question: "What is the difference between authorized user and primary tradelines?",
    answer:
      "With an authorized user tradeline, you are added to an existing account and its history may report on your file, but you are not the account owner. With a primary tradeline, you own and manage the account directly, building personal history with ongoing account management for long-term profile development.",
  },
  {
    question: "Do tradelines guarantee apartment approval?",
    answer:
      "No. Tradelines and credit profile information are educational and may help reflect the overall appearance of a credit profile. Rental approval decisions are made by landlords and property managers based on many factors. No housing, financing, lending outcome, credit score increase, or approval is guaranteed.",
  },
  {
    question: "How long do tradelines take to report?",
    answer:
      "Reporting timelines vary by card issuer and credit bureau policies. Authorized user tradelines may report on a faster timeline, while primary tradelines support long-term development through ongoing account management. Results vary by individual profile and reporting practices.",
  },
];

const ApartmentApprovalGuide = () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://cpncreditboost.com" },
    {
      name: "Apartment Approval Guide",
      url: "https://cpncreditboost.com/apartment-approval-guide",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Apartment Approval Guide | Authorized User & Primary Tradelines Explained"
        description="An educational guide to how authorized user tradelines and primary tradelines may strengthen the overall appearance of a credit profile. Learn the differences, benefits, and key considerations."
        keywords="apartment approval guide, authorized user tradelines, primary tradelines, credit profile, tradelines explained, credit building, rental credit, credit history"
        canonicalUrl="https://cpncreditboost.com/apartment-approval-guide"
        schemaData={[breadcrumbs, faqSchema(faqs)]}
      />

      <Navigation />

      {/* Page Hero with subtle particle background */}
      <section className="relative hero-bg cyber-grid overflow-hidden py-24 sm:py-32">
        <ParticlesBackground />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--glass-border))] bg-card/40 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Apartment Approval Guide
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Understand Tradelines &amp; the{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Credit Profile Behind Apartment Applications
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              An educational guide to how authorized user tradelines and primary
              tradelines may strengthen the overall appearance of a credit
              profile. Explore the concepts clearly and make informed decisions.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent min-h-[52px] text-base font-semibold w-full sm:w-auto"
              >
                <a href="#authorized-user-tradelines">
                  <Users className="mr-2 h-5 w-5" aria-hidden="true" />
                  Authorized User Tradelines
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 min-h-[52px] text-base font-semibold w-full sm:w-auto"
              >
                <a href="#primary-tradelines">
                  <KeyRound className="mr-2 h-5 w-5" aria-hidden="true" />
                  Primary Tradelines
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro / context */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Why Your Credit Profile Matters When Renting
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When reviewing rental applications, many landlords and property
              managers consider the overall appearance of an applicant's credit
              profile, including account history, payment patterns, and credit
              utilization. Understanding how tradelines work can help you make
              informed, responsible decisions about building and maintaining your
              credit. The sections below explain two common approaches —
              authorized user tradelines and primary tradelines — in clear,
              educational terms. This information is provided for educational
              purposes only and does not promise approval or any specific
              outcome.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Authorized User Tradelines */}
      <AuthorizedUserTradelinesSection />

      {/* Section 2: Primary Tradelines */}
      <PrimaryTradelinesSection />

      {/* FAQ */}
      <section className="py-20" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2
                id="faq-heading"
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Clear, educational answers about authorized user and primary
                tradelines.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="glass-card rounded-2xl px-6 border-0"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Keep Learning About Your Credit Options
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore additional educational resources to better understand the
              different types of tradelines and credit-building concepts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent min-h-[52px] text-base font-semibold"
              >
                <Link to="/types-of-tradelines">
                  Explore Tradeline Types
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[52px] text-base font-semibold"
              >
                <Link to="/contact">Get Educational Guidance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingChat />
    </div>
  );
};

export default ApartmentApprovalGuide;
