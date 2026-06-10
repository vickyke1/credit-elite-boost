import { Shield, Users, Phone, CheckCircle, Zap, CreditCard } from "lucide-react";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Seasoned, Premium Tradelines",
      description: "Established accounts with long histories, low utilization, and spotless payment records — the qualities lenders look at most."
    },
    {
      icon: Shield,
      title: "Full Transparency, Zero Surprises",
      description: "Every listing shows age, credit limit, utilization, and reporting cycle up front. You know exactly what you're getting before you commit."
    },
    {
      icon: CheckCircle,
      title: "Secure & Confidential",
      description: "Bank-level encryption and strict data-handling practices protect your information. Your privacy is never for sale."
    },
    {
      icon: Zap,
      title: "Reliable Reporting Windows",
      description: "We match you to tradelines aligned with upcoming reporting dates, so you're never left waiting and wondering."
    },
    {
      icon: Users,
      title: "Guidance, Not Hype",
      description: "Our specialists help you understand how authorized-user history fits a broader credit-building plan, with realistic expectations."
    },
    {
      icon: Phone,
      title: "Posting Guarantee",
      description: "If a tradeline you purchase doesn't post as described, we make it right with a replacement or refund per our guarantee terms."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Members Choose{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Credit Elite Boost
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A tradeline marketplace built on transparency, security, and real results —
            helping thousands of members strengthen their credit profiles the smart, strategic way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="surface-elevated rounded-2xl p-8 hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 group-hover:glow-primary transition-all duration-300">
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground/80 text-center max-w-3xl mx-auto mt-12">
          We help you add positive credit history. We do not promise specific credit-score
          increases, removal of accurate information, or approval for any loan.
        </p>
      </div>
    </section>
  );
};

export default WhyChooseUs;