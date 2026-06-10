import { Shield, Users, Phone, CheckCircle, Zap, CreditCard } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Tradelines and CPNs delivered within 24-72 hours"
    },
    {
      icon: Shield,
      title: "Clean, Safe CPNs",
      description: "Verified, aged CPNs with no negative history"
    },
    {
      icon: CreditCard,
      title: "Real Aged Tradelines",
      description: "Authentic tradelines from major banks and credit unions"
    },
    {
      icon: Users,
      title: "Business Credit Profiles",
      description: "Complete business credit packages for funding"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer service and guidance"
    },
    {
      icon: CheckCircle,
      title: "Money-Back Guarantee",
      description: "100% satisfaction guaranteed or your money back"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              CPN Credit Boost?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're the industry leaders in credit enhancement with over 10 years of experience
            helping clients achieve their financial goals.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <ScrollReveal
              key={index}
              delay={index * 100}
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;