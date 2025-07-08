import Navigation from "@/components/Navigation";
import { TradelineCalculator } from "@/components/tools/TradelineCalculator";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const TradelineCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8">
        <TradelineCalculator />
      </div>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default TradelineCalculatorPage;