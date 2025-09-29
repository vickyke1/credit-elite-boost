import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";

const CPNPackages = () => {
  const packages = [
    {
      name: "Starter Package",
      price: "$297",
      popular: false,
      features: [
        "Fresh CPN Number",
        "Initial Credit Setup Guide",
        "1 Aged Tradeline (2+ years)",
        "Credit Monitoring Access",
        "Email Support",
        "Basic Documentation",
        "Setup Instructions"
      ],
      description: "Perfect for beginners looking to start building credit with a CPN."
    },
    {
      name: "Professional Package",
      price: "$597",
      popular: true,
      features: [
        "Fresh CPN Number",
        "Comprehensive Setup Guide",
        "3 Aged Tradelines (3+ years)",
        "Credit Monitoring & Alerts",
        "Priority Phone Support",
        "Complete Documentation Kit",
        "30-Day Follow-up Support",
        "Score Tracking Tools"
      ],
      description: "Most popular choice for serious credit building with multiple tradelines."
    },
    {
      name: "Premium Package",
      price: "$997",
      popular: false,
      features: [
        "Fresh CPN Number",
        "VIP Setup & Consultation",
        "5 Premium Aged Tradelines (5+ years)",
        "24/7 Credit Monitoring",
        "Dedicated Account Manager",
        "Complete Legal Documentation",
        "90-Day Success Support",
        "Advanced Score Optimization",
        "Monthly Strategy Sessions"
      ],
      description: "Ultimate package for maximum credit building potential and personalized service."
    }
  ];

  const addOns = [
    {
      name: "Additional Tradeline",
      price: "$149",
      description: "Add extra aged tradelines to boost your credit profile"
    },
    {
      name: "Expedited Processing",
      price: "$97", 
      description: "Rush processing for faster delivery (24-48 hours)"
    },
    {
      name: "Extended Support",
      price: "$197",
      description: "Additional 6 months of dedicated support and guidance"
    },
    {
      name: "Business Credit Setup",
      price: "$297",
      description: "Complete business credit profile establishment"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Complete CPN Packages
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Complete CPN packages with aged tradelines, credit monitoring, and step-by-step 
                guidance for building strong credit profiles.
              </p>
            </div>
          </div>
        </section>

        {/* Package Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <div key={index} className={`relative bg-surface-elevated border rounded-lg p-8 hover:shadow-elegant transition-all duration-300 ${
                  pkg.popular ? 'border-primary shadow-glow' : 'border-border'
                }`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-bold text-primary mb-3">{pkg.price}</div>
                    <p className="text-muted-foreground text-sm">{pkg.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-primary hover:bg-primary/90' : 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-Ons */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Optional Add-Ons
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-background border border-border p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{addon.name}</h3>
                    <span className="text-xl font-bold text-primary">{addon.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{addon.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Add to Package
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground font-bold">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Choose Package</h3>
                <p className="text-sm text-muted-foreground">Select the package that best fits your credit goals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground font-bold">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure Processing</h3>
                <p className="text-sm text-muted-foreground">Complete secure order and verification process</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground font-bold">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Setup & Delivery</h3>
                <p className="text-sm text-muted-foreground">Receive your CPN and tradelines with setup guide</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground font-bold">4</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Build Credit</h3>
                <p className="text-sm text-muted-foreground">Follow guidance to establish strong credit history</p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Guarantees
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Legal Compliance</h3>
                <p className="text-muted-foreground">
                  All our services comply with FCRA regulations and federal laws.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Secure Process</h3>
                <p className="text-muted-foreground">
                  Bank-level encryption and security for all transactions and data.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Quality Tradelines</h3>
                <p className="text-muted-foreground">
                  Only premium aged tradelines from reputable financial institutions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default CPNPackages;