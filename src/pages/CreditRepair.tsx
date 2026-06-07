import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CreditRepair = () => {
  const services = [
    {
      title: "Credit Analysis & Audit",
      price: "$97",
      timeline: "1-2 weeks",
      features: [
        "Complete credit report review",
        "Error identification & analysis",
        "Negative item assessment", 
        "Improvement strategy development"
      ],
      description: "Comprehensive analysis of your credit reports to identify improvement opportunities."
    },
    {
      title: "Dispute & Removal Service",
      price: "$397/month",
      timeline: "3-6 months",
      features: [
        "Professional dispute letters",
        "Bureau correspondence management",
        "Creditor negotiations",
        "Monthly progress reports"
      ],
      description: "Active dispute process to remove inaccurate, outdated, or unverifiable items."
    },
    {
      title: "Credit Building Program",
      price: "$197/month", 
      timeline: "6-12 months",
      features: [
        "Secured credit card guidance",
        "Credit builder loans",
        "Payment history optimization",
        "Credit utilization management"
      ],
      description: "Structured program to build positive credit history and improve scores."
    },
    {
      title: "Full Service Package",
      price: "$597/month",
      timeline: "12+ months",
      features: [
        "Complete credit repair process",
        "Credit building strategies",
        "Monthly consultations",
        "24/7 client portal access",
        "Credit monitoring & alerts"
      ],
      description: "Comprehensive service combining repair, building, and ongoing optimization."
    }
  ];

  const repairProcess = [
    {
      step: 1,
      title: "Credit Audit",
      description: "Detailed analysis of all three credit reports"
    },
    {
      step: 2,
      title: "Dispute Strategy",
      description: "Custom strategy for challenging negative items"
    },
    {
      step: 3,
      title: "Bureau Disputes",
      description: "Professional dispute letters to credit bureaus"
    },
    {
      step: 4,
      title: "Creditor Negotiations",
      description: "Direct negotiations with creditors and collectors"
    },
    {
      step: 5,
      title: "Progress Monitoring",
      description: "Track deletions and score improvements"
    },
    {
      step: 6,
      title: "Score Optimization",
      description: "Fine-tune factors for maximum score increase"
    }
  ];

  const commonIssues = [
    {
      issue: "Late Payments",
      solution: "Goodwill letters and payment history rehabilitation",
      success: "85% removal rate"
    },
    {
      issue: "Collections",
      solution: "Validation disputes and pay-for-delete negotiations",
      success: "78% removal rate"
    },
    {
      issue: "Charge-offs",
      solution: "Legal disputes and creditor negotiations",
      success: "72% removal rate"
    },
    {
      issue: "Bankruptcies",
      solution: "Technical disputes and early removal strategies",
      success: "45% improvement rate"
    },
    {
      issue: "Inquiries",
      solution: "Unauthorized inquiry disputes",
      success: "90% removal rate"
    },
    {
      issue: "Identity Errors",
      solution: "Identity verification and correction processes",
      success: "95% correction rate"
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
                Professional Credit Repair
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Professional credit repair services to dispute inaccuracies, remove negative items, 
                and optimize your credit reports across all bureaus.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Credit Repair Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div key={index} className="bg-surface-elevated border border-border p-8 rounded-lg hover:shadow-elegant transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>💰 {service.price}</span>
                        <span>⏱️ {service.timeline}</span>
                      </div>
                    </div>
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
                  
                  <Button asChild className="w-full">
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Issues We Can Help Remove
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {commonIssues.map((item, index) => (
                <div key={index} className="bg-background border border-border p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.issue}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.solution}</p>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-semibold">
                    {item.success}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Credit Repair Process
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {repairProcess.map((item, index) => (
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

        {/* Results */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Proven Results
            </h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">73%</div>
                <p className="text-muted-foreground">Average Removal Rate</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">127</div>
                <p className="text-muted-foreground">Average Score Increase</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">45</div>
                <p className="text-muted-foreground">Average Days to Results</p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="bg-surface-elevated border-l-4 border-primary p-8 rounded-lg max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Legal & Compliant Credit Repair
              </h3>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Our credit repair services comply with all federal and state regulations, 
                  including the Credit Repair Organizations Act (CROA) and Fair Credit Reporting Act (FCRA).
                </p>
                <p>
                  We only dispute items that are inaccurate, unverifiable, or outdated according to law. 
                  Results are not guaranteed and vary by individual case.
                </p>
                <p>
                  You have the right to dispute items yourself at no cost. We provide professional 
                  expertise and proven strategies to maximize your success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Repair Your Credit?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your credit repair journey today with a free consultation and credit analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <Link to="/contact">Free Credit Analysis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3">
                <Link to="/live-chat">Speak to Expert</Link>
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

export default CreditRepair;