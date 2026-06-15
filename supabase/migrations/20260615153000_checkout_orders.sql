-- =====================================================================
-- Compliant checkout / orders schema
-- Supports guest checkout, server-validated totals, Bitcoin + manual
-- (Cash App / Venmo) payments, protected delivery content, and an
-- admin review workflow. No CPN / identity products are modelled here.
-- =====================================================================

-- ---------- Enums ----------
DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('card', 'cashapp', 'venmo', 'bitcoin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_state AS ENUM ('pending', 'awaiting_review', 'paid', 'failed', 'expired', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.delivery_state AS ENUM ('not_started', 'processing', 'delivered');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- Credit score profile (DB-level 300-850 validation) ----------
CREATE TABLE IF NOT EXISTS public.customer_credit_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  -- Hard database constraint: FICO/VantageScore valid range only.
  credit_score integer CHECK (credit_score BETWEEN 300 AND 850),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Belt-and-suspenders trigger so invalid scores are rejected on INSERT/UPDATE
-- even if the column constraint is ever altered.
CREATE OR REPLACE FUNCTION public.enforce_credit_score_range()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.credit_score IS NOT NULL AND (NEW.credit_score < 300 OR NEW.credit_score > 850) THEN
    RAISE EXCEPTION 'credit_score must be between 300 and 850 (got %)', NEW.credit_score;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_score_range ON public.customer_credit_profiles;
CREATE TRIGGER trg_credit_score_range
  BEFORE INSERT OR UPDATE ON public.customer_credit_profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_credit_score_range();

-- ---------- Orders ----------
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  -- Guest checkout: user_id may be NULL. access_token gates token-based reads.
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  access_token uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  billing_address jsonb,
  payment_method public.payment_method NOT NULL,
  payment_status public.payment_state NOT NULL DEFAULT 'pending',
  delivery_status public.delivery_state NOT NULL DEFAULT 'not_started',
  -- All monetary values stored in integer cents and validated server-side.
  subtotal_cents integer NOT NULL CHECK (subtotal_cents >= 0),
  discount_cents integer NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  currency text NOT NULL DEFAULT 'USD',
  consent_accepted boolean NOT NULL DEFAULT false,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(lower(email));
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ---------- Order items ----------
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_type text NOT NULL CHECK (product_type IN ('tradeline', 'education')),
  product_ref text NOT NULL,
  name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0)
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ---------- Bitcoin payment records (order-specific) ----------
CREATE TABLE IF NOT EXISTS public.bitcoin_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  expected_amount_btc numeric(16, 8),
  expected_amount_usd_cents integer NOT NULL,
  status public.payment_state NOT NULL DEFAULT 'pending',
  tx_hash text,
  confirmations integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bitcoin_payments_order_id ON public.bitcoin_payments(order_id);

-- ---------- Manual payment reviews (Cash App / Venmo / manual BTC) ----------
CREATE TABLE IF NOT EXISTS public.manual_payment_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  reference_note text,
  reviewed_by uuid REFERENCES auth.users(id),
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_manual_reviews_order_id ON public.manual_payment_reviews(order_id);

-- ---------- Delivered content (protected) ----------
CREATE TABLE IF NOT EXISTS public.order_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id uuid REFERENCES public.order_items(id) ON DELETE CASCADE,
  content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'url')),
  content text,
  delivered_by uuid REFERENCES auth.users(id),
  delivered_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_deliveries_order_id ON public.order_deliveries(order_id);

-- ---------- Payment event audit log ----------
CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON public.payment_events(order_id);

-- ---------- updated_at triggers ----------
DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_btc_updated_at ON public.bitcoin_payments;
CREATE TRIGGER trg_btc_updated_at
  BEFORE UPDATE ON public.bitcoin_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- Row Level Security
-- Writes happen through edge functions (service_role). Browser clients
-- can only read their own data; admins can read/manage everything.
-- =====================================================================
ALTER TABLE public.customer_credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_payment_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.orders, public.order_items, public.bitcoin_payments,
  public.manual_payment_reviews, public.order_deliveries, public.customer_credit_profiles TO authenticated;
GRANT UPDATE ON public.orders, public.manual_payment_reviews TO authenticated;
GRANT INSERT ON public.order_deliveries TO authenticated;
GRANT ALL ON public.orders, public.order_items, public.bitcoin_payments,
  public.manual_payment_reviews, public.order_deliveries, public.payment_events,
  public.customer_credit_profiles TO service_role;

-- orders
CREATE POLICY "Owners can view their orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- order_items
CREATE POLICY "Owners can view their order items" ON public.order_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- bitcoin_payments
CREATE POLICY "Owners can view their btc payments" ON public.bitcoin_payments
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "Admins can view all btc payments" ON public.bitcoin_payments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- manual_payment_reviews
CREATE POLICY "Admins can view manual reviews" ON public.manual_payment_reviews
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update manual reviews" ON public.manual_payment_reviews
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- order_deliveries (protected: only owner or admin can read)
CREATE POLICY "Owners can view their deliveries" ON public.order_deliveries
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "Admins can manage deliveries (select)" ON public.order_deliveries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert deliveries" ON public.order_deliveries
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- customer_credit_profiles
CREATE POLICY "Owners can view their credit profile" ON public.customer_credit_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view credit profiles" ON public.customer_credit_profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- payment_events: admin read only (writes via service_role)
CREATE POLICY "Admins can view payment events" ON public.payment_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

COMMENT ON TABLE public.orders IS 'Customer orders for tradelines and legal credit-education products. CPN/identity products are not supported.';
COMMENT ON COLUMN public.orders.access_token IS 'Opaque token allowing a guest to view their own order via the get-order edge function.';
