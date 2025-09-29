import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const Compliance = () => {
  const regulations = [
    {
      title: "Fair Credit Reporting Act (FCRA)",
      description: "Federal law governing the collection, dissemination, and use of consumer information",
      compliance: [
        "Accurate reporting of credit information",
        "Proper dispute handling procedures",
        "Consumer rights notification",
        "Data security and privacy protection"
      ]
    },
    {
      title: "Credit Repair Organizations Act (CROA)",
      description: "Federal regulations for companies providing credit repair services",
      compliance: [
        "Written contracts and disclosures",
        "3-day cancellation right",
        "Prohibited practices avoidance",
        "Clear fee structures"
      ]
    },
    {
      title: "Fair Debt Collection Practices Act (FDCPA)",
      description: "Protections against abusive debt collection practices",
      compliance: [
        "Respectful communication practices",
        "Accurate debt information",
        "Consumer rights protection",
        "Professional conduct standards"
      ]
    },
    {
      title: "State Credit Services Laws",
      description: "State-specific regulations for credit enhancement services",
      compliance: [
        "Proper licensing and bonding",
        "State-required disclosures",
        "Compliance with local laws",
        "Regular regulatory updates"
      ]
    }
  ];

  const certifications = [
    {
      title: "Licensed & Bonded",
      description: "Properly licensed in all operating jurisdictions with surety bonds for client protection",
      icon: "🏛️"
    },
    {
      title: "BBB A+ Rated",
      description: "Better Business Bureau accreditation with highest rating for ethical business practices",
      icon: "⭐"
    },
    {
      title: "Industry Certified",
      description: "Staff certified by leading credit industry organizations and continuing education programs",
      icon: "🎓"
    },
    {
      title: "Privacy Compliant",
      description: "Full compliance with federal and state privacy laws including CCPA and GDPR standards",
      icon: "🔒"
    }
  ];

  const auditResults = [
    {
      category: "Data Security",
      score: "98%",
      status: "Excellent",
      lastAudit: "February 2024"
    },
    {
      category: "Regulatory Compliance",
      score: "96%", 
      status: "Excellent",
      lastAudit: "January 2024"
    },
    {
      category: "Client Protection",
      score: "99%",
      status: "Excellent", 
      lastAudit: "March 2024"
    },
    {
      category: "Documentation Standards",
      score: "97%",
      status: "Excellent",
      lastAudit: "February 2024"
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
                Regulatory Compliance
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our commitment to legal compliance with FCRA, state regulations, and industry 
                standards for credit enhancement services.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance Overview */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Compliance Framework
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {regulations.map((reg, index) => (
                <div key={index} className="bg-surface-elevated border border-border p-8 rounded-lg">
                  <h3 className="text-xl font-bold text-foreground mb-3">{reg.title}</h3>
                  <p className="text-muted-foreground mb-6">{reg.description}</p>
                  
                  <h4 className="font-semibold text-foreground mb-3">Our Compliance Measures:</h4>
                  <ul className="space-y-2">
                    {reg.compliance.map((measure, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Certifications & Accreditations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{cert.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audit Results */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Recent Audit Results
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
                <div className="bg-primary text-primary-foreground p-4">
                  <h3 className="font-semibold">Independent Compliance Audit Summary</h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {auditResults.map((result, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-background border border-border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-foreground">{result.category}</h4>
                          <p className="text-sm text-muted-foreground">Last Audit: {result.lastAudit}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{result.score}</div>
                          <div className="text-sm text-accent font-medium">{result.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Rights */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Your Rights as a Client
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-background border border-border p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Legal Rights</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>3-day cancellation period with full refund</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Right to dispute credit information yourself at no cost</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Written contract detailing all services and fees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Protection against misleading or false claims</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-background border border-border p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Service Guarantees</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Professional service delivery according to industry standards</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Transparent communication about progress and results</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Secure handling of all personal information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Compliance with all applicable laws and regulations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting & Oversight */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Regulatory Oversight
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-surface-elevated border border-border p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-6">File a Complaint</h3>
                <p className="text-muted-foreground mb-6">
                  If you have concerns about our services or compliance, you can file complaints with the following regulatory bodies:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Federal Trade Commission (FTC)</h4>
                      <p className="text-sm text-muted-foreground">Website: consumer.ftc.gov<br/>
                      Phone: 1-877-FTC-HELP</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Consumer Financial Protection Bureau (CFPB)</h4>
                      <p className="text-sm text-muted-foreground">Website: consumerfinance.gov<br/>
                      Phone: 1-855-411-CFPB</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Better Business Bureau (BBB)</h4>
                      <p className="text-sm text-muted-foreground">Website: bbb.org<br/>
                      Local BBB Office Directory</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">State Attorney General</h4>
                      <p className="text-sm text-muted-foreground">Contact your state's consumer protection division<br/>
                      Varies by state</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Compliance */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Internal Compliance Program
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Staff Training</h3>
                  <p className="text-muted-foreground text-sm">
                    Regular compliance training for all staff members on current regulations and best practices.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Regular Audits</h3>
                  <p className="text-muted-foreground text-sm">
                    Quarterly internal audits and annual third-party compliance assessments.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Documentation</h3>
                  <p className="text-muted-foreground text-sm">
                    Comprehensive documentation of all processes and compliance procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Compliance Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our compliance team is available to answer questions about our regulatory adherence 
              and client protection measures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Contact Compliance Team
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Download Compliance Report
              </button>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground">
              <p>Compliance Hotline: (555) 123-COMPLY | Email: compliance@cpncreditboost.com</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Compliance;