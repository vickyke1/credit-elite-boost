import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center hero-bg cyber-grid overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 
            id="hero-heading" 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            Boost Your Credit Score with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent pulse-glow">
              Elite Credit Profiles
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Premium Aged Tradelines, Clean CPN Numbers & Credit Repair Kits. Fast 24-48 Hour Delivery with Money-Back Guarantee.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 px-4">
            <Link to="/tradelines" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto font-semibold min-h-[56px] w-full"
                aria-label="Get started with credit boost services"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/tradelines" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto font-semibold glow-primary min-h-[56px] w-full"
                aria-label="Browse available tradelines"
              >
                View Tradelines
              </Button>
            </Link>
            <Link to="/cpn-packages" className="w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="lg"
                className="hover:scale-105 transition-transform duration-300 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto font-semibold min-h-[56px] w-full"
                aria-label="Learn about CPN numbers"
              >
                Learn About CPNs
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div 
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground px-4"
            role="list"
            aria-label="Trust indicators"
          >
            <div className="flex items-center gap-2" role="listitem">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" aria-hidden="true"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" aria-hidden="true"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" aria-hidden="true"></div>
              <span>Money-Back Guarantee</span>
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