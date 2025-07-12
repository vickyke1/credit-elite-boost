import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the origin URL from the request
    const origin = req.headers.get('origin') || 'https://jpmjsbonkbiapbxzwqyp.supabase.co';
    
    // Define comprehensive security headers
    const securityHeaders = {
      // Content Security Policy - Restrictive for production
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.youtube.com https://youtube.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.supabase.co https://*.supabase.com https://cashaapp.com",
        "frame-src 'self' https://www.youtube.com https://youtube.com https://cashaapp.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self' https://cashaapp.com",
        "object-src 'none'",
        "upgrade-insecure-requests"
      ].join('; '),
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Permissions Policy - Restrict dangerous features
      'Permissions-Policy': [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=(self)',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()'
      ].join(', '),
      
      // Strict Transport Security (HSTS)
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Prevent caching of sensitive pages
      'Cache-Control': 'no-cache, no-store, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
      
      // CORS headers
      ...corsHeaders
    };

    // Generate CSRF token
    const csrfToken = crypto.randomUUID();
    
    return new Response(
      JSON.stringify({
        headers: securityHeaders,
        csrfToken,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      }
    );

  } catch (error) {
    console.error('Security headers error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Security configuration failed' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});