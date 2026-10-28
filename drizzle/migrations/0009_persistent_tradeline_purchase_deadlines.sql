CREATE TABLE public.tradeline_purchase_deadlines (
 listing_id text PRIMARY KEY CHECK (listing_id ~ '^TL[0-9]{4}$'),
 purchase_deadline date NOT NULL
);
GRANT SELECT ON public.tradeline_purchase_deadlines TO anon, authenticated;
GRANT ALL ON public.tradeline_purchase_deadlines TO service_role;
ALTER TABLE public.tradeline_purchase_deadlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public listing deadlines" ON public.tradeline_purchase_deadlines FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.tradeline_deadline_audit (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), listing_id text NOT NULL REFERENCES public.tradeline_purchase_deadlines(listing_id),
 previous_deadline date NOT NULL, new_deadline date NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(), administrator uuid NOT NULL
);
GRANT SELECT ON public.tradeline_deadline_audit TO authenticated;
GRANT ALL ON public.tradeline_deadline_audit TO service_role;
ALTER TABLE public.tradeline_deadline_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read deadline audit" ON public.tradeline_deadline_audit FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.extend_purchase_deadlines(p_changes jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_actor uuid := auth.uid(); item jsonb; old_date date; expected_date date; new_date date; results jsonb := '[]'::jsonb; seen text[] := ARRAY[]::text[]; listing text;
BEGIN
 IF v_actor IS NULL OR NOT public.has_role(v_actor,'admin') THEN RAISE EXCEPTION 'Administrator access required' USING ERRCODE='42501'; END IF;
 IF jsonb_typeof(p_changes) IS DISTINCT FROM 'array' OR jsonb_array_length(p_changes)<1 OR jsonb_array_length(p_changes)>2500 THEN RAISE EXCEPTION 'Select between 1 and 2500 listings'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(p_changes) ORDER BY value->>'listing_id' LOOP
  listing := item->>'listing_id';
  BEGIN
   IF listing IS NULL OR listing=ANY(seen) THEN RAISE EXCEPTION 'Invalid or duplicate listing'; END IF;
   seen := array_append(seen,listing);
   expected_date := (item->>'previous_deadline')::date; new_date := (item->>'new_deadline')::date;
   SELECT purchase_deadline INTO old_date FROM public.tradeline_purchase_deadlines WHERE listing_id=listing FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found'; END IF;
   IF expected_date IS NULL OR old_date<>expected_date THEN RAISE EXCEPTION 'Deadline changed since preview; refresh and try again'; END IF;
   IF new_date IS NULL OR new_date< (now() AT TIME ZONE 'UTC')::date OR new_date<=old_date THEN RAISE EXCEPTION 'New deadline must be today or later and extend the old deadline'; END IF;
   UPDATE public.tradeline_purchase_deadlines SET purchase_deadline=new_date WHERE listing_id=listing;
   INSERT INTO public.tradeline_deadline_audit(listing_id,previous_deadline,new_deadline,administrator) VALUES(listing,old_date,new_date,v_actor);
   results := results || jsonb_build_array(jsonb_build_object('listing_id',listing,'updated',true));
  EXCEPTION WHEN OTHERS THEN
   results := results || jsonb_build_array(jsonb_build_object('listing_id',listing,'updated',false,'error',SQLERRM));
  END;
 END LOOP;
 RETURN results;
END $$;
REVOKE ALL ON FUNCTION public.extend_purchase_deadlines(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.extend_purchase_deadlines(jsonb) TO authenticated;