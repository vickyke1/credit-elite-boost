import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Columns3 } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => (
  <section id="hero" className="relative isolate overflow-hidden bg-background" aria-labelledby="hero-heading">
    <img src={heroBackground} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
    <div className="container px-4 py-12 sm:px-6 md:py-20">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase text-primary">Credit education · Authorized-user tradelines</p>
        <h1 id="hero-heading" className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">CpnCreditBoost</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground">Clear choices for your credit-building journey.</p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">Compare account limits, ages, reporting windows, and prices. Explore credit education and legitimate repair guidance using your real identity.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-12 text-base"><Link to="/tradelines">Browse tradelines <ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline" className="min-h-12 text-base"><Link to="/pricing">Monthly pricing inquiry</Link></Button>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Columns3 className="h-4 w-4 text-primary" /> Side-by-side comparison</span>
          <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-accent" /> Education first</span>
        </div>
      </div>
    </div>
  </section>
);
export default Hero;
