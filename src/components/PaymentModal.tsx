import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Send } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualPaymentOptions } from "@/components/ManualPaymentOptions";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const TELEGRAM_URL = "https://t.me/Cpn_creditboost";
const telegramPattern = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export const PaymentModal = ({ isOpen, onClose, total }: PaymentModalProps) => {
  const { items } = useCart();
  const [telegram, setTelegram] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState<string[] | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const cartKey = JSON.stringify(items.map((item) => item.id));

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setChecking(true);
    setAvailable(null);
    setError(null);
    supabase.functions.invoke("order-status", { body: { skus: JSON.parse(cartKey) } })
      .then(({ data, error: checkError }) => {
        if (cancelled) return;
        setAvailable(!checkError && data?.available === true);
        setChecking(false);
      }).catch(() => {
        if (cancelled) return;
        setAvailable(false);
        setChecking(false);
      });
    return () => { cancelled = true; };
  }, [isOpen, cartKey]);

  useEffect(() => {
    if (!isOpen || configured !== null) return;
    supabase.functions.invoke("order-status", { body: { currencies: true } }).then(({ data }) => {
      setConfigured(Boolean(data?.configured));
      setCoins(Array.isArray(data?.currencies) ? data.currencies : []);
    });
  }, [isOpen, configured]);

  const startCheckout = async () => {
    if (available !== true || checking || busy) return;
    setError(null);
    if (!telegramPattern.test(telegram.trim())) {
      setError("Enter your Telegram username so we can reach you about the order.");
      return;
    }
    setBusy(true);
    const { data, error: fnError } = await supabase.functions.invoke("create-order", {
      body: { skus: items.map((i) => i.id), telegram: telegram.trim(), returnOrigin: window.location.origin },
    });
    setBusy(false);
    if (fnError) {
      let message = "We couldn't start checkout. Please try again.";
      if (fnError instanceof FunctionsHttpError) {
        try { message = (await fnError.context.json()).error ?? message; } catch { /* keep default */ }
      }
      setError(message);
      return;
    }
    if (data?.paymentUrl) window.location.assign(data.paymentUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[520px] max-h-[90dvh] overflow-y-auto overscroll-contain p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Checkout — ${total}</DialogTitle>
          <DialogDescription>
            Guest checkout is available for approved, in-stock items. Pay through a verified crypto invoice or arrange payment privately on Telegram. Orders are confirmed only after receipt is verified.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="payment" className="min-w-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment" className="min-h-11">Payment options</TabsTrigger>
            <TabsTrigger value="tutorial" className="min-h-11">Payment tutorial</TabsTrigger>
          </TabsList>
          <TabsContent value="payment" className="space-y-5 pt-3">
        <h3 className="font-semibold text-primary">Verified crypto checkout</h3>
        {checking || available === null ? (
          <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Checking checkout availability…</p>
        ) : configured === false || available === false ? (
          <div className="surface-elevated rounded-lg p-4 space-y-3">
            <p className="text-sm text-muted-foreground">{available === false ? "Online checkout is unavailable for one or more items in your cart. Contact us on Telegram about availability." : "Online crypto checkout opens soon. Contact us on Telegram about availability."}</p>
            <Button asChild className="w-full min-h-11"><a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"><Send className="w-4 h-4 mr-2" />Message us on Telegram</a></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {coins && coins.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Accepted coins</p>
                <div className="flex flex-wrap gap-1.5">
                  {coins.slice(0, 24).map((c) => <span key={c} className="rounded-md border border-border px-2 py-0.5 text-xs uppercase text-muted-foreground">{c}</span>)}
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="checkout-telegram">Your Telegram username</Label>
              <Input id="checkout-telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" autoComplete="off" />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button onClick={startCheckout} disabled={busy || configured === null || available !== true || items.length === 0} className="w-full min-h-11 bg-gradient-cta glow-accent">
              {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating secure invoice…</> : "Continue to crypto payment"}
            </Button>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 shrink-0 text-accent" />
              Questions? Reach us only on <a className="underline" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Telegram</a>. We never ask for wallet keys or seed phrases.
            </p>
          </div>
        )}
          <ManualPaymentOptions />
          </TabsContent>
          <TabsContent value="tutorial" className="space-y-4 pt-3">
            <h3 className="font-semibold">Cash App Bitcoin payment guide</h3>
            <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted">
              <iframe className="h-full w-full" src="https://www.youtube.com/embed/fDjDH_WAvYI?start=4&rel=0" title="Cash App Bitcoin payment tutorial" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <p className="text-sm text-muted-foreground">This video covers buying and sending Bitcoin with Cash App, not Venmo. Confirm your order, recipient, and amount privately before paying.</p>
            <Button asChild variant="outline" className="w-full"><a href="https://www.youtube.com/watch?v=fDjDH_WAvYI&t=4s" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
