import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldAlert, Package, MessageSquare, Inbox, Store, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyerFollowUp from "@/components/BuyerFollowUp";
import { followUpDraft, telegramChatUrl, takeNewPaidOrders } from "@/lib/buyerTelegram";

interface OrderRow {
  id: string;
  telegram: string;
  status: string;
  total_usd: number;
  provider: string;
  pay_currency: string | null;
  fulfillment_status: string;
  created_at: string;
}

interface InquiryRow {
  id: string;
  name: string;
  telegram: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}

interface TelegramRow {
  update_id: number;
  text: string | null;
  inquiry_id: string | null;
  created_at: string;
}

interface ProductRow {
  sku: string;
  name: string;
  price_usd: number;
  inventory: number | null;
  compliance_status: string;
}

const statusColor = (status: string) =>
  status === "paid" || status === "overpaid" ? "default" :
  status === "failed" || status === "expired" ? "destructive" : "secondary";

interface BuyerSummary {
  telegram: string;
  orders: OrderRow[];
  totalSpent: number;
  paidCount: number;
  lastOrderAt: string;
}

const buildBuyers = (orders: OrderRow[]): BuyerSummary[] => {
  const map = new Map<string, OrderRow[]>();
  for (const o of orders) {
    const key = o.telegram.trim().replace(/^@/, "").toLowerCase();
    map.set(key, [...(map.get(key) ?? []), o]);
  }
  return [...map.entries()].map(([telegram, list]) => ({
    telegram,
    orders: list,
    totalSpent: list.filter((o) => o.status === "paid" || o.status === "overpaid").reduce((s, o) => s + Number(o.total_usd), 0),
    paidCount: list.filter((o) => o.status === "paid" || o.status === "overpaid").length,
    lastOrderAt: list[0]?.created_at ?? "",
  })).sort((a, b) => b.totalSpent - a.totalSpent);
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [messages, setMessages] = useState<TelegramRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [newProduct, setNewProduct] = useState({ sku: "", name: "", priceUsd: "", inventory: "1" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [newPayments, setNewPayments] = useState<OrderRow[]>([]);
  const [autoChat, setAutoChat] = useState(false);
  const chatWindow = useRef<Window | null>(null);
  const autoChatRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin")
      .then(({ data }) => setIsAdmin((data ?? []).length > 0));
  }, [user, authLoading]);

  const load = async () => {
    setLoading(true);
    const [o, i, m, p] = await Promise.all([
      supabase.from("orders").select("id,telegram,status,total_usd,provider,pay_currency,fulfillment_status,created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("pricing_inquiries").select("id,name,telegram,service,message,status,created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("telegram_messages").select("update_id,text,inquiry_id,created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("checkout_products").select("sku,name,price_usd,inventory,compliance_status").order("created_at", { ascending: false }).limit(100),
    ]);
    setOrders((o.data ?? []) as OrderRow[]);
    setInquiries((i.data ?? []) as InquiryRow[]);
    setMessages((m.data ?? []) as TelegramRow[]);
    setProducts((p.data ?? []) as ProductRow[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || !user) return;
    let disposed = false;
    let checking = false;
    const since = new Date().toISOString();
    const seen = new Set<string>();
    const checkPayments = async () => {
      if (checking) return;
      checking = true;
      try {
        // Polling also works when orders are not in a Realtime publication.
        const { data, error } = await supabase.from("orders")
          .select("id,telegram,status,total_usd,provider,pay_currency,fulfillment_status,created_at")
          .in("status", ["paid", "overpaid"]).gte("updated_at", since).order("updated_at", { ascending: true });
        if (disposed || error) return;
        const confirmed = takeNewPaidOrders((data ?? []) as OrderRow[], seen) as OrderRow[];
        if (!confirmed.length) return;
        setNewPayments((previous) => [...previous, ...confirmed]);
        setActiveTab("buyers");
        setOrders((previous) => {
          const merged = new Map(previous.map((order) => [order.id, order]));
          for (const order of confirmed) merged.set(order.id, order);
          return [...merged.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
        });
        const latest = confirmed[confirmed.length - 1];
        const url = latest ? telegramChatUrl(latest.telegram, followUpDraft(latest)) : null;
        if (autoChatRef.current && url) {
          const target = chatWindow.current;
          if (target && !target.closed) {
            try { target.location.href = url; } catch {
              autoChatRef.current = false;
              setAutoChat(false);
              toast({ title: "Buyer payment confirmed", description: "Open the buyer’s Telegram chat below." });
            }
          } else {
            autoChatRef.current = false;
            setAutoChat(false);
            toast({ title: "Telegram tab closed", description: "Open the buyer’s Telegram chat below." });
          }
        } else {
          toast({ title: "Buyer payment confirmed", description: "A new paid order is ready for follow-up." });
        }
      } finally { checking = false; }
    };
    const timer = window.setInterval(() => { void checkPayments(); }, 10000);
    return () => { disposed = true; window.clearInterval(timer); autoChatRef.current = false; };
  }, [isAdmin, user?.id, toast]);

  const toggleAutoChat = () => {
    if (autoChat) {
      autoChatRef.current = false;
      setAutoChat(false);
      return;
    }
    // Open synchronously on the owner's click, not on an asynchronous payment event.
    const target = window.open("about:blank", "buyer-telegram-follow-up");
    if (!target) {
      toast({ title: "Telegram tab blocked", description: "Allow pop-ups for this site, or use Open Telegram chat.", variant: "destructive" });
      return;
    }
    target.opener = null;
    target.document.title = "CpnCreditBoost — Awaiting confirmed payment";
    target.document.body.textContent = "Awaiting a confirmed CpnCreditBoost payment.";
    chatWindow.current = target;
    autoChatRef.current = true;
    setAutoChat(true);
  };

  const adminAction = async (body: Record<string, unknown>, busyKey: string) => {
    setBusy(busyKey);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Action failed", description: data?.error ?? "Please try again.", variant: "destructive" });
      return false;
    }
    await load();
    return true;
  };

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <main className="container mx-auto px-4 py-24 text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admins only</h1>
          <p className="text-muted-foreground">This area is restricted to site administrators.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="min-h-11"><Package className="w-4 h-4 mr-2" />Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="buyers" className="min-h-11"><Users className="w-4 h-4 mr-2" />Buyers ({buildBuyers(orders).length})</TabsTrigger>
            <TabsTrigger value="products" className="min-h-11"><Store className="w-4 h-4 mr-2" />Products ({products.length})</TabsTrigger>
            <TabsTrigger value="inquiries" className="min-h-11"><Inbox className="w-4 h-4 mr-2" />Inquiries ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="messages" className="min-h-11"><MessageSquare className="w-4 h-4 mr-2" />Telegram ({messages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <form
              className="surface-elevated rounded-lg p-4 mb-4 grid gap-3 sm:grid-cols-[120px_1fr_120px_100px_auto]"
              onSubmit={async (e) => {
                e.preventDefault();
                const priceUsd = Number(newProduct.priceUsd);
                const inventory = Number(newProduct.inventory);
                if (!newProduct.sku.trim() || !newProduct.name.trim() || !Number.isFinite(priceUsd) || priceUsd <= 0 || !Number.isInteger(inventory) || inventory < 0) {
                  toast({ title: "Check the product details", description: "SKU, name, a positive price and a whole-number stock count are required.", variant: "destructive" });
                  return;
                }
                const ok = await adminAction({ action: "upsert_product", sku: newProduct.sku.trim(), name: newProduct.name.trim(), priceUsd, inventory }, "new-product");
                if (ok) {
                  toast({ title: "Product saved", description: `${newProduct.sku.trim()} now appears in the Telegram /shop list.` });
                  setNewProduct({ sku: "", name: "", priceUsd: "", inventory: "1" });
                }
              }}
            >
              <Input placeholder="SKU (e.g. TL0030)" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="min-h-11" aria-label="Product SKU" />
              <Input placeholder="Name (e.g. Chase Sapphire $50,000 limit, 12y age)" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="min-h-11" aria-label="Product name" />
              <Input placeholder="Price USD" type="number" min="1" step="0.01" value={newProduct.priceUsd} onChange={(e) => setNewProduct({ ...newProduct, priceUsd: e.target.value })} className="min-h-11" aria-label="Price in USD" />
              <Input placeholder="Stock" type="number" min="0" step="1" value={newProduct.inventory} onChange={(e) => setNewProduct({ ...newProduct, inventory: e.target.value })} className="min-h-11" aria-label="Stock count" />
              <Button type="submit" className="min-h-11" disabled={busy === "new-product"}>Add product</Button>
            </form>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : products.length === 0 ? <p className="text-muted-foreground">No products yet.</p> : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.sku} className="surface-elevated rounded-lg p-4 flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.sku} · {p.inventory ?? 0} in stock</p>
                    </div>
                    <span className="font-semibold">${p.price_usd}</span>
                    <Badge variant={p.compliance_status === "approved" ? "default" : "secondary"}>{p.compliance_status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : orders.length === 0 ? <p className="text-muted-foreground">No orders yet.</p> : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="surface-elevated rounded-lg p-4 flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm truncate">{order.id}</p>
                      <p className="text-sm text-muted-foreground">@{order.telegram} · {order.provider}{order.pay_currency ? ` · ${order.pay_currency.toUpperCase()}` : ""} · {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className="font-semibold">${order.total_usd}</span>
                    <Badge variant={statusColor(order.status)}>{order.status}</Badge>
                    <Badge variant="outline">{order.fulfillment_status}</Badge>
                    <Button asChild size="sm" className="min-h-11">
                      <Link to={`/admin/orders/${order.id}`}>Manage</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="buyers">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold">Buyer follow-up</h2>
              <Button variant={autoChat ? "secondary" : "outline"} className="min-h-11" aria-pressed={autoChat} onClick={toggleAutoChat}>
                <MessageSquare className="w-4 h-4 mr-2" />{autoChat ? "Stop automatic chats" : "Enable automatic Telegram chats"}
              </Button>
            </div>
            {newPayments.length > 0 && <section aria-label="New confirmed payments" aria-live="polite" className="mb-4 border-l-4 border-primary pl-4 space-y-3">
              <h3 className="font-semibold">New confirmed payments</h3>
              {newPayments.map((order) => {
                const url = telegramChatUrl(order.telegram, followUpDraft(order));
                return <div key={order.id} className="flex flex-wrap items-center gap-3 text-sm">
                  <span>@{order.telegram.replace(/^@/, "")} · ${order.total_usd} · {order.id.slice(0, 8)}</span>
                  {url && <Button asChild variant="outline" size="sm" className="min-h-11"><a href={url} target="_blank" rel="noopener noreferrer">Open buyer chat</a></Button>}
                  <Button variant="ghost" size="sm" className="min-h-11" onClick={() => setNewPayments((previous) => previous.filter((payment) => payment.id !== order.id))}>Dismiss</Button>
                </div>;
              })}
            </section>}
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : buildBuyers(orders).length === 0 ? <p className="text-muted-foreground">No buyers yet.</p> : (
              <div className="space-y-3">
                {buildBuyers(orders).map((buyer) => (
                  <div key={buyer.telegram} className="surface-elevated rounded-lg p-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">@{buyer.telegram}</p>
                      <Badge variant="default">${buyer.totalSpent.toLocaleString()} paid</Badge>
                      <Badge variant="secondary">{buyer.paidCount}/{buyer.orders.length} orders paid</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">Last order {new Date(buyer.lastOrderAt).toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                      {buyer.orders.map((o) => (
                        <div key={o.id} className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}</span>
                          <span>${o.total_usd}</span>
                          <Badge variant={statusColor(o.status)}>{o.status}</Badge>
                          <Badge variant="outline">{o.fulfillment_status}</Badge>
                          <Button asChild size="sm" variant="ghost" className="min-h-11">
                            <Link to={`/admin/orders/${o.id}`}>Manage</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                    {buyer.orders[0] && <BuyerFollowUp key={`${buyer.telegram}-${buyer.orders[0].status}`} order={buyer.orders[0]} />}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inquiries">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : inquiries.length === 0 ? <p className="text-muted-foreground">No inquiries yet.</p> : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="surface-elevated rounded-lg p-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{inq.name} <span className="text-muted-foreground">(@{inq.telegram})</span></p>
                      <Badge variant="secondary">{inq.service}</Badge>
                      <Badge variant="outline">{inq.status}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{inq.message}</p>
                    <div className="flex flex-wrap gap-2">
                      {(["read", "replied", "archived"] as const).map((s) => (
                        <Button key={s} size="sm" variant="outline" className="min-h-11" disabled={busy === inq.id || inq.status === s}
                          onClick={() => adminAction({ action: "update_inquiry", inquiryId: inq.id, status: s }, inq.id)}>
                          Mark {s}
                        </Button>
                      ))}
                      <Button asChild size="sm" className="min-h-11">
                        <a href={`https://t.me/${inq.telegram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer">Open Telegram chat</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : messages.length === 0 ? <p className="text-muted-foreground">No Telegram replies stored yet.</p> : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.update_id} className="surface-elevated rounded-lg p-4">
                    <p className="text-sm">{msg.text ?? "(no text)"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleString()}{msg.inquiry_id ? ` · linked to inquiry ${msg.inquiry_id.slice(0, 8)}` : ""}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
