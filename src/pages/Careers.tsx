import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Credit Analyst",
      department: "Credit Services",
      location: "Remote",
      type: "Full-time",
      description: "Lead credit analysis and develop enhancement strategies for high-value clients.",
      requirements: [
        "5+ years credit analysis experience",
        "FICO certification preferred",
        "Strong analytical skills",
        "Excellent communication abilities"
      ]
    },
    {
      title: "Customer Success Specialist",
      department: "Customer Support",
      location: "Hybrid",
      type: "Full-time",
      description: "Provide exceptional support to clients throughout their credit improvement journey.",
      requirements: [
        "3+ years customer service experience",
        "Knowledge of credit industry",
        "Problem-solving skills",
        "Empathy and patience"
      ]
    },
    {
      title: "Compliance Officer",
      department: "Legal & Compliance",
      location: "On-site",
      type: "Full-time",
      description: "Ensure all operations comply with FCRA and state regulations.",
      requirements: [
        "Law degree or compliance certification",
        "5+ years regulatory experience",
        "Knowledge of credit laws",
        "Attention to detail"
      ]
    },
    {
      title: "Business Development Representative",
      department: "Sales & Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Identify new business opportunities and build relationships with potential partners.",
      requirements: [
        "3+ years sales experience",
        "Financial services background",
        "Strong networking skills",
        "Goal-oriented mindset"
      ]
    }
  ];

  const benefits = [
    {
      title: "Competitive Compensation",
      description: "Industry-leading salary packages with performance bonuses",
      icon: "💰"
    },
    {
      title: "Comprehensive Healthcare",
      description: "Full medical, dental, and vision coverage for you and your family",
      icon: "🏥"
    },
    {
      title: "Flexible Work Options",
      description: "Remote work opportunities and flexible scheduling",
      icon: "🏠"
    },
    {
      title: "Professional Development",
      description: "Ongoing training, certifications, and conference attendance",
      icon: "📚"
    },
    {
      title: "Retirement Planning",
      description: "401(k) with company matching and financial planning assistance",
      icon: "🏦"
    },
    {
      title: "Work-Life Balance",
      description: "Generous PTO policy and paid holidays",
      icon: "⚖️"
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
                Build Your Career with Us
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join our growing team of credit specialists and help others achieve their 
                financial goals while building your career in the credit industry.
              </p>
            </div>
          </div>
        </section>

        {/* Why Work Here */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Why Choose CPN Credit Boost?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-surface-elevated p-6 rounded-lg hover:shadow-elegant transition-all duration-300">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Open Positions
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {openPositions.map((position, index) => (
                <div key={index} className="bg-background border border-border p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>📍 {position.location}</span>
                        <span>🏢 {position.department}</span>
                        <span>⏰ {position.type}</span>
                      </div>
                    </div>
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-4 md:mt-0">
                      Apply Now
                    </button>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {position.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Application Process
            </h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-primary-foreground font-bold">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Apply Online</h3>
                <p className="text-sm text-muted-foreground">Submit your application and resume through our portal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-primary-foreground font-bold">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Initial Review</h3>
                <p className="text-sm text-muted-foreground">Our HR team reviews your qualifications and experience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-primary-foreground font-bold">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Interview Process</h3>
                <p className="text-sm text-muted-foreground">Meet with hiring managers and team members</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-primary-foreground font-bold">4</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Join Our Team</h3>
                <p className="text-sm text-muted-foreground">Complete onboarding and start making an impact</p>
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

export default Careers;