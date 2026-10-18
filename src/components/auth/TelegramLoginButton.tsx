import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BOT_USERNAME = 'Cpn_creditboost_Bot';

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthData) => void;
  }
}

const TelegramLoginButton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.onTelegramAuth = async (user: TelegramAuthData) => {
      try {
        const { data, error } = await supabase.functions.invoke('telegram-auth', { body: user });
        if (error || !data?.token_hash) {
          toast({
            title: 'Telegram sign-in failed',
            description: 'Please try again or use email registration.',
            variant: 'destructive',
          });
          return;
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash,
          type: 'magiclink',
        });
        if (verifyError) {
          toast({
            title: 'Sign-in failed',
            description: 'Could not start your session. Please try again.',
            variant: 'destructive',
          });
          return;
        }

        toast({ title: 'Welcome!', description: `Signed in as ${user.first_name} via Telegram.` });
        navigate('/');
      } catch {
        toast({
          title: 'Telegram sign-in failed',
          description: 'Please try again or use email registration.',
          variant: 'destructive',
        });
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    containerRef.current?.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
    };
  }, [navigate, toast]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>
      <div ref={containerRef} className="flex justify-center min-h-[40px]" aria-label="Sign in with Telegram" />
    </div>
  );
};

export default TelegramLoginButton;
