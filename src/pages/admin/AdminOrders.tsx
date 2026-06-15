import { useEffect, useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/integrations/supabase/db";
import { formatUsd } from "@/lib/checkout/schema";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string | null;
  payment_method: string;
  payment_status: string;
  delivery_status: string;
  total_cents: number;
  admin_notes: string | null;
  created_at: string;
}

const PAYMENT_STATES = ["pending", "awaiting_review", "paid", "failed", "expired", "refunded"];
const DELIVERY_STATES = ["not_started", "processing", "delivered"];

const AdminOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, { items: { id: string; name: string; quantity: number; unit_price_cents: number }[] }>>({});
  const [deliveryContent, setDeliveryContent] = useState("");
  const [notes, setNotes] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    let query = db.from("orders").select("*").order("created_at", { ascending: false });
    if (paymentFilter !== "all") query = query.eq("payment_status", paymentFilter);
    if (deliveryFilter !== "all") query = query.eq("delivery_status", deliveryFilter);
    const { data } = await query;
    setOrders((data as AdminOrder[]) ?? []);
    setLoading(false);
  }, [paymentFilter, deliveryFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const toggle = async (order: AdminOrder) => {
    if (expanded === order.id) {
      setExpanded(null);
      return;
    }
    setExpanded(order.id);
    setNotes(order.admin_notes ?? "");
    setDeliveryContent("");
    if (!detail[order.id]) {
      const { data: items } = await db.from("order_items").select("*").eq("order_id", order.id);
      setDetail((d) => ({ ...d, [order.id]: { items: (items as never) ?? [] } }));
    }
  };

  const markPaid = async (order: AdminOrder) => {
    const { error } = await db.from("orders").update({ payment_status: "paid", delivery_status: "processing" }).eq("id", order.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Marked paid", description: order.order_number });
    loadOrders();
  };

  const saveNotes = async (order: AdminOrder) => {
    const { error } = await db.from("orders").update({ admin_notes: notes }).eq("id", order.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Notes saved", description: order.order_number });
  };

  const deliver = async (order: AdminOrder) => {
    if (!deliveryContent.trim()) return;
    const isUrl = /^https?:\/\//i.test(deliveryContent.trim());
    const { error: dErr } = await db.from("order_deliveries").insert({
      order_id: order.id,
      content_type: isUrl ? "url" : "text",
      content: deliveryContent.trim(),
      delivered_by: user?.id ?? null,
    });
    if (dErr) return toast({ title: "Error", description: dErr.message, variant: "destructive" });
    await db.from("orders").update({ delivery_status: "delivered" }).eq("id", order.id);
    toast({ title: "Delivered", description: `Content attached to ${order.order_number}` });
    setDeliveryContent("");
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-10">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Admin · Orders</h1>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <Label className="text-xs">Payment status</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {PAYMENT_STATES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Delivery status</Label>
              <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {DELIVERY_STATES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No orders match these filters.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="rounded-xl border border-border bg-card">
                  <button
                    onClick={() => toggle(order)}
                    className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name} · {order.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-muted text-muted-foreground">{order.payment_method}</Badge>
                      <Badge className="bg-muted text-muted-foreground">{order.payment_status.replace("_", " ")}</Badge>
                      <Badge className="bg-muted text-muted-foreground">{order.delivery_status.replace("_", " ")}</Badge>
                      <span className="font-bold text-accent">{formatUsd(order.total_cents)}</span>
                      {expanded === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="space-y-5 border-t border-border p-4">
                      {/* Customer */}
                      <div className="text-sm text-muted-foreground">
                        <p><span className="text-foreground">Phone:</span> {order.phone ?? "—"}</p>
                        <p><span className="text-foreground">Placed:</span> {new Date(order.created_at).toLocaleString()}</p>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Items</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {(detail[order.id]?.items ?? []).map((it) => (
                            <li key={it.id} className="flex justify-between">
                              <span>{it.name} × {it.quantity}</span>
                              <span>{formatUsd(it.unit_price_cents * it.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => markPaid(order)} disabled={order.payment_status === "paid"}>
                          Mark paid &amp; verify payment
                        </Button>
                      </div>

                      {/* Delivery */}
                      <div>
                        <Label className="text-sm">Deliver content (paste text or a https:// link)</Label>
                        <Textarea
                          value={deliveryContent}
                          onChange={(e) => setDeliveryContent(e.target.value)}
                          rows={3}
                          placeholder="Tradeline confirmation details, or a secure download URL…"
                        />
                        <Button size="sm" className="mt-2" onClick={() => deliver(order)} disabled={!deliveryContent.trim()}>
                          Mark delivered
                        </Button>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label className="text-sm">Admin notes</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => saveNotes(order)}>
                          Save notes
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrders;
