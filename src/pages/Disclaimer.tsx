import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Legal Disclaimer
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Important legal disclaimers about credit enhancement services, results expectations, 
                and regulatory compliance information.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last Updated: March 1, 2024
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg text-muted-foreground">
              
              {/* Important Notice */}
              <div className="bg-accent/20 border-l-4 border-accent p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">⚠️ Important Notice</h2>
                <p className="text-lg">
                  <strong>READ THIS DISCLAIMER CAREFULLY BEFORE USING OUR SERVICES.</strong> This disclaimer contains important legal information about the limitations and expectations of our credit enhancement services.
                </p>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. No Guaranteed Results</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Credit Score Improvements</h3>
                    <p><strong>CPN Credit Boost does NOT guarantee specific credit score improvements.</strong> While our services have helped many clients, individual results vary significantly based on:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Current credit status and history</li>
                      <li>Individual compliance with recommendations</li>
                      <li>Actions by credit bureaus and creditors</li>
                      <li>External economic factors</li>
                      <li>Changes in credit scoring models</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Loan Approvals</h3>
                    <p><strong>We do NOT guarantee loan approvals or specific credit terms.</strong> Lending decisions are made by financial institutions based on their own criteria, which may include factors beyond credit scores.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Legal and Compliance Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Regulatory Status</h3>
                    <p>CPN Credit Boost is <strong>NOT</strong> a traditional credit repair company. We provide credit enhancement services through legal tradeline and CPN programs that comply with applicable federal and state regulations.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">FCRA Compliance</h3>
                    <p>Our services comply with the Fair Credit Reporting Act (FCRA). We only dispute information that appears to be inaccurate, unverifiable, or outdated according to federal law.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">State Regulations</h3>
                    <p>Some states have specific regulations regarding credit services. We comply with all applicable state laws and are licensed where required.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. CPN and Tradeline Disclaimers</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Credit Profile Numbers (CPNs)</h3>
                    <p><strong>IMPORTANT:</strong> CPNs are legal when used properly for privacy protection. However:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>CPNs must never be used to misrepresent identity</li>
                      <li>Using CPNs fraudulently is a federal crime</li>
                      <li>All applications must be truthful and accurate</li>
                      <li>CPNs do not erase existing debt obligations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Tradeline Services</h3>
                    <p>Our tradeline services involve adding clients as authorized users to established accounts. <strong>Important considerations:</strong></p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Results depend on how credit bureaus report the tradelines</li>
                      <li>Some lenders may not consider authorized user tradelines</li>
                      <li>Tradelines may not appear on all three credit reports</li>
                      <li>Effects may be temporary if not properly maintained</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Financial Advisory Disclaimer</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Not Financial Advice</h3>
                    <p>The information and services provided by CPN Credit Boost are <strong>NOT financial advice</strong>. We recommend consulting with qualified financial advisors before making significant financial decisions.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Individual Consultation Required</h3>
                    <p>Every individual's financial situation is unique. What works for one person may not be appropriate for another. Always consider your specific circumstances and consult professionals when needed.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Timeline and Expectations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Processing Timeframes</h3>
                    <p>Estimated timeframes are based on typical processing times and are <strong>NOT guaranteed</strong>:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Tradeline reporting: 30-60 days (may vary)</li>
                      <li>Credit disputes: 30-45 days per round</li>
                      <li>CPN setup: 1-2 weeks for documentation</li>
                      <li>Score improvements: 60-90 days to see changes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">External Factors</h3>
                    <p>Delays may occur due to factors beyond our control, including credit bureau processing times, creditor responses, and system maintenance.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Risk Acknowledgment</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Potential Risks</h3>
                    <p>By using our services, you acknowledge these potential risks:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Credit scores may fluctuate during the process</li>
                      <li>Some negative items may not be removable</li>
                      <li>Creditors may re-insert disputed items</li>
                      <li>Credit inquiries may temporarily lower scores</li>
                      <li>Results may take longer than anticipated</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Client Responsibility</h3>
                    <p>Clients are responsible for following all instructions, maintaining good financial habits, and making timely payments on all accounts.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Educational Nature of Services</h2>
                <div className="space-y-4">
                  <p>Our services are primarily <strong>educational and advisory</strong>. We provide:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Information about credit enhancement strategies</li>
                    <li>Guidance on proper credit management</li>
                    <li>Assistance with legitimate credit building methods</li>
                    <li>Support in understanding credit reports and scores</li>
                  </ul>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Client Education</h3>
                    <p>We strongly encourage clients to educate themselves about credit and financial management to maintain long-term success.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <div className="space-y-4">
                  <p><strong>LIABILITY LIMITATION:</strong> CPN Credit Boost's liability is limited to the fees paid for services. We are not responsible for:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Indirect or consequential damages</li>
                    <li>Lost profits or business opportunities</li>
                    <li>Credit denials or unfavorable terms</li>
                    <li>Actions by third parties (creditors, bureaus, etc.)</li>
                    <li>Changes in credit laws or scoring models</li>
                  </ul>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Professional Consultation</h2>
                <div className="space-y-4">
                  <p><strong>We strongly recommend consulting with qualified professionals:</strong></p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Financial Advisors</h3>
                      <p>For comprehensive financial planning and investment advice</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Tax Professionals</h3>
                      <p>For tax implications of financial decisions</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Legal Counsel</h3>
                      <p>For legal questions about credit and debt issues</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Certified Credit Counselors</h3>
                      <p>For comprehensive credit counseling services</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact for Legal Questions</h2>
                <div className="space-y-4">
                  <p>For questions about this disclaimer or legal matters:</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Legal Department</h3>
                      <p>Telegram: <a href="https://t.me/cpncreditboost" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@cpncreditboost</a><br/>
                      Business Hours: Mon-Fri 9AM-5PM EST</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Compliance Officer</h3>
                      <p>Telegram: <a href="https://t.me/cpncreditboost" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@cpncreditboost</a><br/>
                      Response Time: 2-3 business days</p>
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

export default Disclaimer;