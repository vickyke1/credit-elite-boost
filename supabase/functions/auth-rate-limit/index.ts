import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitRequest {
  action: string;
  identifier: string;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15min, block for 30min
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 3 attempts per hour, block for 1hour
  'ssn-validation': { maxAttempts: 10, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 10 attempts per hour
  'password-reset': { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 3 attempts per hour
  'payment': { maxAttempts: 10, windowMs: 60 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 10 payment attempts per hour
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    const { action, identifier }: RateLimitRequest = await req.json();
    
    if (!action || !identifier) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for additional tracking
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Enhanced identifier that includes IP for better tracking
    const enhancedKey = `${action}:${identifier}:${clientIP}`;

    const config = RATE_LIMITS[action];
    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const key = enhancedKey;

    // Get recent attempts from a hypothetical rate_limits table
    // For now, we'll use a simple in-memory approach with KV storage
    const { data: attempts, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .gte('created_at', new Date(windowStart).toISOString())
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found"
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recentAttempts = attempts || [];
    
    // Check if currently blocked
    const lastAttempt = recentAttempts[0];
    if (lastAttempt && recentAttempts.length >= config.maxAttempts) {
      const timeSinceLastAttempt = now - new Date(lastAttempt.created_at).getTime();
      if (timeSinceLastAttempt < config.blockDurationMs) {
        const remainingTime = Math.ceil((config.blockDurationMs - timeSinceLastAttempt) / 1000 / 60);
        return new Response(
          JSON.stringify({ 
            blocked: true, 
            remainingMinutes: remainingTime,
            message: `Too many attempts. Try again in ${remainingTime} minutes.`
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Record this attempt with enhanced metadata
    const { error: insertError } = await supabase
      .from('rate_limits')
      .insert({ 
        key, 
        action, 
        identifier, 
        ip_address: clientIP,
        user_agent: userAgent,
        created_at: new Date().toISOString() 
      });

    if (insertError) {
      console.error('Failed to record attempt:', insertError);
      // Continue anyway - don't block legitimate users due to logging issues
    }

    // Clean up old attempts
    await supabase
      .from('rate_limits')
      .delete()
      .eq('key', key)
      .lt('created_at', new Date(windowStart).toISOString());

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        remaining: Math.max(0, config.maxAttempts - recentAttempts.length - 1)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limit check error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});