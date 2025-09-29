import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Comprehensive privacy policy detailing how we protect, collect, and use your 
                personal information in compliance with federal regulations.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last Updated: March 1, 2024
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg text-muted-foreground">
              
              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                    <p>We collect personal information you provide when using our services, including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Full name, address, phone number, and email address</li>
                      <li>Social Security Number (for identity verification)</li>
                      <li>Date of birth and government-issued ID information</li>
                      <li>Financial information for credit analysis and services</li>
                      <li>Payment information for processing transactions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>IP address, browser type, and device information</li>
                      <li>Website usage patterns and interaction data</li>
                      <li>Cookies and similar tracking technologies</li>
                      <li>Location data (if permitted by your device)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Service Delivery</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Provide credit enhancement and tradeline services</li>
                      <li>Process payments and manage your account</li>
                      <li>Verify your identity and prevent fraud</li>
                      <li>Communicate about your services and account status</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Legal and Compliance</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Comply with legal obligations and regulations</li>
                      <li>Respond to legal requests and prevent illegal activity</li>
                      <li>Maintain records as required by law</li>
                      <li>Protect our rights and the rights of others</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Sharing</h2>
                <div className="space-y-4">
                  <p>We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Authorized Sharing</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Credit Bureaus:</strong> As necessary to provide credit services</li>
                      <li><strong>Financial Institutions:</strong> For tradeline and credit services</li>
                      <li><strong>Service Providers:</strong> Trusted partners who assist in service delivery</li>
                      <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Data Protection</h3>
                    <p>All authorized third parties are bound by confidentiality agreements and must maintain the same level of data protection we provide.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Security Measures</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>256-bit SSL encryption for all data transmission</li>
                      <li>Secure servers with restricted access controls</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      <li>Employee training on data protection protocols</li>
                      <li>Multi-factor authentication for account access</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Data Retention</h3>
                    <p>We retain your information only as long as necessary to provide services and comply with legal obligations. Most personal data is retained for 7 years after account closure, as required by financial regulations.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Access and Control</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Access:</strong> Request copies of your personal information</li>
                      <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                      <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                      <li><strong>Opt-out:</strong> Decline certain uses of your information</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Exercising Your Rights</h3>
                    <p>To exercise these rights, contact us at privacy@cpncreditboost.com or call (555) 123-PRIVACY. We will respond within 30 days of receiving your request.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies and Tracking</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Cookie Usage</h3>
                    <p>We use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Maintain your login session and preferences</li>
                      <li>Analyze website performance and usage patterns</li>
                      <li>Provide personalized content and recommendations</li>
                      <li>Prevent fraud and enhance security</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Cookie Control</h3>
                    <p>You can control cookies through your browser settings. However, disabling certain cookies may limit website functionality.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Links</h2>
                <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any information.</p>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
                <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will delete it immediately.</p>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. State-Specific Rights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">California Residents (CCPA)</h3>
                    <p>California residents have additional rights under the California Consumer Privacy Act, including the right to know what personal information is collected and the right to delete personal information.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Other States</h3>
                    <p>We comply with all applicable state privacy laws and regulations. Contact us for information about your specific state rights.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
                <div className="space-y-4">
                  <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Privacy Officer</h3>
                      <p>Email: privacy@cpncreditboost.com<br/>
                      Phone: (555) 123-PRIVACY<br/>
                      Response Time: 24-48 hours</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Mailing Address</h3>
                      <p>CPN Credit Boost<br/>
                      Privacy Department<br/>
                      123 Financial District Blvd<br/>
                      Suite 500<br/>
                      New York, NY 10005</p>
                    </div>
                  </div>
                </div>
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

export default Privacy;