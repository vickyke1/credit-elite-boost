import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    company: [
      { 
        name: "About Us", 
        href: "/about", 
        description: "Learn about our mission to help clients achieve financial freedom through expert credit enhancement services and ethical business practices."
      },
      { 
        name: "Our Team", 
        href: "/team", 
        description: "Meet our certified credit professionals and financial experts dedicated to your success with years of industry experience."
      },
      {
        name: "Press",
        href: "/press", 
        description: "Latest news, media coverage, and press releases about CPN Credit Boost's achievements and industry recognition."
      }
    ],
    services: [
      { 
        name: "Buy Tradelines", 
        href: "/tradelines", 
        description: "Browse our extensive marketplace of aged tradelines from trusted banks to boost your credit profile and improve your creditworthiness."
      },
      { 
        name: "CPN Packages", 
        href: "/cpn-packages",
        description: "Complete CPN packages with aged tradelines, credit monitoring, and step-by-step guidance for building strong credit profiles."
      },
      { 
        name: "Business Credit", 
        href: "/business-credit", 
        description: "Establish and build business credit lines separate from personal credit to grow your company and protect your personal assets."
      },
      { 
        name: "Credit Repair", 
        href: "/credit-repair", 
        description: "Professional credit repair services to dispute inaccuracies, remove negative items, and optimize your credit reports across all bureaus."
      }
    ],
    support: [
      { 
        name: "FAQ", 
        href: "/#faq", 
        description: "Find answers to common questions about tradelines, CPNs, credit building, and our services with detailed explanations."
      },
      { 
        name: "Contact", 
        href: "/contact", 
        description: "Get in touch with our support team through multiple channels for personalized assistance with your credit enhancement journey."
      },
      { 
        name: "Live Chat",
        href: "/live-chat",
        description: "Instant support through our live chat system for quick answers to your questions and real-time assistance."
      },
      { 
        name: "Client Portal", 
        href: "/login", 
        description: "Access your secure client dashboard to track tradeline status, view credit reports, and manage your account information."
      }
    ],
    legal: [
      { 
        name: "Privacy Policy", 
        href: "/privacy", 
        description: "Comprehensive privacy policy detailing how we protect, collect, and use your personal information in compliance with federal regulations."
      },
      { 
        name: "Terms of Service", 
        href: "/terms", 
        description: "Complete terms and conditions governing the use of our services, client responsibilities, and service agreements."
      },
      { 
        name: "Disclaimer", 
        href: "/disclaimer", 
        description: "Important legal disclaimers about credit enhancement services, results expectations, and regulatory compliance information."
      },
      { 
        name: "Compliance", 
        href: "/compliance", 
        description: "Our commitment to legal compliance with FCRA, state regulations, and industry standards for credit enhancement services."
      }
    ]
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              CPN Credit Boost
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted partner in credit enhancement. We've helped over 10,000 clients 
              achieve their financial goals through premium CPNs and aged tradelines.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-lg">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-xs text-muted-foreground">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-lg">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">McAfee Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-lg">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-xs text-muted-foreground">BBB A+ Rated</span>
              </div>
            </div>
          </div>
          
          {/* Links Sections */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        
        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>
              © 2024 CPN Credit Boost. All rights reserved.
            </div>
            <div className="flex gap-6">
              <span>Licensed & Bonded</span>
              <span>FCRA Compliant</span>
              <span>Credit Industry Certified</span>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6 text-xs text-muted-foreground max-w-4xl mx-auto">
            <p>
              Disclaimer: CPN Credit Boost is not a credit repair company. We provide credit enhancement 
              services through legal tradeline and CPN programs. Results may vary and are not guaranteed. 
              Please consult with a financial advisor before making any credit decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;