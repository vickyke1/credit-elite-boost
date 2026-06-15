import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatUsd } from "@/lib/checkout/schema";
import bitcoinQR from "@/assets/bitcoin-qr.jpg";
import { Copy, Loader2, CheckCircle2, Clock } from "lucide-react";

interface OrderData {
  order: {
    orderNumber: string;
    customerName: string;
    paymentMethod: string;
    paymentStatus: string;
    deliveryStatus: string;
    totalCents: number;
    createdAt: string;
  };
  items: { id: string; name: string; unit_price_cents: number; quantity: number }[];
  bitcoin: { wallet_address: string; expected_amount_btc: number | null; expires_at: string } | null;
  deliveries: { id: string; content_type: string; content: string }[];
  instructions: { cashappHandle: string | null; venmoHandle: string | null; cardGatewayConfigured: boolean };
}

const statusVariant = (s: string) =>
  s === "paid" ? "bg-accent text-accent-foreground"
    : s === "awaiting_review" ? "bg-warning text-background"
    : "bg-muted text-muted-foreground";

const OrderConfirmation = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    const { data: res, error } = await supabase.functions.invoke("get-order", {
      body: { accessToken: token },
    });
    if (error || res?.error) {
      setData(null);
    } else {
      setData(res as OrderData);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const copyAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      toast({ title: "Copied", description: "Bitcoin address copied." });
    } catch {
      toast({ title: "Copy failed", description: "Copy the address manually.", variant: "destructive" });
    }
  };

  const submitReference = async () => {
    if (!reference.trim()) return;
    setSubmitting(true);
    const { data: res, error } = await supabase.functions.invoke("submit-payment-reference", {
      body: { accessToken: token, reference: reference.trim() },
    });
    setSubmitting(false);
    if (error || res?.error) {
      toast({ title: "Error", description: res?.error ?? "Could not submit.", variant: "destructive" });
      return;
    }
    toast({ title: "Submitted", description: "Your payment reference is now under review." });
    setReference("");
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex min-h-[60vh] items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Order not found</h1>
            <p className="mb-8 text-muted-foreground">This order link is invalid or has expired.</p>
            <Button asChild><Link to="/tradelines">Back to store</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { order, items, bitcoin, deliveries, instructions } = data;
  const isPaid = order.paymentStatus === "paid";

  return (
    <>
      <SEOHead title={`Order ${order.orderNumber} | CPN Credit Boost`} description="Your order details and payment instructions." />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto max-w-3xl px-6 py-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Order {order.orderNumber}</h1>
                <p className="text-sm text-muted-foreground">
                  Placed {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className={statusVariant(order.paymentStatus)}>Payment: {order.paymentStatus.replace("_", " ")}</Badge>
                <Badge className="bg-muted text-muted-foreground">Delivery: {order.deliveryStatus.replace("_", " ")}</Badge>
              </div>
            </div>

            {/* Items */}
            <section className="mb-6 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Items</h2>
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{it.name} × {it.quantity}</span>
                    <span className="font-medium text-foreground">{formatUsd(it.unit_price_cents * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-accent">{formatUsd(order.totalCents)}</span>
              </div>
            </section>

            {/* Delivered content (only when paid) */}
            {isPaid && deliveries.length > 0 && (
              <section className="mb-6 rounded-xl border border-accent bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Your delivered content
                </h2>
                <ul className="space-y-3">
                  {deliveries.map((d) => (
                    <li key={d.id} className="rounded-lg bg-surface-elevated p-4 text-sm">
                      {d.content_type === "url" ? (
                        <a href={d.content} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                          Download / access your content
                        </a>
                      ) : (
                        <pre className="whitespace-pre-wrap break-words text-muted-foreground">{d.content}</pre>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Payment instructions */}
            {!isPaid && (
              <section className="mb-6 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-1 text-lg font-semibold text-foreground">Complete your payment</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Always include your order number <strong className="text-foreground">{order.orderNumber}</strong> with your payment.
                </p>

                {order.paymentMethod === "bitcoin" && bitcoin && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col items-center rounded-lg bg-surface-elevated p-4">
                      <img src={bitcoinQR} alt="Bitcoin payment QR code" className="h-44 w-44 rounded-lg border border-border" />
                      <p className="mt-2 text-xs text-muted-foreground">Scan to pay</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Send to this address</Label>
                        <div className="flex gap-2">
                          <Input readOnly value={bitcoin.wallet_address} className="font-mono text-xs" />
                          <Button variant="outline" size="icon" onClick={() => copyAddress(bitcoin.wallet_address)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Amount:{" "}
                        <strong className="text-foreground">
                          {bitcoin.expected_amount_btc ? `${bitcoin.expected_amount_btc} BTC` : `${formatUsd(order.totalCents)} of BTC`}
                        </strong>
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> Pay before {new Date(bitcoin.expires_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {order.paymentMethod === "cashapp" && (
                  <p className="text-sm text-muted-foreground">
                    Send {formatUsd(order.totalCents)} via Cash App to{" "}
                    <strong className="text-foreground">{instructions.cashappHandle ?? "(handle pending configuration)"}</strong>{" "}
                    and put <strong className="text-foreground">{order.orderNumber}</strong> in the payment note. Your
                    order is marked paid only after we manually verify it.
                  </p>
                )}

                {order.paymentMethod === "venmo" && (
                  <p className="text-sm text-muted-foreground">
                    Send {formatUsd(order.totalCents)} via Venmo to{" "}
                    <strong className="text-foreground">{instructions.venmoHandle ?? "(handle pending configuration)"}</strong>{" "}
                    and put <strong className="text-foreground">{order.orderNumber}</strong> in the payment note. Your
                    order is marked paid only after we manually verify it.
                  </p>
                )}

                {order.paymentMethod === "card" && (
                  <p className="text-sm text-muted-foreground">
                    {instructions.cardGatewayConfigured
                      ? "You will be redirected to our secure card processor."
                      : "Card payments are not yet enabled. Please choose Bitcoin, Cash App, or Venmo, or contact support."}
                  </p>
                )}

                {/* Reference submission */}
                <div className="mt-5 border-t border-border pt-4">
                  <Label htmlFor="reference" className="text-sm">
                    {order.paymentMethod === "bitcoin" ? "Paste your transaction hash" : "Paste your payment confirmation / sender handle"}
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Reference…" />
                    <Button onClick={submitReference} disabled={submitting || !reference.trim()}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitting moves your order to manual review. We never auto-confirm manual payments.
                  </p>
                </div>
              </section>
            )}

            {/* YouTube payment guide */}
            <section className="mb-10 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">How to Complete Your Payment</h2>
              <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/fDjDH_WAvYI?start=4"
                  title="How to Complete Your Payment"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>

            <p className="text-center text-sm text-muted-foreground">
              Save this page link to check your order status anytime, or view{" "}
              <Link to="/orders" className="text-primary underline">your order history</Link>.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default OrderConfirmation;
