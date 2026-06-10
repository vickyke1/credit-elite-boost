import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Are authorized-user tradelines legal?",
      answer: "Yes. Being added as an authorized user is a long-standing, legal practice recognized by the credit bureaus and used by families and consumers for decades. We operate entirely within these established guidelines."
    },
    {
      question: "Will this raise my credit score by a specific amount?",
      answer: "No one can honestly promise a specific number. Credit scores are calculated from many factors unique to you. We provide positive payment history as one tool in your broader credit strategy — the outcome depends on your overall profile, and individual results vary."
    },
    {
      question: "How long until the tradeline reports?",
      answer: "Each account follows its issuing bank's reporting cycle. We match you to upcoming dates and give you an estimated posting window, but the exact timing is controlled by the bank, not by us."
    },
    {
      question: "What is your posting guarantee?",
      answer: "If a tradeline you purchase doesn't report as described, our posting guarantee covers you with a replacement or refund according to our guarantee terms. You're protected if something doesn't go as planned."
    },
    {
      question: "How long does the history stay on my report?",
      answer: "Authorized-user history typically remains for one or more reporting cycles depending on the listing you choose. Each tradeline's duration is shown up front so you know exactly what you're purchasing before checkout."
    },
    {
      question: "Do you remove negative or inaccurate items from my report?",
      answer: "No. We do not alter, dispute, or remove information from your credit report. We focus solely on adding legitimate, positive authorized-user history. For inaccurate items, you have the right to dispute them directly with the bureaus at no cost."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use bank-level encryption and strict confidentiality practices to protect all member information. Your data is never sold or shared for marketing, and all transmission is encrypted."
    },
    {
      question: "Who is this best for?",
      answer: "Consumers who want to strengthen a thin or rebuilding credit profile with established positive history, as part of a responsible, long-term financial plan. It is one component of a broader credit-building strategy."
    },
    {
      question: "Can I purchase more than one tradeline?",
      answer: "Yes. Many members select more than one tradeline as part of their strategy. Our specialists can help you understand how authorized-user history fits your goals so you can make an informed decision — with realistic expectations, never hype."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-surface-elevated">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Knowledge Center &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Straight answers about authorized-user tradelines, reporting, and how our
            marketplace works. Still have questions? Our specialists are here to help.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
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
        </div>
        
        {/* Bottom Contact CTA */}
        <div className="text-center mt-16">
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
        </div>
      </div>
    </section>
  );
};

export default FAQ;