import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import TradelineMarketplace from "@/components/TradelineMarketplace";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import ParticlesBackground from "@/components/ParticlesBackground";
import EmailSignup from "@/components/EmailSignup";
import SEOHead from "@/components/SEOHead";
import { organizationSchema, faqSchema } from "@/utils/schemaMarkup";

const Index = () => {
  const faqs = [
    { question: "Is a CPN legal?", answer: "A CPN (Credit Privacy Number) is completely legal when used properly. It's an alternative to using your SSN for credit applications, originally designed to protect your privacy." },
    { question: "How fast does a tradeline report?", answer: "Our tradelines typically report to your credit report within 7-14 business days after purchase." },
    { question: "Can I get funding with a CPN?", answer: "Yes, many of our clients successfully obtain funding using their CPNs." }
  ];

  return (
    <>
      <SEOHead
        title="CPN Credit Boost - Elite Credit Profiles & Aged Tradelines | Boost Your Credit Fast"
        description="Transform your credit with aged tradelines, clean CPNs & credit boosting kits. Fast delivery, 24/7 support, money-back guarantee. 10,000+ satisfied clients."
        keywords="CPN packages, aged tradelines, credit boost services, credit repair, build credit fast, CPN numbers, authorized user tradelines, credit profile packages, credit restoration"
        canonicalUrl="https://cpncreditboost.com"
        schemaData={[organizationSchema, faqSchema(faqs)]}
      />
      <div className="min-h-screen bg-background relative">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <ParticlesBackground />
        <Navigation />
        <main id="main-content">
          <Hero />
          <WhyChooseUs />
          <TradelineMarketplace />
          <HowItWorks />
          <Testimonials />
          <section className="py-16 px-6">
            <div className="container mx-auto">
              <EmailSignup />
            </div>
          </section>
          <FAQ />
        </main>
        <Footer />
        <FloatingChat />
      </div>
    </>
  );
};

export default Index;
