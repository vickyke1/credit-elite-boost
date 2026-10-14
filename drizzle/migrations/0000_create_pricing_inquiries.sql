CREATE TABLE public.pricing_inquiries (
 id uuid PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 telegram text NOT NULL CHECK (char_length(telegram) BETWEEN 5 AND 32),
 service text NOT NULL CHECK (service IN ('credit-education', 'credit-repair', 'authorized-user-tradelines')),
 message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
 consent boolean NOT NULL CHECK (consent = true),
 ip_hash text NOT NULL,
 status text NOT NULL DEFAULT 'new',
 notification_status text NOT NULL DEFAULT 'not_configured'
);
GRANT SELECT ON public.pricing_inquiries TO authenticated;
GRANT ALL ON public.pricing_inquiries TO service_role;
ALTER TABLE public.pricing_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read pricing inquiries" ON public.pricing_inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX pricing_inquiries_ip_created_idx ON public.pricing_inquiries (ip_hash, created_at);
CREATE FUNCTION public.save_pricing_inquiry(p_id uuid, p_name text, p_telegram text, p_service text, p_message text, p_ip_hash text) RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(p_ip_hash, 0));
 IF EXISTS (SELECT 1 FROM public.pricing_inquiries WHERE id = p_id AND ip_hash = p_ip_hash) THEN RETURN p_id; END IF;
 IF (SELECT count(*) FROM public.pricing_inquiries WHERE ip_hash = p_ip_hash AND created_at > now() - interval '1 hour') >= 5 THEN RAISE EXCEPTION 'rate_limit_exceeded'; END IF;
 INSERT INTO public.pricing_inquiries (id, name, telegram, service, message, consent, ip_hash) VALUES (p_id, p_name, p_telegram, p_service, p_message, true, p_ip_hash);
 RETURN p_id;
END;
$$;
REVOKE ALL ON FUNCTION public.save_pricing_inquiry(uuid, text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_pricing_inquiry(uuid, text, text, text, text, text) TO service_role;