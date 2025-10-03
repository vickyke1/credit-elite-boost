import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/Cart";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav 
      className={`relative z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            aria-label="CPN Credit Boost - Home"
          >
            CPN Credit Boost
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors animated-underline">Home</Link>
            <Link to="/tradelines" className="text-foreground hover:text-primary transition-colors animated-underline">Buy Tradelines</Link>
            <Link to="/calculator" className="text-foreground hover:text-primary transition-colors animated-underline">Calculator</Link>
            <Link to="/ssn-validator" className="text-foreground hover:text-primary transition-colors animated-underline">SSN Validator</Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors animated-underline">Blog</Link>
            <a href="#packages" className="text-foreground hover:text-primary transition-colors animated-underline">CPN Packages</a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors animated-underline">FAQ</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors animated-underline">Contact</a>
          </div>
          
          {/* Desktop Cart and Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <Cart />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>Welcome back!</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px]"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px]" 
                asChild
              >
                <Link to="/login">Client Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Cart />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="Open mobile menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
                  Menu
                </SheetTitle>
                <nav className="flex flex-col space-y-6" aria-label="Mobile navigation">
                  <Link 
                    to="/" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/tradelines" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buy Tradelines
                  </Link>
                  <Link 
                    to="/calculator" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Calculator
                  </Link>
                  <Link 
                    to="/ssn-validator" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    SSN Validator
                  </Link>
                  <Link 
                    to="/blog" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <a 
                    href="#packages" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CPN Packages
                  </a>
                  <a 
                    href="#faq" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </a>
                  <a 
                    href="#contact" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                  
                  <div className="pt-6 border-t border-border space-y-4">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" aria-hidden="true" />
                          <span>Welcome back!</span>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px]"
                        >
                          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px]" 
                        asChild
                      >
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Client Login</Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;