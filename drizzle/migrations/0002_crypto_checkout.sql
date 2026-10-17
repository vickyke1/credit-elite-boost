GRANT SELECT ON public.pricing_inquiries, public.telegram_messages, public.contact_submissions TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

CREATE TABLE public.checkout_products (
  sku text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price_usd numeric(12,2) NOT NULL CHECK (price_usd > 0),
  inventory integer CHECK (inventory IS NULL OR inventory >= 0),
  compliance_status text NOT NULL DEFAULT 'pending_review' CHECK (compliance_status IN ('pending_review','approved','rejected')),
  compliance_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.checkout_products TO authenticated;
GRANT ALL ON public.checkout_products TO service_role;
ALTER TABLE public.checkout_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read checkout products" ON public.checkout_products FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  telegram text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','underpaid','overpaid','expired','failed')),
  total_usd numeric(12,2) NOT NULL,
  provider text NOT NULL,
  provider_invoice_id text,
  pay_currency text,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_invoice_id)
);
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sku text NOT NULL REFERENCES public.checkout_products(sku),
  name text NOT NULL,
  price_usd numeric(12,2) NOT NULL
);
CREATE TABLE public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_key text NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  verified boolean NOT NULL,
  payment_status text,
  raw jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_key)
);
CREATE TABLE public.order_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.orders, public.order_items, public.payment_events, public.order_audit_log TO authenticated;
GRANT ALL ON public.orders, public.order_items, public.payment_events, public.order_audit_log TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers read own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Buyers read own order items" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "Admins read payment events" ON public.payment_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read order audit" ON public.order_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Atomic order creation: server price, approved-only, inventory reserved, rate limited.
CREATE OR REPLACE FUNCTION public.create_checkout_order(p_skus text[], p_telegram text, p_user_id uuid, p_ip_hash text, p_provider text)
RETURNS uuid LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_order uuid; v_total numeric := 0; r record; v_count int;
BEGIN
  IF array_length(p_skus,1) IS NULL OR array_length(p_skus,1) > 10 THEN RAISE EXCEPTION 'invalid_items'; END IF;
  IF (SELECT count(*) FROM (SELECT DISTINCT unnest(p_skus)) s) <> array_length(p_skus,1) THEN RAISE EXCEPTION 'duplicate_items'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_ip_hash, 1));
  IF (SELECT count(*) FROM public.orders WHERE ip_hash = p_ip_hash AND created_at > now() - interval '1 hour') >= 10 THEN RAISE EXCEPTION 'rate_limit_exceeded'; END IF;
  SELECT count(*) INTO v_count FROM public.checkout_products WHERE sku = ANY(p_skus) AND compliance_status = 'approved';
  IF v_count <> array_length(p_skus,1) THEN RAISE EXCEPTION 'item_not_available'; END IF;
  INSERT INTO public.orders (user_id, telegram, total_usd, provider, ip_hash) VALUES (p_user_id, p_telegram, 0, p_provider, p_ip_hash) RETURNING id INTO v_order;
  FOR r IN SELECT * FROM public.checkout_products WHERE sku = ANY(p_skus) ORDER BY sku FOR UPDATE LOOP
    IF r.inventory IS NOT NULL THEN
      IF r.inventory < 1 THEN RAISE EXCEPTION 'sold_out'; END IF;
      UPDATE public.checkout_products SET inventory = inventory - 1, updated_at = now() WHERE sku = r.sku;
    END IF;
    INSERT INTO public.order_items (order_id, sku, name, price_usd) VALUES (v_order, r.sku, r.name, r.price_usd);
    v_total := v_total + r.price_usd;
  END LOOP;
  UPDATE public.orders SET total_usd = v_total WHERE id = v_order;
  INSERT INTO public.order_audit_log (order_id, from_status, to_status, reason) VALUES (v_order, NULL, 'pending', 'order created');
  RETURN v_order;
END $$;

-- Server-controlled status transition; restores inventory on expiry/failure.
CREATE OR REPLACE FUNCTION public.transition_order(p_order uuid, p_to text, p_reason text)
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_from text;
BEGIN
  SELECT status INTO v_from FROM public.orders WHERE id = p_order FOR UPDATE;
  IF v_from IS NULL THEN RAISE EXCEPTION 'order_not_found'; END IF;
  IF v_from = p_to OR v_from IN ('paid','overpaid','expired','failed') THEN RETURN v_from; END IF;
  UPDATE public.orders SET status = p_to, updated_at = now() WHERE id = p_order;
  INSERT INTO public.order_audit_log (order_id, from_status, to_status, reason) VALUES (p_order, v_from, p_to, p_reason);
  IF p_to IN ('expired','failed') THEN
    UPDATE public.checkout_products c SET inventory = c.inventory + 1, updated_at = now()
    FROM public.order_items i WHERE i.order_id = p_order AND i.sku = c.sku AND c.inventory IS NOT NULL;
  END IF;
  RETURN p_to;
END $$;

REVOKE ALL ON FUNCTION public.create_checkout_order(text[],text,uuid,text,text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.transition_order(uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_checkout_order(text[],text,uuid,text,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.transition_order(uuid,text,text) TO service_role;