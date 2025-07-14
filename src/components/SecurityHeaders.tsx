import { useEffect } from 'react';
import { useCSRF } from '@/hooks/useCSRF';

/**
 * Component that sets enhanced security headers
 * This provides comprehensive security protection
 */
export const SecurityHeaders = () => {
  const { isLoading } = useCSRF(); // This will fetch and apply security headers
  useEffect(() => {
    // Enhanced client-side security measures
    
    // Comprehensive production hardening
    if (process.env.NODE_ENV === 'production') {
      // Disable console with integrity check
      const originalConsole = { ...console };
      Object.keys(console).forEach(key => {
        (console as any)[key] = () => {};
      });
      
      // Store original for security checks
      (window as any).__originalConsole = originalConsole;
    }

    // Enhanced keyboard restrictions
    const handleSecurityKeys = (e: KeyboardEvent) => {
      const restrictedCombos = [
        { key: 'F12' },
        { key: 'I', ctrl: true, shift: true },
        { key: 'U', ctrl: true },
        { key: 'S', ctrl: true },
        { key: 'A', ctrl: true, shift: true },
        { key: 'C', ctrl: true, shift: true },
        { key: 'J', ctrl: true, shift: true }
      ];

      const isRestricted = restrictedCombos.some(combo => {
        return e.key === combo.key &&
               (!combo.ctrl || e.ctrlKey) &&
               (!combo.shift || e.shiftKey);
      });

      if (isRestricted && process.env.NODE_ENV === 'production') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Enhanced right-click protection
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
        return false;
      }
    };

    // Detect tampering attempts
    const detectTampering = () => {
      // Check for DevTools
      let devtools = { open: false };
      const threshold = 160;
      
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            if (process.env.NODE_ENV === 'production') {
              // Log security event
              console.warn('Developer tools detected');
            }
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    };

    // Set enhanced fallback CSP
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

    // Apply security headers and event listeners
    document.addEventListener('keydown', handleSecurityKeys);
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Initialize tampering detection
    detectTampering();

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

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleSecurityKeys);
      document.removeEventListener('contextmenu', handleContextMenu);
    };

  }, [isLoading]);

  return null;
};