import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Shield, Zap } from "lucide-react";

const CPNPackagesCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Credit Profile?
            </span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our comprehensive CPN packages designed to give you a fresh financial start. 
            From starter kits to elite funding-ready profiles.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">4 Package Tiers</p>
              <p className="text-xs text-muted-foreground">From $299 to $2,499</p>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Money-Back Guarantee</p>
              <p className="text-xs text-muted-foreground">On all packages</p>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">24-48 hour setup</p>
            </div>
          </div>
          
          {/* CTA Button */}
          <Link to="/cpn-packages">
            <Button 
              size="lg"
              className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent text-lg px-8 py-6 h-auto font-semibold group"
            >
              View CPN Packages
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-6">
            Join 10,000+ clients who've transformed their credit with our packages
          </p>
        </div>
      </div>
    </section>
  );
};

export default CPNPackagesCTA;
