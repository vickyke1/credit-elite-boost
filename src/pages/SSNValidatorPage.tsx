import Navigation from "@/components/Navigation";
import { SSNValidator } from "@/components/tools/SSNValidator";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const SSNValidatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8">
        <SSNValidator />
      </div>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default SSNValidatorPage;