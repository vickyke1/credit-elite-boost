-- Security fixes for rate_limits table and database functions

-- Enable RLS on rate_limits table (if not already enabled)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for rate_limits table - only service role should access this table
CREATE POLICY "Service role only access to rate_limits" 
ON public.rate_limits 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Secure the cleanup function with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;

-- Secure the handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone'
  );
  RETURN NEW;
END;
$$;