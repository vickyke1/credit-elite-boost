const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#team" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" }
    ],
    services: [
      { name: "Buy Tradelines", href: "#tradelines" },
      { name: "CPN Packages", href: "#packages" },
      { name: "Business Credit", href: "#business" },
      { name: "Credit Repair", href: "#repair" }
    ],
    support: [
      { name: "FAQ", href: "#faq" },
      { name: "Contact", href: "#contact" },
      { name: "Live Chat", href: "#chat" },
      { name: "Client Portal", href: "#portal" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Disclaimer", href: "#disclaimer" },
      { name: "Compliance", href: "#compliance" }
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
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold text-foreground mb-2">📞 Phone Support</h4>
              <p className="text-muted-foreground">+1 (754) 328-7704</p>
              <p className="text-sm text-muted-foreground">24/7 Available</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">✉️ Email Support</h4>
              <p className="text-muted-foreground">admin@cpncreditboost.com</p>
              <p className="text-sm text-muted-foreground">Response within 2 hours</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">💬 Live Chat</h4>
              <p className="text-muted-foreground">Available on website</p>
              <p className="text-sm text-muted-foreground">Instant responses</p>
            </div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Follow us for credit tips and updates:
            </div>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((social, index) => (
                <a 
                  key={index}
                  href={`#${social.toLowerCase()}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
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