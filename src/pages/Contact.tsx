import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/useContactForm";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { breadcrumbSchema } from "@/utils/schemaMarkup";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Contact = () => {
  const { submitForm, isSubmitting } = useContactForm();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitForm({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject,
      message: formData.message
    });

    if (result.success) {
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <SEOHead
        title="Contact Us - Get Help with Credit Building | CPN Credit Boost"
        description="Contact our credit experts for personalized assistance. Phone, email, live chat, and client portal support available. Get help with tradelines, CPN services, and credit building."
        keywords="contact credit services, credit help, tradeline support, CPN assistance, credit experts"
        canonicalUrl="https://cpncreditboost.com/contact"
        ogType="website"
        schemaData={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home", url: "https://cpncreditboost.com" },
              { name: "Contact", url: "https://cpncreditboost.com/contact" }
            ])
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
                  <BreadcrumbPage>Contact</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

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


        {/* Contact Form */}
        <section className="py-16 bg-surface-elevated">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <Input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name" 
                      className="w-full"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <Input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name" 
                      className="w-full"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com" 
                    className="w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567" 
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What can we help you with?" 
                    className="w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your question or concern in detail..."
                    rows={5}
                    className="w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="text-center">
                  <Button type="submit" size="lg" className="px-8 py-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
              
              <div className="text-center mt-6 text-sm text-muted-foreground">
                We typically respond within 24 hours during business days.
              </div>
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
                  Please submit the contact form below and we'll respond within 24-48 hours during business days.
                </p>
              </div>
              
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How quickly will I receive a response?
                </h3>
                <p className="text-muted-foreground">
                  We aim to respond to all contact form submissions within 24-48 hours during business days.
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
    </>
  );
};

export default Contact;