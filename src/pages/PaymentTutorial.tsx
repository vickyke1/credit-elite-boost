import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const PaymentTutorial = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEOHead
      title="Cash App & Venmo Payment Guide | CpnCreditBoost"
      description="Watch the payment tutorial and contact CpnCreditBoost privately on Telegram to confirm Cash App or Venmo payment instructions for your order."
      canonicalUrl="https://cpncreditboost.com/payment-tutorial"
    />
    <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
    <Navigation />
    <main id="main-content" className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <Button asChild variant="ghost" className="mb-6 -ml-3">
        <Link to="/tradelines"><ArrowLeft aria-hidden="true" /> Back to shop</Link>
      </Button>
      <header className="mb-8">
        <p className="mb-3 text-sm font-semibold text-primary">CpnCreditBoost</p>
        <h1 className="text-3xl font-bold md:text-4xl">Cash App & Venmo payment guide</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Before sending money, message @Cpn_creditboost privately on Telegram to confirm your order, amount, and payment recipient.
        </p>
      </header>
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/fDjDH_WAvYI?start=4&rel=0"
          title="Cash App and Venmo payment tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <a href="https://www.youtube.com/watch?v=fDjDH_WAvYI&t=4s" target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" /> Watch on YouTube
          </a>
        </Button>
        <Button asChild>
          <a href="https://t.me/Cpn_creditboost" target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden="true" /> Arrange payment privately
          </a>
        </Button>
      </div>
      <section className="mt-10 border-t border-border pt-8" aria-labelledby="payment-checklist">
        <h2 id="payment-checklist" className="text-xl font-semibold">Before you pay</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>Send the tradeline name or order number to @Cpn_creditboost.</li>
          <li>Confirm whether Cash App or Venmo is available, and verify the recipient and exact amount.</li>
          <li>Keep your payment receipt and share the reference privately for review.</li>
        </ol>
        <p className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          This video is a tutorial, not a payment gateway. Manual payments remain pending until receipt is verified; watching the video or reporting a payment does not confirm an order. Never share passwords, verification codes, or wallet private keys.
        </p>
      </section>
    </main>
    <Footer />
  </div>
);

export default PaymentTutorial;