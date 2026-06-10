import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";

const FAQ = () => {
  const faqs = [
    {
      question: "Is a CPN legal?",
      answer: "A CPN (Credit Privacy Number) is completely legal when used properly. It's an alternative to using your SSN for credit applications, originally designed to protect your privacy. However, it's important to never misrepresent yourself on credit applications and always follow proper legal guidelines."
    },
    {
      question: "How fast does a tradeline report?",
      answer: "Our tradelines typically report to your credit report within 7-14 business days after purchase. Some may report as quickly as 3-5 days, while others may take up to 21 days depending on the bank's reporting cycle. We'll provide you with tracking information so you can monitor the process."
    },
    {
      question: "Can I get funding with a CPN?",
      answer: "Yes, many of our clients successfully obtain funding using their CPNs. However, success depends on several factors including the age and strength of your credit profile, your debt-to-income ratio, and the type of funding you're seeking. We provide guidance on the best funding strategies for your situation."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a comprehensive money-back guarantee. If your tradelines don't report within 60 days or if you're not satisfied with our service, we'll provide a full refund. For CPN packages, we guarantee the legitimacy and cleanliness of all numbers provided or your money back."
    },
    {
      question: "How long do tradelines stay on my credit report?",
      answer: "Our tradelines typically remain on your credit report for 1-2 reporting cycles (30-60 days) unless you purchase a longer-term package. During this time, you'll see the positive impact on your credit score. Some premium packages offer longer-term tradeline relationships."
    },
    {
      question: "Do you offer payment plans?",
      answer: "Yes, we offer flexible payment plans for all our packages. You can split your payment into 2-3 installments depending on the package you choose. Contact our sales team to discuss payment options that work for your budget."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use bank-level encryption and security protocols to protect all client information. Our systems are regularly audited and we never share your personal data with third parties. All data transmission is encrypted using 256-bit SSL technology."
    },
    {
      question: "What credit score improvement can I expect?",
      answer: "Results vary based on your current credit profile, but our clients typically see score increases of 100-200 points within 30-60 days. Some clients see improvements as quickly as 2 weeks. The exact increase depends on your starting score, existing credit history, and the package you choose."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, all our packages include ongoing support. Basic packages include email and phone support, while premium packages include dedicated account managers and personalized credit coaching. We're here to help you succeed throughout your credit journey."
    },
    {
      question: "Can I purchase multiple tradelines?",
      answer: "Absolutely! Many clients purchase multiple tradelines to maximize their credit score improvement. We can help you determine the optimal number and types of tradelines based on your current credit profile and goals. Bulk purchases often qualify for discounts."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-surface-elevated">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Knowledge Center &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to the most common questions about CPNs, tradelines, and our credit
            enhancement services. Still have questions? Contact our expert support team.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-in" className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border hover:border-primary/50 transition-colors px-6"
              >
                <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-6">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>

        {/* Bottom Contact CTA */}
        <ScrollReveal variant="scale-in" className="text-center mt-16">
          <div className="surface-elevated rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our credit experts are standing by to answer your questions and help you 
              choose the perfect credit enhancement package.
            </p>
            <div className="flex justify-center">
              <a href="https://t.me/cpncreditboost" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-gradient-cta rounded-lg font-semibold hover:scale-105 transition-transform duration-300 glow-accent">
                💬 Contact us on Telegram
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQ;