import { useState, type FormEvent } from "react";
import DOMPurify from "dompurify";
import { ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inquiryServices, pricingInquirySchema } from "@/lib/pricingInquiry";
import { supabase } from "@/integrations/supabase/client";

export default function Pricing() {
  const [params] = useSearchParams();
  const initial = inquiryServices.find(s => s.id === params.get("service"))?.id ?? "credit-education";
  const [service, setService] = useState<string>(initial);
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [id, setId] = useState(() => crypto.randomUUID());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    const clean = (value: string) => DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const parsed = pricingInquirySchema.safeParse({ id, name: clean(name), telegram, message: clean(message), service, consent, website });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check your details."); return; }
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("pricing-inquiry", { body: parsed.data });
      if (fnError || data?.success !== true) {
        let detail = data?.error;
        try { detail ??= (await fnError?.context?.json())?.error; } catch { /* fall back to a safe error */ }
        throw new Error(detail ?? "Your inquiry wasn't saved. Please try again.");
      }
      setSaved(true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Your inquiry wasn't saved. Please try again."); }
    finally { setLoading(false); }
  }

  return <div className="min-h-screen bg-background">
    <SEOHead title="Monthly Pricing Inquiries | CpnCreditBoost.com" description="Request monthly pricing for credit education, legitimate credit repair guidance, and authorized-user tradelines." canonicalUrl="https://cpncreditboost.com/pricing" />
    <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
    <Navigation />
    <main id="main-content" className="container px-4 py-10 sm:px-6 md:py-16">
      <header className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase text-primary">CpnCreditBoost.com / Pricing</p>
        <h1 className="text-3xl font-bold sm:text-5xl">Monthly pricing inquiries</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">Explore credit-building support using your real identity. Request a written quote before deciding.</p>
      </header>
      <div className="my-8 grid gap-4 md:grid-cols-3">
        {inquiryServices.map(s => <article key={s.id} className="flex flex-col rounded-lg border border-border bg-card p-5">
          <h2 className="text-xl font-semibold">{s.name}</h2>
          <p className="my-4 text-2xl font-bold text-primary">Request monthly rate</p>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
          <Button asChild variant="outline" className="mt-auto min-h-11" onClick={() => setService(s.id)}><a href="#pricing-inquiry">Request pricing <ArrowRight className="h-4 w-4" /></a></Button>
        </article>)}
      </div>
      <div className="border-y border-border py-5 text-sm leading-relaxed text-muted-foreground">Monthly rates have not been published. This is an inquiry, not a subscription or payment authorization. Credit outcomes and approvals are not guaranteed.</div>
      <section id="pricing-inquiry" className="grid scroll-mt-24 gap-8 py-10 md:grid-cols-[1fr_1.4fr] md:gap-16" aria-labelledby="inquiry-title">
        <div>
          <h2 id="inquiry-title" className="text-2xl font-bold">Let’s talk about your goals</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">Send a pricing inquiry and receive a reply on Telegram. Do not include Social Security numbers, credit-card details, or identity documents.</p>
          <Button asChild variant="outline" className="mt-6 min-h-11"><a href="https://t.me/cpncreditboost" target="_blank" rel="noopener noreferrer"><Send className="h-4 w-4" /> Contact on Telegram</a></Button>
        </div>
        {saved ? <div role="status" className="py-6">
          <CheckCircle2 className="mb-4 h-9 w-9 text-accent" />
          <h3 className="text-2xl font-bold">Your inquiry has been saved</h3>
          <p className="mt-3 text-muted-foreground">You can also reach CpnCreditBoost directly on Telegram.</p>
          <Button variant="outline" className="mt-6 min-h-11" onClick={() => { setSaved(false); setName(""); setTelegram(""); setMessage(""); setConsent(false); setId(crypto.randomUUID()); }}>Send another inquiry</Button>
        </div> : <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="inquiry-name">Name</Label><Input id="inquiry-name" autoComplete="name" maxLength={100} required value={name} onChange={e => setName(e.target.value)} className="min-h-12 text-base" /></div>
          <div className="space-y-2"><Label htmlFor="inquiry-telegram">Telegram username</Label><Input id="inquiry-telegram" placeholder="@yourusername" maxLength={33} required value={telegram} onChange={e => setTelegram(e.target.value)} className="min-h-12 text-base" /></div>
          <div className="space-y-2"><Label htmlFor="inquiry-service">Service</Label><Select value={service} onValueChange={setService}><SelectTrigger id="inquiry-service" className="min-h-12 text-base"><SelectValue /></SelectTrigger><SelectContent>{inquiryServices.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="inquiry-message">Your goals</Label><Textarea id="inquiry-message" rows={5} maxLength={2000} minLength={10} required value={message} onChange={e => setMessage(e.target.value)} className="text-base" /></div>
          <div className="hidden" aria-hidden="true"><label htmlFor="inquiry-website">Website</label><input id="inquiry-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed"><Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} className="mt-1 shrink-0" aria-label="Agree to Telegram contact" /><span>I agree to be contacted on Telegram about this inquiry and have read the <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.</span></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="min-h-12 w-full text-base">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{loading ? "Saving inquiry…" : "Send pricing inquiry"}</Button>
        </form>}
      </section>
    </main>
    <Footer />
  </div>;
}