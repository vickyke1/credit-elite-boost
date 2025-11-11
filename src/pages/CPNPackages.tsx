import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { productSchema, breadcrumbSchema } from "@/utils/schemaMarkup";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const CPNPackages = () => {
  const packages = [
    {
      name: "Foundation Builder",
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
      description: "Establish your credit foundation with essential tools and guidance for long-term financial success."
    },
    {
      name: "Credit Accelerator",
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
      description: "Rapidly build strong credit with multiple tradelines and dedicated support from our expert team."
    },
    {
      name: "Elite Credit Suite",
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
      description: "Maximum credit-building power with premium tradelines, white-glove service, and personalized strategy."
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
    <>
      <SEOHead
        title="CPN Packages - Complete Credit Building Solutions | CPN Credit Boost"
        description="Choose from our comprehensive CPN packages including fresh CPN numbers, aged tradelines, credit monitoring, and expert support. Starter, Professional, and Premium options available."
        keywords="CPN packages, credit privacy number packages, CPN with tradelines, credit building packages, aged tradeline packages, CPN services"
        canonicalUrl="https://cpncreditboost.com/cpn-packages"
        ogType="website"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home", url: "https://cpncreditboost.com" },
              { name: "CPN Packages", url: "https://cpncreditboost.com/cpn-packages" }
            ]),
            ...packages.map(pkg => productSchema({
              name: pkg.name,
              description: pkg.description,
              price: pkg.price.replace('$', ''),
              rating: 4.8,
              reviewCount: 127
            }))
          ]
        }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>CPN Packages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <header className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Complete CPN Packages with Aged Tradelines
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Choose from our comprehensive CPN packages including fresh CPN numbers, premium aged tradelines, 
                credit monitoring, and expert support to build strong credit profiles fast.
              </p>
            </div>
          </div>
        </header>

        {/* Package Grid */}
        <section className="py-16" aria-labelledby="packages-heading">
          <div className="container mx-auto px-6">
            <h2 id="packages-heading" className="sr-only">Available CPN Packages</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <article key={index} className={`relative bg-surface-elevated border rounded-lg p-8 hover:shadow-elegant transition-all duration-300 ${
                  pkg.popular ? 'border-primary shadow-glow' : 'border-border'
                }`} itemScope itemType="https://schema.org/Product">
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2" itemProp="name">{pkg.name}</h3>
                    <div className="text-4xl font-bold text-primary mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <span itemProp="price" content={pkg.price.replace('$', '')}>{pkg.price}</span>
                      <meta itemProp="priceCurrency" content="USD" />
                    </div>
                    <p className="text-muted-foreground text-sm" itemProp="description">{pkg.description}</p>
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
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-surface-elevated" aria-labelledby="comparison-heading">
          <div className="container mx-auto px-6">
            <h2 id="comparison-heading" className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Package Comparison
            </h2>
            <div className="relative overflow-x-auto shadow-md rounded-lg border border-border">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full bg-background">
                  <thead className="sticky top-0 z-10 bg-surface-elevated shadow-sm">
                    <tr className="border-b border-border">
                      <th className="sticky left-0 z-20 p-4 text-left text-foreground font-semibold bg-surface-elevated shadow-sm min-w-[200px]">Features</th>
                    {packages.map((pkg, index) => (
                      <th key={index} className={`p-4 text-center min-w-[180px] ${pkg.popular ? 'bg-primary/10' : 'bg-surface-elevated'}`}>
                        <div className="font-bold text-foreground mb-1">{pkg.name}</div>
                        <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                        {pkg.popular && (
                          <div className="mt-2">
                            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              Popular
                            </span>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">CPN Number</td>
                    <td className="p-4 text-center">
                      <span className="text-primary text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <span className="text-primary text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-primary text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Aged Tradelines</td>
                    <td className="p-4 text-center text-foreground">1 (2+ years)</td>
                    <td className="p-4 text-center bg-primary/5 text-foreground">3 (3+ years)</td>
                    <td className="p-4 text-center text-foreground">5 (5+ years)</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Setup Guide</td>
                    <td className="p-4 text-center text-foreground">Basic</td>
                    <td className="p-4 text-center bg-primary/5 text-foreground">Comprehensive</td>
                    <td className="p-4 text-center text-foreground">VIP Consultation</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Credit Monitoring</td>
                    <td className="p-4 text-center">
                      <span className="text-primary text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <span className="text-primary text-xl">✓</span>
                      <div className="text-xs text-muted-foreground mt-1">+ Alerts</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-primary text-xl">✓</span>
                      <div className="text-xs text-muted-foreground mt-1">24/7 Access</div>
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Support Level</td>
                    <td className="p-4 text-center text-foreground">Email</td>
                    <td className="p-4 text-center bg-primary/5 text-foreground">Priority Phone</td>
                    <td className="p-4 text-center text-foreground">Account Manager</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Documentation</td>
                    <td className="p-4 text-center text-foreground">Basic</td>
                    <td className="p-4 text-center bg-primary/5 text-foreground">Complete Kit</td>
                    <td className="p-4 text-center text-foreground">Legal + Complete</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Follow-up Support</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center bg-primary/5 text-foreground">30 Days</td>
                    <td className="p-4 text-center text-foreground">90 Days</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Score Tracking Tools</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center bg-primary/5">
                      <span className="text-primary text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-primary text-xl">✓</span>
                      <div className="text-xs text-muted-foreground mt-1">Advanced</div>
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 text-muted-foreground font-medium bg-background">Strategy Sessions</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center bg-primary/5 text-muted-foreground">—</td>
                    <td className="p-4 text-center">
                      <span className="text-primary text-xl">✓</span>
                      <div className="text-xs text-muted-foreground mt-1">Monthly</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="sticky left-0 z-10 p-4 bg-background"></td>
                    <td className="p-4 text-center">
                      <Button variant="outline" className="w-full">
                        Get Started
                      </Button>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </td>
                    <td className="p-4 text-center">
                      <Button variant="outline" className="w-full">
                        Get Started
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
              <div className="block md:hidden text-center text-xs text-muted-foreground py-2 bg-background border-t border-border">
                <span>← Scroll horizontally to view all packages →</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              All packages include secure processing, legal compliance verification, and quality guarantee
            </p>
          </div>
        </section>

        <section className="py-16 bg-surface-elevated" aria-labelledby="addons-heading">
          <div className="container mx-auto px-6">
            <h2 id="addons-heading" className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Optional Add-Ons to Enhance Your Package
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
        <section className="py-16" aria-labelledby="process-heading">
          <div className="container mx-auto px-6">
            <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              How Our CPN Package Process Works
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
        <section className="py-16 bg-surface-elevated" aria-labelledby="guarantees-heading">
          <div className="container mx-auto px-6">
            <h2 id="guarantees-heading" className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Service Guarantees
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
    </>
  );
};

export default CPNPackages;