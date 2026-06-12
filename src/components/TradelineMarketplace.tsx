import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { BankCardMockup } from "@/components/BankCardMockup";

const TradelineMarketplace = () => {
  const { addToCart } = useCart();
  const tradelines = [
    {
      issuer: "Chase Sapphire",
      bank: "Chase",
      limit: "$25,000",
      age: "8 years",
      price: "$899",
      badge: "Popular",
      badgeVariant: "default" as const
    },
    {
      issuer: "American Express Gold",
      bank: "American Express",
      limit: "$15,000",
      age: "5 years",
      price: "$649",
      badge: "Best Value",
      badgeVariant: "secondary" as const
    },
    {
      issuer: "Capital One Venture",
      bank: "Capital One",
      limit: "$20,000",
      age: "6 years",
      price: "$749",
      badge: "",
      badgeVariant: "outline" as const
    },
    {
      issuer: "Citi Double Cash",
      bank: "Citi",
      limit: "$18,000",
      age: "7 years",
      price: "$799",
      badge: "High Limit",
      badgeVariant: "outline" as const
    },
    {
      issuer: "Bank of America",
      bank: "Bank of America",
      limit: "$12,000",
      age: "4 years",
      price: "$549",
      badge: "",
      badgeVariant: "outline" as const
    },
    {
      issuer: "Wells Fargo Platinum",
      bank: "Wells Fargo",
      limit: "$30,000",
      age: "10 years",
      price: "$1,199",
      badge: "Premium",
      badgeVariant: "destructive" as const
    }
  ];

  return (
    <section id="tradelines" className="py-20 bg-surface-elevated">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Tradeline Marketplace
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our premium selection of aged tradelines from top-tier financial institutions.
            All tradelines are verified and report within 7-14 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tradelines.map((tradeline, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary group flex flex-col"
            >
              {/* Matching bank card mockup */}
              <BankCardMockup bankName={tradeline.bank} className="mb-5" />

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {tradeline.issuer}
                </h3>
                {tradeline.badge && (
                  <Badge variant={tradeline.badgeVariant} className="text-xs">
                    {tradeline.badge}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit Limit:</span>
                  <span className="font-semibold text-accent">{tradeline.limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Age:</span>
                  <span className="font-semibold text-primary">{tradeline.age}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="text-2xl font-bold text-foreground">{tradeline.price}</span>
                </div>
              </div>
              
              <Button
                className="w-full mt-auto bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent font-semibold"
                size="lg"
                onClick={() => {
                  addToCart({
                    id: `tradeline-${tradeline.issuer}`,
                    type: "tradeline",
                    name: tradeline.issuer,
                    price: parseInt(tradeline.price.replace(/[$,]/g, ""), 10),
                    bankName: tradeline.issuer,
                    creditLimit: parseInt(tradeline.limit.replace(/[$,]/g, ""), 10),
                    age: tradeline.age,
                  });
                  toast({
                    title: "Added to Cart",
                    description: `${tradeline.issuer} tradeline has been added to your cart.`,
                  });
                }}
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground glow-primary"
          >
            <Link to="/tradelines">View All Tradelines</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TradelineMarketplace;