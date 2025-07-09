import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitResponse {
  allowed?: boolean;
  blocked?: boolean;
  remainingMinutes?: number;
  message?: string;
  remaining?: number;
}

/**
 * Hook for secure authentication with server-side rate limiting
 */
export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkRateLimit = async (action: string, identifier: string): Promise<RateLimitResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-rate-limit', {
        body: { action, identifier }
      });

      if (error) {
        console.error('Rate limit check error:', error);
        // If rate limiting fails, allow the request to proceed
        return { allowed: true };
      }

      return data as RateLimitResponse;
    } catch (error) {
      console.error('Rate limit network error:', error);
      // If rate limiting fails, allow the request to proceed
      return { allowed: true };
    }
  };

  const secureSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check rate limit first
      const rateLimitResult = await checkRateLimit('login', email);
      
      if (rateLimitResult.blocked) {
        return { 
          error: rateLimitResult.message || 'Too many login attempts. Please try again later.',
          remainingMinutes: rateLimitResult.remainingMinutes 
        };
      }

      // Proceed with authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Return generic error message to prevent user enumeration
        return { error: 'Invalid email or password. Please check your credentials and try again.' };
      }

      return { data };
    } catch (error) {
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignUp = async (email: string, password: string, metadata?: any) => {
    setIsLoading(true);
    
    try {
      // Check rate limit first
      const rateLimitResult = await checkRateLimit('register', email);
      
      if (rateLimitResult.blocked) {
        return { 
          error: rateLimitResult.message || 'Too many registration attempts. Please try again later.',
          remainingMinutes: rateLimitResult.remainingMinutes 
        };
      }

      // Proceed with registration
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });

      if (error) {
        if (error.message.includes('already been registered')) {
          return { error: 'An account with this email already exists. Please sign in instead.' };
        }
        return { error: 'Registration failed. Please try again.' };
      }

      return { data };
    } catch (error) {
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const securePasswordReset = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Check rate limit first
      const rateLimitResult = await checkRateLimit('password-reset', email);
      
      if (rateLimitResult.blocked) {
        return { 
          error: rateLimitResult.message || 'Too many password reset attempts. Please try again later.',
          remainingMinutes: rateLimitResult.remainingMinutes 
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: 'Failed to send password reset email. Please try again.' };
      }

      return { success: true };
    } catch (error) {
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    secureSignIn,
    secureSignUp,
    securePasswordReset,
    checkRateLimit,
  };
};