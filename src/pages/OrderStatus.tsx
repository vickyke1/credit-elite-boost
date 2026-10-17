import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const labels: Record<string, string> = {
  pending: "Waiting for payment confirmation. This page updates automatically.",
  paid: "Payment verified. We'll contact you on Telegram shortly.",
  overpaid: "Payment verified (more than the invoice). We'll contact you on Telegram about the difference.",
  underpaid: "Partial payment received. Please complete the remaining amount on the payment page.",
  expired: "This invoice expired. You can start a new checkout.",
  failed: "This payment failed. You can start a new checkout or message us on Telegram.",
};

const OrderStatus = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const load = async () => {
      const { data, error } = await supabase.functions.invoke("order-status", { body: { orderId: id } });
      if (error || !data?.status) { setMissing(true); return; }
      setStatus(data.status);
      setTotal(Number(data.total_usd));
      if (data.status === "pending" || data.status === "underpaid") timer = window.setTimeout(load, 10000);
    };
    load();
    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Order status | CpnCreditBoost</title><meta name="robots" content="noindex" /></Helmet>
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-16 max-w-xl">
        <h1 className="text-3xl font-bold mb-4">Order status</h1>
        <div className="surface-elevated rounded-lg p-6 space-y-3">
          {missing ? <p className="text-muted-foreground">We couldn't find this order.</p> : status === null ? <p className="text-muted-foreground">Loading…</p> : (
            <>
              <p className="text-sm uppercase tracking-wide text-accent">{status}</p>
              {total !== null && <p className="text-lg font-semibold">${total}</p>}
              <p className="text-muted-foreground">{labels[status] ?? status}</p>
            </>
          )}
          <Button asChild variant="outline" className="min-h-11"><a href="https://t.me/cpncreditboost" target="_blank" rel="noopener noreferrer">Message us on Telegram</a></Button>
          <Button asChild variant="ghost" className="min-h-11 ml-2"><Link to="/tradelines">Back to tradelines</Link></Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderStatus;
