import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetail {
  id: string;
  telegram: string;
  status: string;
  total_usd: number;
  provider: string;
  pay_currency: string | null;
  fulfillment_status: string;
  fulfillment_note: string | null;
  fulfilled_at: string | null;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  sku: string;
  name: string;
  price_usd: number;
}

const AdminFulfillment = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin")
      .then(({ data }) => setIsAdmin((data ?? []).length > 0));
  }, [user, authLoading]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: o }, { data: it }] = await Promise.all([
      supabase.from("orders").select("id,telegram,status,total_usd,provider,pay_currency,fulfillment_status,fulfillment_note,fulfilled_at,created_at").eq("id", id).maybeSingle(),
      supabase.from("order_items").select("id,sku,name,price_usd").eq("order_id", id),
    ]);
    setOrder((o as OrderDetail) ?? null);
    setItems((it ?? []) as OrderItemRow[]);
    if (o?.fulfillment_note) setNote(o.fulfillment_note);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, id]);

  const adminAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    setBusy(false);
    if (error || data?.error) {
      toast({ title: "Action failed", description: data?.error ?? "Please try again.", variant: "destructive" });
      return false;
    }
    await load();
    return true;
  };

  if (authLoading || isAdmin === null || loading) {
    return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user || !isAdmin || !order) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-2">{!order && isAdmin ? "Order not found" : "Admins only"}</h1>
          <Button asChild variant="outline" className="mt-4 min-h-11"><Link to="/admin"><ArrowLeft className="w-4 h-4 mr-2" />Back to admin panel</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const buyerHandle = order.telegram.replace(/^@/, "");
  const detailsText = `Your CpnCreditBoost order ${order.id.slice(0, 8)} is confirmed.\n\n${items.map((i) => `• ${i.name} — $${i.price_usd}`).join("\n")}\n\n${note}`;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <Button asChild variant="ghost" className="mb-4 min-h-11"><Link to="/admin"><ArrowLeft className="w-4 h-4 mr-2" />All orders</Link></Button>
        <h1 className="text-3xl font-bold mb-6">Order fulfillment</h1>

        <div className="surface-elevated rounded-lg p-5 space-y-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm">{order.id}</span>
            <Badge>{order.status}</Badge>
            <Badge variant="outline">{order.fulfillment_status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Buyer: <a className="underline" href={`https://t.me/${buyerHandle}`} target="_blank" rel="noopener noreferrer">@{buyerHandle}</a>
            {" · "}${order.total_usd} via {order.provider}{order.pay_currency ? ` (${order.pay_currency.toUpperCase()})` : ""}
            {" · "}{new Date(order.created_at).toLocaleString()}
          </p>
          <ul className="text-sm space-y-1">
            {items.map((item) => <li key={item.id}>• {item.name} — ${item.price_usd}</li>)}
          </ul>
        </div>

        {!["paid", "overpaid"].includes(order.status) && (
          <div className="surface-elevated rounded-lg p-5 mb-6 space-y-3">
            <p className="text-sm text-muted-foreground">This order is <strong>{order.status}</strong>. If you confirmed the payment arrived (for example a Zelle or Venmo transfer), mark it paid:</p>
            <Button className="min-h-11" disabled={busy} onClick={() => adminAction({ action: "transition_order", orderId: order.id, to: "paid", reason: "owner confirmed manual payment" })}>
              {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Mark as paid
            </Button>
          </div>
        )}

        {["paid", "overpaid"].includes(order.status) && (
          <div className="surface-elevated rounded-lg p-5 space-y-4">
            <h2 className="text-lg font-semibold">Send tradeline details to the buyer</h2>
            <div className="space-y-1.5">
              <Label htmlFor="fulfillment-note">Tradeline details / delivery note</Label>
              <Textarea id="fulfillment-note" value={note} onChange={(e) => setNote(e.target.value)} rows={5}
                placeholder="e.g. Card issuer, card ID, reporting date, and any instructions for the buyer" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="min-h-11" disabled={busy || note.trim().length === 0 || order.fulfillment_status === "fulfilled"}
                onClick={() => adminAction({ action: "fulfill_order", orderId: order.id, note: note.trim() })}>
                {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {order.fulfillment_status === "fulfilled" ? "Fulfilled" : "Mark fulfilled"}
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <a href={`https://t.me/${buyerHandle}?text=${encodeURIComponent(detailsText)}`} target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4 mr-2" />Send details via Telegram
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The Telegram button opens a chat with the buyer pre-filled with the order details — you press send there. The bot can't message buyers first unless they've messaged it.
              {order.fulfilled_at && ` Fulfilled ${new Date(order.fulfilled_at).toLocaleString()}.`}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminFulfillment;
