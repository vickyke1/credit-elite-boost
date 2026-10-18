import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldAlert, Package, MessageSquare, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const statusColor = (status: string) =>
  status === "paid" || status === "overpaid" ? "default" :
  status === "failed" || status === "expired" ? "destructive" : "secondary";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [messages, setMessages] = useState<TelegramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin")
      .then(({ data }) => setIsAdmin((data ?? []).length > 0));
  }, [user, authLoading]);

  const load = async () => {
    setLoading(true);
    const [o, i, m] = await Promise.all([
      supabase.from("orders").select("id,telegram,status,total_usd,provider,pay_currency,fulfillment_status,created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("pricing_inquiries").select("id,name,telegram,service,message,status,created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("telegram_messages").select("update_id,text,inquiry_id,created_at").order("created_at", { ascending: false }).limit(50),
    ]);
    setOrders((o.data ?? []) as OrderRow[]);
    setInquiries((i.data ?? []) as InquiryRow[]);
    setMessages((m.data ?? []) as TelegramRow[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

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
        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="min-h-11"><Package className="w-4 h-4 mr-2" />Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="inquiries" className="min-h-11"><Inbox className="w-4 h-4 mr-2" />Inquiries ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="messages" className="min-h-11"><MessageSquare className="w-4 h-4 mr-2" />Telegram ({messages.length})</TabsTrigger>
          </TabsList>

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
