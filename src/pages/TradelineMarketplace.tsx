import Navigation from "@/components/Navigation";
import ExtensiveTradelineMarketplace from "@/components/ExtensiveTradelineMarketplace";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const TradelineMarketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ExtensiveTradelineMarketplace />
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default TradelineMarketplace;