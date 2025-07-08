import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/Cart";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CPN Credit Boost
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors animated-underline">Home</a>
            <a href="/tradelines" className="text-foreground hover:text-primary transition-colors animated-underline">Buy Tradelines</a>
            <a href="/calculator" className="text-foreground hover:text-primary transition-colors animated-underline">Calculator</a>
            <a href="/ssn-validator" className="text-foreground hover:text-primary transition-colors animated-underline">SSN Validator</a>
            <a href="/#packages" className="text-foreground hover:text-primary transition-colors animated-underline">CPN Packages</a>
            <a href="/#faq" className="text-foreground hover:text-primary transition-colors animated-underline">FAQ</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors animated-underline">Contact</a>
          </div>
          
          {/* Cart and Login */}
          <div className="flex items-center gap-4">
            <Cart />
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Client Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;