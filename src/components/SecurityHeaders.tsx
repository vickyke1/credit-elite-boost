import { useEffect } from 'react';

/**
 * Component that sets security headers via meta tags
 * This provides client-side security headers as a fallback
 */
export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Temporary for development
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    // Create or update CSP meta tag
    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
    if (!cspMeta) {
      cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      document.head.appendChild(cspMeta);
    }
    cspMeta.setAttribute('content', csp);

    // Set X-Content-Type-Options
    let ctypeMeta = document.querySelector('meta[name="x-content-type-options"]') as HTMLMetaElement;
    if (!ctypeMeta) {
      ctypeMeta = document.createElement('meta');
      ctypeMeta.setAttribute('name', 'x-content-type-options');
      document.head.appendChild(ctypeMeta);
    }
    ctypeMeta.setAttribute('content', 'nosniff');

    // Set X-Frame-Options
    let frameMeta = document.querySelector('meta[name="x-frame-options"]') as HTMLMetaElement;
    if (!frameMeta) {
      frameMeta = document.createElement('meta');
      frameMeta.setAttribute('name', 'x-frame-options');
      document.head.appendChild(frameMeta);
    }
    frameMeta.setAttribute('content', 'DENY');

    // Set X-XSS-Protection
    let xssMeta = document.querySelector('meta[name="x-xss-protection"]') as HTMLMetaElement;
    if (!xssMeta) {
      xssMeta = document.createElement('meta');
      xssMeta.setAttribute('name', 'x-xss-protection');
      document.head.appendChild(xssMeta);
    }
    xssMeta.setAttribute('content', '1; mode=block');

    // Set Referrer-Policy
    let refMeta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement;
    if (!refMeta) {
      refMeta = document.createElement('meta');
      refMeta.setAttribute('name', 'referrer');
      document.head.appendChild(refMeta);
    }
    refMeta.setAttribute('content', 'strict-origin-when-cross-origin');

    // Set Permissions-Policy
    let permMeta = document.querySelector('meta[name="permissions-policy"]') as HTMLMetaElement;
    if (!permMeta) {
      permMeta = document.createElement('meta');
      permMeta.setAttribute('name', 'permissions-policy');
      document.head.appendChild(permMeta);
    }
    permMeta.setAttribute('content', 'geolocation=(), microphone=(), camera=()');

  }, []);

  return null;
};