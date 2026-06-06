import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput } from '@/lib/security';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { sanitizeErrorMessage, logSecurityEvent } from '@/utils/securityHelpers';
import { LoginForm } from '@/lib/auth/schemas';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { secureSignIn } = useSecureAuth();

  const login = async (data: LoginForm): Promise<{ error?: string }> => {
    setIsLoading(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        email: sanitizeInput(data.email),
        password: data.password, // Don't sanitize password as it may contain special chars
        rememberMe: data.rememberMe,
      };

      // Use secure authentication with rate limiting
      const result = await secureSignIn(sanitizedData.email, sanitizedData.password);

      if (result.error) {
        // Log security event for failed login
        logSecurityEvent({
          type: 'auth_failure',
          details: `Login failed for email: ${sanitizedData.email}`,
        });

        return { error: sanitizeErrorMessage(result.error) };
      }
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back to CPN Credit Boost!',
      });

      // Redirect to main page
      navigate('/');
      return {};
      
    } catch (error) {
      // Log security event for unexpected errors
      logSecurityEvent({
        type: 'auth_failure',
        details: 'Unexpected login error occurred',
      });

      return { error: sanitizeErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};