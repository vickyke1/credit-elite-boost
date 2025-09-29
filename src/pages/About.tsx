import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About CPN Credit Boost
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted partner in credit enhancement, helping over 10,000 clients achieve 
                financial freedom through ethical and legal credit improvement services.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  At CPN Credit Boost, we believe everyone deserves a second chance at financial success. 
                  Our mission is to provide legitimate, legal credit enhancement services that empower 
                  individuals to rebuild their financial standing.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We specialize in tradeline services, CPN packages, and comprehensive credit education 
                  to help our clients make informed financial decisions and achieve their goals.
                </p>
              </div>
              <div className="bg-surface-elevated p-8 rounded-lg">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    FCRA Compliant Services
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Licensed & Bonded Company
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    10+ Years Industry Experience
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    24/7 Customer Support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">⚖️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Ethics First</h3>
                <p className="text-muted-foreground">
                  We operate with complete transparency and adhere to all legal requirements 
                  in the credit enhancement industry.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Results Driven</h3>
                <p className="text-muted-foreground">
                  Our proven methods have helped thousands of clients improve their credit 
                  profiles and achieve their financial goals.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Client Success</h3>
                <p className="text-muted-foreground">
                  Your success is our success. We provide ongoing support and education 
                  throughout your credit improvement journey.
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

export default About;