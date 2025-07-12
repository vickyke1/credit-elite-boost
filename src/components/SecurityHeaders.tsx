import { useEffect } from 'react';
import { useCSRF } from '@/hooks/useCSRF';

/**
 * Component that sets enhanced security headers
 * This provides comprehensive security protection
 */
export const SecurityHeaders = () => {
  const { isLoading } = useCSRF(); // This will fetch and apply security headers
  useEffect(() => {
    // Additional client-side security measures
    
    // Disable console in production
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
    }

    // Prevent right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Prevent F12, Ctrl+Shift+I, Ctrl+U (view source)
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      });
    }

    // Set secure defaults
    const fallbackCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.youtube.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.com https://cashaapp.com",
      "frame-src 'self' https://www.youtube.com https://cashaapp.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://cashaapp.com"
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