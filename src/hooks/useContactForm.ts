import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { emailSchema, nameSchema, phoneSchema } from '@/lib/security';
import { z } from 'zod';

const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Validate data
      const validatedData = contactFormSchema.parse(data);

      // Submit to edge function
      const { data: response, error } = await supabase.functions.invoke('contact-form', {
        body: validatedData
      });

      if (error) {
        throw error;
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Message Sent Successfully',
        description: 'Thank you for contacting us! We will get back to you within 24 hours.',
      });

      return { success: true };
    } catch (error) {
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error instanceof z.ZodError) {
        errorMessage = error.errors[0].message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
  };
};
