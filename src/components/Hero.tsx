import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg cyber-grid overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Boost Your Credit Score with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent pulse-glow">
              Elite Credit Profiles
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium Aged Tradelines, Clean CPN Numbers & Credit Repair Kits. Fast 24-48 Hour Delivery with Money-Back Guarantee.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent text-lg px-8 py-6 h-auto font-semibold"
            >
              Get Started
            </Button>
            <Link to="/tradelines">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8 py-6 h-auto font-semibold glow-primary"
              >
                View Tradelines
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg"
              className="hover:scale-105 transition-transform duration-300 text-lg px-8 py-6 h-auto font-semibold"
            >
              Learn About CPNs
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              SSL Secured
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              24/7 Support
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              Money-Back Guarantee
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-primary/30 rounded-lg float-animation"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 border border-accent/30 rounded-full float-animation" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 border border-primary/20 rounded-full float-animation" style={{ animationDelay: "2s" }}></div>
    </section>
  );
};

export default Hero;