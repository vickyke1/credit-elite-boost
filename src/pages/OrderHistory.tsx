import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/integrations/supabase/db";
import { formatUsd } from "@/lib/checkout/schema";
import { Loader2 } from "lucide-react";

interface OrderRow {
  id: string;
  order_number: string;
  access_token: string;
  payment_status: string;
  delivery_status: string;
  total_cents: number;
  created_at: string;
}

const OrderHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      // RLS ensures users only see their own orders.
      const { data } = await db
        .from("orders")
        .select("id, order_number, access_token, payment_status, delivery_status, total_cents, created_at")
        .order("created_at", { ascending: false });
      setOrders((data as OrderRow[]) ?? []);
      setLoading(false);
    };
    if (!authLoading) loadOrders();
  }, [user, authLoading]);

  return (
    <>
      <SEOHead title="Order History | CPN Credit Boost" description="View your orders, payment status, and delivered content." />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto max-w-3xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">Order history</h1>

            {/* Guest lookup */}
            <section className="mb-8 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Look up an order</h2>
              <p className="mb-3 text-sm text-muted-foreground">
                Checked out as a guest? Paste the order link token from your confirmation email.
              </p>
              <div className="flex gap-2">
                <Label htmlFor="token" className="sr-only">Order token</Label>
                <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Order access token" />
                <Button onClick={() => token.trim() && navigate(`/order/${token.trim()}`)} disabled={!token.trim()}>
                  View order
                </Button>
              </div>
            </section>

            {/* Logged-in list */}
            {user ? (
              loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : orders.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">You have no orders yet.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <Link
                        to={`/order/${o.access_token}`}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{o.order_number}</p>
                          <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-muted text-muted-foreground">{o.payment_status.replace("_", " ")}</Badge>
                          <Badge className="bg-muted text-muted-foreground">{o.delivery_status.replace("_", " ")}</Badge>
                          <span className="font-bold text-accent">{formatUsd(o.total_cents)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary underline">Sign in</Link> to see all your orders in one place.
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default OrderHistory;
