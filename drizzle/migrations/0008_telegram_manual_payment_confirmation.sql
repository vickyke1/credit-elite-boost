ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending','review','paid','underpaid','overpaid','expired','failed'));

CREATE OR REPLACE FUNCTION public.transition_telegram_manual_order(p_order uuid, p_actor text, p_to text)
RETURNS jsonb LANGUAGE plpgsql SET search_path = public AS $$
DECLARE o public.orders%ROWTYPE; v_status text;
BEGIN
 SELECT * INTO o FROM public.orders WHERE id=p_order FOR UPDATE;
 IF NOT FOUND OR o.provider NOT IN ('manual','cashapp_manual') THEN RAISE EXCEPTION 'manual_order_not_found'; END IF;
 IF p_to='review' THEN
  IF p_actor IS DISTINCT FROM o.ip_hash THEN RAISE EXCEPTION 'not_order_buyer'; END IF;
  IF o.status<>'pending' THEN RETURN jsonb_build_object('changed',false,'status',o.status); END IF;
 ELSIF p_to IN ('paid','failed') THEN
  IF p_actor IS DISTINCT FROM 'tg:7086831521' THEN RAISE EXCEPTION 'not_owner'; END IF;
  IF o.status<>'review' THEN RETURN jsonb_build_object('changed',false,'status',o.status); END IF;
 ELSE RAISE EXCEPTION 'invalid_manual_transition'; END IF;
 v_status:=public.transition_order(p_order,p_to,'Telegram manual payment: '||p_to||' by '||p_actor);
 RETURN jsonb_build_object('changed',true,'status',v_status);
END $$;
REVOKE ALL ON FUNCTION public.transition_telegram_manual_order(uuid,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.transition_telegram_manual_order(uuid,text,text) TO service_role;