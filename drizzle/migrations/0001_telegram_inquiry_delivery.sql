ALTER TABLE public.pricing_inquiries ADD COLUMN telegram_message_id bigint, ADD COLUMN notification_attempt_at timestamptz;
CREATE FUNCTION public.claim_inquiry_notification(p_id uuid, p_ip_hash text) RETURNS SETOF public.pricing_inquiries LANGUAGE sql SECURITY INVOKER SET search_path=public AS $$
 UPDATE public.pricing_inquiries SET notification_status='sending', notification_attempt_at=now()
 WHERE id=p_id AND ip_hash=p_ip_hash AND (notification_status IN ('not_configured','failed') OR (notification_status='sending' AND notification_attempt_at < now()-interval '2 minutes')) RETURNING *;
$$;
REVOKE ALL ON FUNCTION public.claim_inquiry_notification(uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_inquiry_notification(uuid,text) TO service_role;
CREATE TABLE public.telegram_messages (
 update_id bigint PRIMARY KEY,
 chat_id bigint NOT NULL,
 user_id bigint,
 text text,
 inquiry_id uuid REFERENCES public.pricing_inquiries(id) ON DELETE SET NULL,
 raw_update jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.telegram_messages TO authenticated;
GRANT ALL ON public.telegram_messages TO service_role;
ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read Telegram replies" ON public.telegram_messages FOR SELECT TO authenticated USING(public.has_role(auth.uid(),'admin'::public.app_role));
CREATE INDEX telegram_messages_chat_idx ON public.telegram_messages(chat_id,created_at DESC);