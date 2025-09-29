import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const contactMethods = [
    {
      title: "Phone Support",
      description: "Speak with our credit experts",
      details: "(555) 123-CREDIT",
      hours: "Mon-Fri: 8AM-8PM EST",
      icon: "📞"
    },
    {
      title: "Email Support", 
      description: "Get detailed assistance via email",
      details: "support@cpncreditboost.com",
      hours: "Response within 24 hours",
      icon: "✉️"
    },
    {
      title: "Live Chat",
      description: "Instant help through our website",
      details: "Available on all pages",
      hours: "Mon-Fri: 9AM-6PM EST",
      icon: "💬"
    },
    {
      title: "Client Portal",
      description: "Access your account dashboard",
      details: "24/7 secure access",
      hours: "Always available",
      icon: "🔐"
    }
  ];

  const offices = [
    {
      title: "Corporate Headquarters",
      address: "123 Financial District Blvd\nSuite 500\nNew York, NY 10005",
      phone: "(555) 123-0001",
      email: "corporate@cpncreditboost.com"
    },
    {
      title: "West Coast Office",
      address: "456 Innovation Drive\nSuite 200\nLos Angeles, CA 90210", 
      phone: "(555) 123-0002",
      email: "westcoast@cpncreditboost.com"
    },
    {
      title: "Customer Service Center",
      address: "789 Support Center Way\nFloor 3\nAtlanta, GA 30309",
      phone: "(555) 123-HELP",
      email: "support@cpncreditboost.com"
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
                Contact Our Team
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get in touch with our support team through multiple channels for personalized 
                assistance with your credit enhancement journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              How to Reach Us
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-surface-elevated p-6 rounded-lg text-center hover:shadow-elegant transition-all duration-300">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {method.description}
                  </p>
                  <div className="text-primary font-semibold mb-2">
                    {method.details}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {method.hours}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                Send Us a Message
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <Input 
                      placeholder="Enter your first name" 
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <Input 
                      placeholder="Enter your last name" 
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input 
                    type="email"
                    placeholder="your.email@example.com" 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input 
                    type="tel"
                    placeholder="(555) 123-4567" 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input 
                    placeholder="What can we help you with?" 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea 
                    placeholder="Please describe your question or concern in detail..."
                    rows={5}
                    className="w-full"
                  />
                </div>
                
                <div className="text-center">
                  <Button size="lg" className="px-8 py-3">
                    Send Message
                  </Button>
                </div>
              </form>
              
              <div className="text-center mt-6 text-sm text-muted-foreground">
                We typically respond within 24 hours during business days.
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Offices
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <div key={index} className="bg-surface-elevated p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {office.title}
                  </h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground mb-1">Address:</div>
                      <div className="whitespace-pre-line">{office.address}</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-1">Phone:</div>
                      <a href={`tel:${office.phone}`} className="text-primary hover:text-primary/80">
                        {office.phone}
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-1">Email:</div>
                      <a href={`mailto:${office.email}`} className="text-primary hover:text-primary/80">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Common Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What are your customer service hours?
                </h3>
                <p className="text-muted-foreground">
                  Our phone support is available Monday through Friday, 8AM to 8PM EST. 
                  Email support is available 24/7 with responses within 24 hours.
                </p>
              </div>
              
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How quickly will I receive a response?
                </h3>
                <p className="text-muted-foreground">
                  Live chat and phone calls are answered immediately during business hours. 
                  Email inquiries receive responses within 24 hours during business days.
                </p>
              </div>
              
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Can I schedule a consultation?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We offer free consultations to discuss your credit goals. 
                  Contact us to schedule a convenient time to speak with one of our experts.
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

export default Contact;