import { useMemo } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  getTradelineBySlug,
  getTradelineByCardId,
  type Tradeline,
} from "@/utils/tradelineData";
import {
  ChevronLeft,
  ShoppingCart,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  Building2,
  Clock,
  BadgeCheck,
  Wifi,
} from "lucide-react";

const CreditCardVisual = ({ tradeline }: { tradeline: Tradeline }) => (
  <div
    className="relative aspect-[1.6/1] w-full rounded-2xl p-6 text-white shadow-2xl overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(220 40% 18%) 55%, hsl(190 95% 30%) 100%)",
    }}
    aria-hidden="true"
  >
    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute right-10 bottom-0 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />

    <div className="relative flex h-full flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-lg font-semibold tracking-wide">{tradeline.bankName}</span>
        <Wifi className="h-6 w-6 rotate-90 opacity-80" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-9 w-12 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-inner" />
        <div className="font-mono text-lg tracking-[0.2em] opacity-90">
          1234 5678 9012 {tradeline.cardId.slice(-4).padStart(4, "0")}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-60">Card Holder</div>
          <div className="text-sm font-medium tracking-wide">AUTHORIZED USER</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest opacity-60">Limit</div>
          <div className="text-sm font-semibold">${tradeline.creditLimit.toLocaleString()}</div>
        </div>
      </div>
    </div>
  </div>
);

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-semibold text-foreground">{value}</div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get("card_id") ?? undefined;
  const { addToCart } = useCart();
  const { toast } = useToast();

  const tradeline = useMemo(() => {
    if (slug) {
      const bySlug = getTradelineBySlug(slug);
      if (bySlug) return bySlug;
    }
    if (cardId) {
      return getTradelineByCardId(cardId);
    }
    return undefined;
  }, [slug, cardId]);

  if (!tradeline) {
    return <Navigate to="/tradelines" replace />;
  }

  const handleAddToCart = () => {
    addToCart({
      id: tradeline.id,
      type: "tradeline",
      name: `${tradeline.bankName} Tradeline ${tradeline.cardId}`,
      price: tradeline.price,
      bankName: tradeline.bankName,
      cardId: tradeline.cardId,
      creditLimit: tradeline.creditLimit,
      age: tradeline.age,
    });
    toast({
      title: "Added to Cart!",
      description: `${tradeline.bankName} tradeline ${tradeline.cardId} added to your cart`,
    });
  };

  const isSoldOut = tradeline.status === "sold-out";
  const title = `$${tradeline.creditLimit.toLocaleString()} Seasoned ${tradeline.bankName} Tradeline ${tradeline.cardId}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: tradeline.description,
    sku: tradeline.cardId,
    brand: { "@type": "Brand", name: tradeline.bankName },
    offers: {
      "@type": "Offer",
      price: tradeline.price,
      priceCurrency: "USD",
      availability: isSoldOut
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${title} | CPN Credit Boost`}
        description={tradeline.description}
        ogType="product"
        schemaData={productSchema}
      />
      <Navigation />

      <main className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/tradelines" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Tradeline Marketplace
            </Link>
            <span>/</span>
            <span className="text-foreground">{tradeline.bankName} {tradeline.cardId}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left: visual */}
            <div className="space-y-6">
              <CreditCardVisual tradeline={tradeline} />

              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">America's Trusted Tradeline Supplier</div>
                  <div className="text-sm text-muted-foreground">
                    Guaranteed posting · No late payments · 15% or lower utilization
                  </div>
                </div>
              </div>
            </div>

            {/* Right: details */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{tradeline.bankName}</Badge>
                {tradeline.status === "available" && (
                  <Badge variant="success" className="gap-1.5">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-current" />
                    Available ({tradeline.availability})
                  </Badge>
                )}
                {tradeline.status === "limited" && (
                  <Badge variant="warning" className="gap-1.5">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-current" />
                    Limited ({tradeline.availability})
                  </Badge>
                )}
                {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">{title}</span>
              </h1>

              <div className="mb-6 flex items-end gap-3">
                <span className="text-4xl font-bold text-foreground">${tradeline.price}</span>
                <span className="mb-1 text-sm text-muted-foreground">one-time price</span>
              </div>

              <Button
                size="lg"
                disabled={isSoldOut}
                onClick={handleAddToCart}
                className={`w-full sm:w-auto ${
                  isSoldOut
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-gradient-cta text-accent-foreground hover:scale-105 transition-transform duration-300 glow-accent"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {isSoldOut ? "Sold Out" : "Add to Cart"}
              </Button>

              {/* Spec grid */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem
                  icon={CreditCard}
                  label="Credit Limit"
                  value={`$${tradeline.creditLimit.toLocaleString()}`}
                />
                <DetailItem icon={Clock} label="Age" value={tradeline.age} />
                <DetailItem
                  icon={CalendarDays}
                  label="Purchase Deadline"
                  value={tradeline.purchaseDeadline}
                />
                <DetailItem
                  icon={BadgeCheck}
                  label="1st Reporting Period"
                  value={tradeline.firstReportingPeriod}
                />
                <DetailItem icon={Building2} label="Bank Name" value={tradeline.bankName} />
                <DetailItem icon={CreditCard} label="Card ID" value={tradeline.cardId} />
              </div>

              {/* Description */}
              <div className="mt-10 border-t border-border/60 pt-8">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{tradeline.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingChat />
    </div>
  );
};

export default ProductDetail;
