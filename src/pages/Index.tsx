import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import TradelineMarketplace from "@/components/TradelineMarketplace";
import HowItWorks from "@/components/HowItWorks";
import PopularPackages from "@/components/PopularPackages";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import ParticlesBackground from "@/components/ParticlesBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      <Navigation />
      <Hero />
      <WhyChooseUs />
      <TradelineMarketplace />
      <HowItWorks />
      <PopularPackages />
      <Testimonials />
      <FAQ />
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Index;
