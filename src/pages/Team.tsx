import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Link } from "react-router-dom";

const Team = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      position: "Chief Executive Officer",
      experience: "15+ Years Credit Industry",
      specialties: ["Credit Enhancement", "Business Strategy", "Regulatory Compliance"],
      bio: "Sarah leads our team with over 15 years of experience in the credit industry, ensuring all services meet the highest ethical and legal standards."
    },
    {
      name: "Michael Chen",
      position: "Director of Credit Services",
      experience: "12+ Years Financial Services",
      specialties: ["Tradeline Management", "Credit Analysis", "Client Relations"],
      bio: "Michael oversees our tradeline marketplace and ensures each client receives personalized service tailored to their credit goals."
    },
    {
      name: "Jennifer Martinez",
      position: "Head of Compliance",
      experience: "10+ Years Legal & Compliance",
      specialties: ["FCRA Compliance", "Legal Affairs", "Risk Management"],
      bio: "Jennifer ensures all our services comply with federal regulations and state laws, maintaining our commitment to ethical practices."
    },
    {
      name: "David Thompson",
      position: "Senior Credit Analyst",
      experience: "8+ Years Credit Analysis",
      specialties: ["Credit Repair", "Score Optimization", "Financial Planning"],
      bio: "David works directly with clients to analyze their credit reports and develop customized improvement strategies."
    },
    {
      name: "Lisa Rodriguez",
      position: "Customer Success Manager",
      experience: "7+ Years Customer Service",
      specialties: ["Client Support", "Education", "Account Management"],
      bio: "Lisa leads our customer success team, providing ongoing support and education to help clients maximize their results."
    },
    {
      name: "Robert Kim",
      position: "Technology Director",
      experience: "9+ Years FinTech",
      specialties: ["Security Systems", "Platform Development", "Data Protection"],
      bio: "Robert oversees our technology infrastructure, ensuring secure and efficient service delivery for all clients."
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
                Meet Our Expert Team
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Certified credit professionals and financial experts dedicated to your success 
                with years of industry experience and proven track records.
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-surface-elevated p-6 rounded-lg hover:shadow-elegant transition-all duration-300">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-primary-foreground font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-center mb-2">
                    {member.position}
                  </p>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {member.experience}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span key={idx} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Work with Our Experts?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our certified team is standing by to help you achieve your credit goals. 
              Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Free Consultation
              </Link>
              <Link to="/contact" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Contact Team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Team;