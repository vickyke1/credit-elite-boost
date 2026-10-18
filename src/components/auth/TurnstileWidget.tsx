import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; 'expired-callback'?: () => void; 'error-callback'?: () => void; theme?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string | null) => void;
}

const TurnstileWidget = ({ onVerify }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const renderWidget = async () => {
      try {
        // The site key is publishable; the backend hands it over so it never lives in code
        const { data, error } = await supabase.functions.invoke('verify-turnstile', { method: 'GET' });
        if (cancelled) return;
        if (error || !data?.siteKey) {
          setLoadError(true);
          return;
        }

        const render = () => {
          if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: data.siteKey,
            callback: (token: string) => onVerify(token),
            'expired-callback': () => onVerify(null),
            'error-callback': () => onVerify(null),
          });
        };

        if (window.turnstile) {
          render();
        } else {
          const script = document.createElement('script');
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          script.async = true;
          script.onload = render;
          script.onerror = () => setLoadError(true);
          document.head.appendChild(script);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    };

    renderWidget();
    return () => { cancelled = true; };
  }, [onVerify]);

  if (loadError) {
    return (
      <p className="text-sm text-destructive text-center">
        Security check could not load. Please refresh the page.
      </p>
    );
  }

  return <div ref={containerRef} className="flex justify-center min-h-[65px]" aria-label="Security verification" />;
};

export default TurnstileWidget;
