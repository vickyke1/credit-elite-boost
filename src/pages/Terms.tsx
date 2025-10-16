import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Complete terms and conditions governing the use of our services, client 
                responsibilities, and service agreements.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last Updated: March 1, 2024
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg text-muted-foreground">
              
              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using the services provided by CPN Credit Boost ("Company," "we," "us," or "our"), you ("Client," "you," or "your") agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.</p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Agreement Updates</h3>
                  <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of modified terms.</p>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Service Description</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Credit Enhancement Services</h3>
                    <p>We provide legitimate credit enhancement services including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Tradeline services through authorized user positions</li>
                      <li>Credit Profile Number (CPN) packages and guidance</li>
                      <li>Credit repair and dispute services</li>
                      <li>Business credit establishment services</li>
                      <li>Credit education and consultation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Service Limitations</h3>
                    <p>Our services are educational and advisory in nature. We do not guarantee specific credit score improvements or loan approvals. Results vary based on individual circumstances and compliance with our guidance.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Client Responsibilities</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Accurate Information</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Provide truthful and accurate personal information</li>
                      <li>Update information promptly when changes occur</li>
                      <li>Verify all information before submission</li>
                      <li>Report any errors or discrepancies immediately</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Compliance Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Follow all provided instructions and guidelines</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Use services for legitimate credit enhancement purposes only</li>
                      <li>Maintain confidentiality of account information</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Prohibited Activities</h3>
                    <p>Clients agree not to:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Use false or fraudulent information</li>
                      <li>Attempt to circumvent security measures</li>
                      <li>Share account credentials with third parties</li>
                      <li>Use services for illegal purposes</li>
                      <li>Interfere with our systems or other clients' accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Payment Terms</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Fees and Billing</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All fees are due in advance unless otherwise specified</li>
                      <li>Prices are subject to change with 30 days notice</li>
                      <li>Setup fees are non-refundable once services begin</li>
                      <li>Monthly services are billed on the anniversary date</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Refund Policy</h3>
                    <p>Refunds are available under specific circumstances:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Services not yet delivered may be eligible for refund</li>
                      <li>Refund requests must be made within 30 days</li>
                      <li>Completed services are generally non-refundable</li>
                      <li>Refunds are processed within 5-10 business days</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Late Payments</h3>
                    <p>Late payments may result in service suspension and additional fees. Accounts past due by 30 days may be terminated.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Service Guarantees and Disclaimers</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Performance Disclaimers</h3>
                    <p><strong>IMPORTANT:</strong> While we provide professional credit enhancement services, we cannot guarantee specific results. Credit improvement depends on many factors including:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Individual credit history and current status</li>
                      <li>Compliance with our instructions and recommendations</li>
                      <li>Actions by credit bureaus and creditors</li>
                      <li>External economic and regulatory factors</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Service Quality</h3>
                    <p>We guarantee that all services will be performed professionally and in accordance with industry best practices. If you are not satisfied with our service quality, please contact us immediately.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Legal Compliance</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Regulatory Compliance</h3>
                    <p>Our services comply with:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Fair Credit Reporting Act (FCRA)</li>
                      <li>Credit Repair Organizations Act (CROA)</li>
                      <li>Fair Debt Collection Practices Act (FDCPA)</li>
                      <li>State credit services organization laws</li>
                      <li>Consumer protection regulations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Client Rights</h3>
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Cancel services within 3 business days for full refund</li>
                      <li>Dispute credit information yourself at no cost</li>
                      <li>Receive a written contract detailing services</li>
                      <li>File complaints with regulatory authorities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
                <div className="space-y-4">
                  <p><strong>LIMITATION:</strong> Our liability is limited to the amount paid for services. We are not liable for indirect, incidental, or consequential damages including lost profits or credit denials.</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Indemnification</h3>
                    <p>Clients agree to indemnify and hold us harmless from claims arising from misuse of our services or violation of these terms.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Privacy and Confidentiality</h2>
                <div className="space-y-4">
                  <p>We maintain strict confidentiality of all client information in accordance with our Privacy Policy. Information is only shared as necessary to provide services or as required by law.</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Data Security</h3>
                    <p>We employ industry-standard security measures to protect client data, including encryption, secure servers, and access controls.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Termination</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Client Termination</h3>
                    <p>Clients may terminate services at any time with written notice. Refunds for unused services will be provided according to our refund policy.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Company Termination</h3>
                    <p>We reserve the right to terminate services for:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Violation of these terms</li>
                      <li>Non-payment of fees</li>
                      <li>Fraudulent or illegal activity</li>
                      <li>Abuse of our staff or systems</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Dispute Resolution</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Informal Resolution</h3>
                    <p>We encourage clients to contact us directly to resolve any disputes. Most issues can be resolved through direct communication with our customer service team.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Formal Dispute Process</h3>
                    <p>Unresolved disputes may be subject to binding arbitration under the rules of the American Arbitration Association. This agreement waives the right to jury trial or class action participation.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-elevated p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Information</h2>
                <div className="space-y-4">
                  <p>For questions about these Terms of Service or to report violations:</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Legal Department</h3>
                      <p>Email: legal@cpncreditboost.com<br/>
                      Phone: +1 (904) 243-5425<br/>
                      Response Time: 2-3 business days</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Mailing Address</h3>
                      <p>CPN Credit Boost<br/>
                      Legal Department<br/>
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

export default Terms;