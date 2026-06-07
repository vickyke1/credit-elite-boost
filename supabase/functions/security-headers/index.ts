import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve((req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Generate nonce for scripts and styles
    const nonce = crypto.randomUUID().replace(/-/g, '');
    
    // Define comprehensive security headers
    const securityHeaders = {
      // Enhanced Content Security Policy with nonce
      'Content-Security-Policy': [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' https://www.youtube.com https://youtube.com`,
        `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.supabase.co https://*.supabase.com https://cashaapp.com",
        "frame-src 'self' https://www.youtube.com https://youtube.com https://cashaapp.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self' https://cashaapp.com",
        "object-src 'none'",
        "media-src 'self' https:",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "upgrade-insecure-requests",
        "block-all-mixed-content"
      ].join('; '),
      
      // Cross-Origin Embedder Policy
      'Cross-Origin-Embedder-Policy': 'require-corp',
      
      // Cross-Origin Opener Policy
      'Cross-Origin-Opener-Policy': 'same-origin',
      
      // Cross-Origin Resource Policy
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Enhanced Permissions Policy
      'Permissions-Policy': [
        'accelerometer=()',
        'ambient-light-sensor=()',
        'autoplay=()',
        'battery=()',
        'camera=()',
        'cross-origin-isolated=()',
        'display-capture=()',
        'document-domain=()',
        'encrypted-media=()',
        'execution-while-not-rendered=()',
        'execution-while-out-of-viewport=()',
        'fullscreen=(self)',
        'geolocation=()',
        'gyroscope=()',
        'keyboard-map=()',
        'magnetometer=()',
        'microphone=()',
        'midi=()',
        'navigation-override=()',
        'payment=(self)',
        'picture-in-picture=()',
        'publickey-credentials-get=()',
        'screen-wake-lock=()',
        'sync-xhr=()',
        'usb=()',
        'web-share=()',
        'xr-spatial-tracking=()'
      ].join(', '),
      
      // Strict Transport Security (HSTS)
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      
      // Enhanced cache control for security
      'Cache-Control': 'no-cache, no-store, must-revalidate, private, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      
      // Additional security headers
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-Download-Options': 'noopen',
      'X-DNS-Prefetch-Control': 'off',
      
      // CORS headers
      ...corsHeaders
    };

    // Generate CSRF token
    const csrfToken = crypto.randomUUID();
    
    return new Response(
      JSON.stringify({
        headers: securityHeaders,
        csrfToken,
        nonce,
        timestamp: new Date().toISOString(),
        securityLevel: 'enhanced'
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