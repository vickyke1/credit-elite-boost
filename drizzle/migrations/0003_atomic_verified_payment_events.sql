ALTER TABLE public.payment_events ADD COLUMN IF NOT EXISTS notification_status text NOT NULL DEFAULT 'pending';
CREATE OR REPLACE FUNCTION public.apply_verified_payment_event(p_order uuid, p_provider text, p_event_key text, p_invoice text, p_currency text, p_to text, p_reason text, p_raw jsonb)
RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE o public.orders%ROWTYPE; v_event uuid; v_status text; v_changed boolean;
BEGIN
 SELECT * INTO o FROM public.orders WHERE id=p_order FOR UPDATE;
 IF NOT FOUND OR o.provider<>p_provider THEN RAISE EXCEPTION 'order_mismatch'; END IF;
 IF p_invoice IS NULL OR o.provider_invoice_id IS NULL OR p_invoice<>o.provider_invoice_id THEN RAISE EXCEPTION 'invoice_mismatch'; END IF;
 IF p_currency IS NULL OR p_currency !~ '^[a-z0-9]{2,32}$' OR (o.pay_currency IS NOT NULL AND o.pay_currency<>p_currency) THEN RAISE EXCEPTION 'asset_network_mismatch'; END IF;
 IF p_to IS NOT NULL AND p_to NOT IN ('paid','underpaid','overpaid','expired','failed') THEN RAISE EXCEPTION 'invalid_status'; END IF;
 INSERT INTO public.payment_events(provider,provider_event_key,order_id,verified,payment_status,raw) VALUES(p_provider,p_event_key,p_order,true,p_raw->>'payment_status',p_raw) ON CONFLICT(provider,provider_event_key) DO NOTHING RETURNING id INTO v_event;
 IF v_event IS NULL THEN RETURN jsonb_build_object('duplicate',true,'changed',false); END IF;
 UPDATE public.orders SET pay_currency=p_currency WHERE id=p_order;
 v_status:=o.status;
 IF p_to IS NOT NULL THEN v_status:=public.transition_order(p_order,p_to,p_reason); END IF;
 v_changed:=v_status<>o.status;
 IF NOT v_changed THEN UPDATE public.payment_events SET notification_status='not_required' WHERE id=v_event; END IF;
 RETURN jsonb_build_object('duplicate',false,'changed',v_changed,'eventId',v_event,'status',v_status);
END $$;
REVOKE ALL ON FUNCTION public.apply_verified_payment_event(uuid,text,text,text,text,text,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.apply_verified_payment_event(uuid,text,text,text,text,text,text,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.claim_payment_notification(p_provider text,p_event_key text) RETURNS uuid LANGUAGE plpgsql SET search_path=public AS $$
DECLARE v_id uuid;
BEGIN
 UPDATE public.payment_events SET notification_status='sending' WHERE provider=p_provider AND provider_event_key=p_event_key AND notification_status IN ('pending','failed') RETURNING id INTO v_id;
 RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.claim_payment_notification(text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_payment_notification(text,text) TO service_role;