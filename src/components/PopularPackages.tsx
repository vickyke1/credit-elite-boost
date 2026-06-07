import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const PopularPackages = () => {
  const { addToCart } = useCart();
  const packages = [
    {
      name: "Basic CPN Kit",
      price: "$299",
      originalPrice: "$399",
      badge: "Starter",
      badgeVariant: "secondary" as const,
      description: "Perfect for beginners looking to establish a new credit profile",
      features: [
        "1 Clean CPN Number",
        "Basic Setup Guide", 
        "Phone & Email Support",
        "Money-Back Guarantee",
        "Legal Documentation"
      ],
      popular: false
    },
    {
      name: "Credit Boost Combo",
      price: "$799",
      originalPrice: "$999",
      badge: "Most Popular",
      badgeVariant: "default" as const,
      description: "Our best-selling package combining CPNs with aged tradelines",
      features: [
        "1 Premium CPN Number",
        "2 Aged Tradelines ($15K+ Limits)",
        "Complete Setup & Coaching",
        "Priority 24/7 Support",
        "Credit Monitoring Tools",
        "90-Day Guarantee"
      ],
      popular: true
    },
    {
      name: "Business Builder Package",
      price: "$1,299",
      originalPrice: "$1,599",
      badge: "Business",
      badgeVariant: "outline" as const,
      description: "Comprehensive business credit profile for serious entrepreneurs",
      features: [
        "2 CPN Numbers (Personal + Business)",
        "4 Premium Tradelines ($20K+ Limits)",
        "Business Credit Profile Setup",
        "Funding Strategy Consultation",
        "Dedicated Account Manager",
        "Lifetime Support"
      ],
      popular: false
    },
    {
      name: "Funding-Ready Elite Profile", 
      price: "$2,499",
      originalPrice: "$2,999",
      badge: "Elite",
      badgeVariant: "destructive" as const,
      description: "Our premium package for high-net-worth individuals seeking funding",
      features: [
        "3 Premium CPN Numbers",
        "8 High-Limit Tradelines ($30K+ Each)",
        "Complete Credit Ecosystem",
        "Personal Credit Consultant",
        "Funding Application Assistance",
        "VIP Concierge Service"
      ],
      popular: false
    }
  ];

  return (
    <section id="packages" className="py-20 bg-surface-elevated">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Popular Packages
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect credit enhancement package for your financial goals. 
            All packages include our signature guarantee and expert support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`relative bg-card rounded-2xl p-6 border transition-all duration-300 hover:scale-105 group ${
                pkg.popular 
                  ? 'border-primary shadow-glow-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-cta text-accent-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {/* Package Badge */}
              <div className="flex justify-between items-start mb-4">
                <Badge variant={pkg.badgeVariant}>{pkg.badge}</Badge>
              </div>
              
              {/* Package Name */}
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {pkg.name}
              </h3>
              
              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                  <span className="text-lg text-muted-foreground line-through">{pkg.originalPrice}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {pkg.description}
              </p>
              
              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA Button */}
              <Button 
                className={`w-full font-semibold transition-transform duration-300 hover:scale-105 ${
                  pkg.popular 
                    ? 'bg-gradient-cta glow-accent' 
                    : 'bg-gradient-primary glow-primary'
                }`}
                size="lg"
                onClick={() => {
                  const packageItem = {
                    id: `package-${index}`,
                    type: 'package' as const,
                    name: pkg.name,
                    price: parseInt(pkg.price.replace('$', '').replace(',', '')),
                    description: pkg.description,
                    features: pkg.features
                  };
                  addToCart(packageItem);
                  toast({
                    title: "Added to Cart",
                    description: `${pkg.name} has been added to your cart.`,
                  });
                }}
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom package? Our experts can create a solution tailored to your specific needs.
          </p>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/contact">Request Custom Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;