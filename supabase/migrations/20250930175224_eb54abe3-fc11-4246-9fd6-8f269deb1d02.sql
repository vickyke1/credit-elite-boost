-- Ensure RLS is enabled on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might allow public access
DROP POLICY IF EXISTS "Service role can manage rate_limits" ON public.rate_limits;
DROP POLICY IF EXISTS "Service role only access to rate_limits" ON public.rate_limits;

-- Create a strict service-role-only policy
-- This ensures that only the auth-rate-limit edge function (using service role) can access this table
CREATE POLICY "service_role_only_access"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Explicitly deny all other access (including anon and authenticated users)
-- This is redundant with RLS enabled and no policies, but makes intent clear
CREATE POLICY "deny_public_access"
ON public.rate_limits
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Add comment to document the security requirement
COMMENT ON TABLE public.rate_limits IS 'Contains PII (IP addresses, user agents). Access restricted to service_role only for rate limiting functionality.';