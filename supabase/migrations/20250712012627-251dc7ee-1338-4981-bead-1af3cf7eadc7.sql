-- Create rate_limits table for enhanced rate limiting
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  action TEXT NOT NULL,
  identifier TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_rate_limits_key ON public.rate_limits(key);
CREATE INDEX idx_rate_limits_created_at ON public.rate_limits(created_at);
CREATE INDEX idx_rate_limits_action ON public.rate_limits(action);

-- Create cleanup function for old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- No RLS needed as this table is only accessed by edge functions with service role key