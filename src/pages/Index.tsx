import { Link } from "react-router-dom";
import { ArrowRight, Search, Columns3, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TradelineMarketplace from "@/components/TradelineMarketplace";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import SEOHead from "@/components/SEOHead";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="CpnCreditBoost | Tradelines & Credit Education" description="Compare authorized-user tradeline limits, ages, reporting windows and prices. Request monthly pricing for credit education and legitimate repair guidance." canonicalUrl="https://cpncreditboost.com" />
    <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
    <Navigation />
    <main id="main-content">
      <Hero />
      <TradelineMarketplace />
      <section className="border-y border-border py-10 md:py-16">
        <div className="container px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Make an informed choice</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Search, title: "Explore the inventory", text: "Review bank, credit limit, account age, and purchase price." },
              { icon: Columns3, title: "Compare your options", text: "Check reporting details and compare up to four tradelines." },
              { icon: Send, title: "Ask before deciding", text: "Discuss your goals with CpnCreditBoost on Telegram. Results are not guaranteed." },
            ].map(item => <div key={item.title}><item.icon className="mb-3 h-6 w-6 text-primary" /><h3 className="mb-2 text-lg font-semibold">{item.title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p></div>)}
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container px-4 sm:px-6 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl"><p className="mb-3 text-sm font-semibold text-primary">MONTHLY SUPPORT</p><h2 className="text-2xl font-bold sm:text-3xl">Credit education & repair guidance</h2><p className="mt-3 leading-relaxed text-muted-foreground">Request monthly pricing tailored to your needs. No subscription or payment is created by an inquiry.</p></div>
          <Button asChild size="lg" className="mt-6 min-h-12 w-full sm:w-auto md:mt-0"><Link to="/pricing">Request monthly pricing <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </main>
    <Footer />
    <FloatingChat />
  </div>
);
export default Index;
