import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";

const BusinessCredit = () => {
  const services = [
    {
      title: "Business Formation & EIN",
      price: "Starting at $197",
      features: [
        "LLC or Corporation setup",
        "Federal EIN registration", 
        "Business bank account guidance",
        "Legal compliance documentation"
      ],
      description: "Establish your business entity with proper legal structure."
    },
    {
      title: "Business Credit Profile",
      price: "Starting at $397",
      features: [
        "D-U-N-S number acquisition",
        "Business credit report setup",
        "Vendor account establishment",
        "Credit monitoring dashboard"
      ],
      description: "Build your business credit foundation with proper reporting."
    },
    {
      title: "Tier 1 Vendor Accounts",
      price: "Starting at $297",
      features: [
        "5 Tier 1 vendor accounts",
        "Net 30 payment terms",
        "Credit bureau reporting",
        "Account management support"
      ],
      description: "Establish credit with vendors that report to business bureaus."
    },
    {
      title: "Business Credit Lines",
      price: "Starting at $597",
      features: [
        "Secured business credit cards",
        "Business line of credit applications",
        "Equipment financing guidance",
        "Credit optimization strategies"
      ],
      description: "Secure business financing and credit lines for growth."
    }
  ];

  const benefits = [
    {
      title: "Separate Personal & Business Credit",
      description: "Protect your personal credit from business liabilities and build distinct credit profiles.",
      icon: "🏢"
    },
    {
      title: "Access Business Funding",
      description: "Qualify for business loans, credit lines, and equipment financing for growth.",
      icon: "💰"
    },
    {
      title: "Better Terms & Rates",
      description: "Established business credit leads to better financing terms and lower interest rates.",
      icon: "📈"
    },
    {
      title: "Build Company Value", 
      description: "Strong business credit increases your company's overall value and credibility.",
      icon: "💎"
    }
  ];

  const process = [
    {
      step: 1,
      title: "Business Formation",
      description: "Establish legal business entity and obtain EIN"
    },
    {
      step: 2,
      title: "Credit Foundation",
      description: "Set up D-U-N-S number and business credit reports"
    },
    {
      step: 3,
      title: "Vendor Accounts",
      description: "Establish relationships with reporting vendors"
    },
    {
      step: 4,
      title: "Credit Building",
      description: "Make timely payments and build credit history"
    },
    {
      step: 5,
      title: "Credit Lines",
      description: "Apply for business credit cards and lines of credit"
    },
    {
      step: 6,
      title: "Growth Financing",
      description: "Qualify for larger loans and equipment financing"
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
                Business Credit Solutions
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Establish and build business credit lines separate from personal credit to grow 
                your company and protect your personal assets.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Why Build Business Credit?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Business Credit Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div key={index} className="bg-background border border-border p-8 rounded-lg hover:shadow-elegant transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                    <span className="text-lg font-semibold text-primary">{service.price}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full">
                    Get Started
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
              Business Credit Building Process
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {process.map((item, index) => (
                <div key={index} className="bg-surface-elevated p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xl text-primary-foreground font-bold">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How long does it take to establish business credit?
                </h3>
                <p className="text-muted-foreground">
                  Building business credit typically takes 3-6 months to establish a foundation, 
                  with significant improvement seen within 6-12 months of consistent activity.
                </p>
              </div>
              
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Can I build business credit without personal guarantees?
                </h3>
                <p className="text-muted-foreground">
                  Yes, once your business credit is established, you can qualify for credit lines 
                  that don't require personal guarantees, protecting your personal assets.
                </p>
              </div>
              
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What's the difference between business and personal credit?
                </h3>
                <p className="text-muted-foreground">
                  Business credit is tied to your EIN and business entity, while personal credit 
                  is tied to your SSN. They're reported to different bureaus and have different scoring models.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Build Business Credit?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start establishing your business credit profile today and unlock opportunities 
              for growth and financing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-3">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Free Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default BusinessCredit;