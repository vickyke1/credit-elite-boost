import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/Cart";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/tradelines", label: "Buy Tradelines" },
  { to: "/sell-tradelines", label: "Sell Tradelines" },
  { to: "/types-of-tradelines", label: "Tradeline Types" },
  { to: "/apartment-approval-guide", label: "Apartment Guide" },
  { to: "/calculator", label: "Calculator" },
  { to: "/cpn-packages", label: "CPN Packages" },
  { to: "/contact", label: "Contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(globalThis.scrollY > 40);
    };
    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-[hsl(var(--glass-border))] shadow-elevated"
          : "bg-background/30 backdrop-blur-md border-b border-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold hover:opacity-90 transition-opacity"
            aria-label="CPN Credit Boost - Home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-cta text-accent-foreground font-extrabold shadow-[0_0_18px_-2px_hsl(var(--glow-primary)/0.6)]">
              C
            </span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">CPN Credit Boost</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 rounded-2xl border border-[hsl(var(--glass-border))] bg-card/40 px-2 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3),0_0_16px_-4px_hsl(var(--glow-primary)/0.6)]"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
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
                <nav className="flex flex-col space-y-2" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`rounded-xl px-4 py-3 text-lg font-medium transition-all ${
                        isActive(link.to)
                          ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                          : "text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="pt-6 mt-4 border-t border-border space-y-4">
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