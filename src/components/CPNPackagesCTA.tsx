import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Shield, Zap, Users, TrendingUp, Award } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

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
            Ready to Build a Stronger{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Credit Profile?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our curated marketplace of premium authorized-user tradelines —
            from starter listings to seasoned, high-limit accounts. Transparent details, secure checkout, honest guidance.
          </p>
          
          {/* Animated Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  <AnimatedCounter end={10000} suffix="+" />
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Members Served</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <p className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  <AnimatedCounter end={4.9} suffix="/5" decimals={1} />
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <p className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  <AnimatedCounter end={100} suffix="%" decimals={0} />
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Posting Guarantee</p>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Curated Inventory</p>
              <p className="text-xs text-muted-foreground">Seasoned, vetted tradelines</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Posting Guarantee</p>
              <p className="text-xs text-muted-foreground">On every listing</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Full Transparency</p>
              <p className="text-xs text-muted-foreground">Details shown up front</p>
            </div>
          </div>
          
          {/* CTA Button */}
          <Link to="/cpn-packages">
            <Button 
              size="lg"
              className="bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent text-lg px-8 py-6 h-auto font-semibold group"
            >
              Browse Tradelines Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-6">
            Join 10,000+ members who chose the transparent, secure way to build credit
          </p>

          <p className="text-xs text-muted-foreground/80 mt-6 max-w-2xl mx-auto">
            Credit Elite Boost provides authorized-user tradeline services as one component of a
            personal credit-building strategy. We do not guarantee specific credit-score results,
            loan approvals, or removal of accurate information from your credit report. Results vary by individual.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CPNPackagesCTA;
