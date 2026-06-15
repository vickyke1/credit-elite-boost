import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ComplianceNotice from "@/components/checkout/ComplianceNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkoutSchema, type CheckoutFormData, cartItemToServer, formatUsd } from "@/lib/checkout/schema";
import { Bitcoin, CreditCard, Smartphone, Loader2 } from "lucide-react";

const paymentOptions = [
  { value: "bitcoin", label: "Bitcoin", icon: Bitcoin, hint: "Pay to an order-specific address. Reviewed before delivery." },
  { value: "cashapp", label: "Cash App", icon: Smartphone, hint: "Manual payment. Include your order number in the note." },
  { value: "venmo", label: "Venmo", icon: Smartphone, hint: "Manual payment. Include your order number in the note." },
  { value: "card", label: "Card", icon: CreditCard, hint: "Card gateway — availability shown on the next step." },
] as const;

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "United States", paymentMethod: "bitcoin" },
  });

  const paymentMethod = watch("paymentMethod");
  const consent = watch("consent");

  const onSubmit = async (data: CheckoutFormData) => {
    setValidationErrors([]);
    setSubmitting(true);
    try {
      const serverItems = items.map((it) =>
        cartItemToServer({ type: it.type, cardId: it.cardId, id: it.id }),
      );

      // 1) Server-side validation — block checkout if it fails.
      const { data: validation, error: vErr } = await supabase.functions.invoke("validate-purchase", {
        body: { items: serverItems },
      });
      if (vErr) throw vErr;
      if (!validation?.valid) {
        setValidationErrors(validation?.errors ?? ["Your cart could not be validated."]);
        toast({
          title: "Checkout blocked",
          description: "Some items in your cart can't be purchased. See details below.",
          variant: "destructive",
        });
        return;
      }

      // 2) Create the order (server re-validates and persists).
      const { data: order, error: oErr } = await supabase.functions.invoke("create-order", {
        body: {
          customer: { name: data.fullName, email: data.email, phone: data.phone },
          billingAddress: {
            line1: data.addressLine1,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
          },
          paymentMethod: data.paymentMethod,
          consentAccepted: data.consent,
          items: serverItems,
        },
      });
      if (oErr) throw oErr;
      if (order?.error) throw new Error(order.error);

      clearCart();
      toast({ title: "Order created", description: `Order ${order.orderNumber} is awaiting payment.` });
      navigate(`/order/${order.accessToken}`);
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Your cart is empty</h1>
            <p className="mb-8 text-muted-foreground">Add tradelines or education products to check out.</p>
            <Button asChild>
              <Link to="/tradelines">Browse Tradelines</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Secure Checkout | CPN Credit Boost"
        description="Securely complete your tradeline or credit-education purchase. Guest checkout supported."
        canonicalUrl="https://cpncreditboost.com/checkout"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-10">
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Checkout</h1>
            <p className="mb-8 text-muted-foreground">
              No account required — you can check out as a guest. All prices are verified on our
              servers before payment.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
              {/* Left: details */}
              <div className="space-y-8 lg:col-span-2">
                {/* Customer */}
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Contact details</h2>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="fullName">Full name *</Label>
                      <Input id="fullName" {...register("fullName")} placeholder="Jordan Carter" />
                      {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" type="tel" {...register("phone")} placeholder="(555) 123-4567" />
                        {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Billing */}
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Billing address</h2>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="addressLine1">Street address *</Label>
                      <Input id="addressLine1" {...register("addressLine1")} placeholder="123 Main St" />
                      {errors.addressLine1 && <p className="mt-1 text-sm text-destructive">{errors.addressLine1.message}</p>}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" {...register("city")} />
                        {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state">State / region *</Label>
                        <Input id="state" {...register("state")} />
                        {errors.state && <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal code *</Label>
                        <Input id="postalCode" {...register("postalCode")} />
                        {errors.postalCode && <p className="mt-1 text-sm text-destructive">{errors.postalCode.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input id="country" {...register("country")} />
                        {errors.country && <p className="mt-1 text-sm text-destructive">{errors.country.message}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment method */}
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Payment method</h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setValue("paymentMethod", v as CheckoutFormData["paymentMethod"], { shouldValidate: true })}
                    className="grid gap-3"
                  >
                    {paymentOptions.map((opt) => (
                      <Label
                        key={opt.value}
                        htmlFor={`pm-${opt.value}`}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                          paymentMethod === opt.value ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <RadioGroupItem id={`pm-${opt.value}`} value={opt.value} className="mt-1" />
                        <span className="flex-1">
                          <span className="flex items-center gap-2 font-medium text-foreground">
                            <opt.icon className="h-4 w-4 text-primary" /> {opt.label}
                          </span>
                          <span className="text-sm text-muted-foreground">{opt.hint}</span>
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                  {errors.paymentMethod && <p className="mt-2 text-sm text-destructive">{errors.paymentMethod.message}</p>}
                </section>

                <ComplianceNotice />
              </div>

              {/* Right: order summary */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border bg-surface-elevated p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Order summary</h2>
                  <ul className="mb-4 space-y-3">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium text-foreground">${item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-accent">{formatUsd(getTotalPrice() * 100)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Final total is confirmed server-side.</p>

                  {validationErrors.length > 0 && (
                    <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                      <p className="mb-1 font-semibold">Checkout blocked:</p>
                      <ul className="list-disc space-y-1 pl-4">
                        {validationErrors.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-5 flex items-start gap-2">
                    <Checkbox
                      id="consent"
                      checked={consent === true}
                      onCheckedChange={(c) => setValue("consent", (c === true) as true, { shouldValidate: true })}
                    />
                    <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground">
                      I have read and agree to the terms, refund policy, and compliance notice, and I
                      will use these products lawfully.
                    </Label>
                  </div>
                  {errors.consent && <p className="mt-1 text-sm text-destructive">{errors.consent.message}</p>}

                  <Button type="submit" className="mt-5 w-full" disabled={submitting}>
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                      </span>
                    ) : (
                      "Place order"
                    )}
                  </Button>
                </div>
              </aside>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;
