import { useEffect } from 'react';
import { useCSRF } from '@/hooks/useCSRF';

/**
 * Component that sets enhanced security headers
 * This provides comprehensive security protection
 */
export const SecurityHeaders = () => {
  const { isLoading } = useCSRF(); // This will fetch and apply security headers
  useEffect(() => {
    // Set enhanced fallback CSP headers when CSRF headers aren't loaded yet
    // Real security is enforced server-side via RLS, edge function validation, and rate limiting
    
    const fallbackCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.youtube.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.com https://cashaapp.com",
      "frame-src 'self' https://www.youtube.com https://cashaapp.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://cashaapp.com",
      "object-src 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');

    // Only set fallback headers if CSRF headers aren't loaded yet
    if (isLoading) {
      let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
      if (!cspMeta) {
        cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        document.head.appendChild(cspMeta);
      }
      cspMeta.setAttribute('content', fallbackCSP);
    }
  }, [isLoading]);

  return null;
};