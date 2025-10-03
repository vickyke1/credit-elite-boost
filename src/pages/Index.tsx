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
      <PopularPackages />
      <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Index;
