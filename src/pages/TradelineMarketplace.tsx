import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import ExtensiveTradelineMarketplace from "@/components/ExtensiveTradelineMarketplace";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const TradelineMarketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Tradeline Inventory & Prices | CpnCreditBoost" description="Compare authorized-user tradelines by bank, USD price, credit limit, age and reporting window." canonicalUrl="https://cpncreditboost.com/tradelines" />
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      <Navigation />
      <main id="main-content"><ExtensiveTradelineMarketplace /></main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default TradelineMarketplace;