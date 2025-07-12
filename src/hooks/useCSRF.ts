import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CSRFTokenResponse {
  csrfToken: string;
  headers: Record<string, string>;
}

/**
 * Hook for CSRF protection
 */
export const useCSRF = () => {
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('security-headers');
        
        if (error) {
          console.error('Failed to fetch CSRF token:', error);
          return;
        }

        const response = data as CSRFTokenResponse;
        setCSRFToken(response.csrfToken);
        
        // Apply security headers to the current page
        Object.entries(response.headers).forEach(([key, value]) => {
          if (key.toLowerCase().startsWith('x-') || key.toLowerCase().includes('content-security-policy')) {
            const metaTag = document.createElement('meta');
            metaTag.setAttribute('http-equiv', key);
            metaTag.setAttribute('content', value);
            document.head.appendChild(metaTag);
          }
        });
        
      } catch (error) {
        console.error('CSRF token fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCSRFToken();
  }, []);

  const getCSRFHeaders = () => ({
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json',
  });

  const validateCSRFToken = (receivedToken: string): boolean => {
    return receivedToken === csrfToken && csrfToken.length > 0;
  };

  return {
    csrfToken,
    isLoading,
    getCSRFHeaders,
    validateCSRFToken,
  };
};