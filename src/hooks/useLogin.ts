import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, globalRateLimiter } from '@/lib/security';
import { LoginForm } from '@/lib/auth/schemas';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (data: LoginForm): Promise<{ error?: string }> => {
    // Rate limiting check
    const clientId = 'login_attempt';
    if (globalRateLimiter.isRateLimited(clientId)) {
      return { error: 'Too many login attempts. Please try again later.' };
    }

    globalRateLimiter.recordAttempt(clientId);
    setIsLoading(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        email: sanitizeInput(data.email),
        password: data.password, // Don't sanitize password as it may contain special chars
        rememberMe: data.rememberMe,
      };

      // Sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedData.email,
        password: sanitizedData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please check your credentials and try again.' };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: 'Please check your email and click the confirmation link before signing in.' };
        } else {
          return { error: error.message || 'Login failed. Please try again.' };
        }
      }
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back to CPN Credit Boost!',
      });

      // Redirect to main page
      navigate('/');
      return {};
      
    } catch (error) {
      return { error: 'Invalid email or password. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};