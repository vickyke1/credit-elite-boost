import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { emailSchema, phoneSchema } from '@/lib/security';
import { z } from 'zod';

// Validation schema for the "Sell Tradelines" credit partner application.
// Kept independent from the generic contact schema so the field rules can be
// tuned to this funnel while still submitting through the existing, working
// contact-form edge function.
export const sellTradelineSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name')
    .max(80, 'Name is too long')
    .regex(/^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)+$/, 'Please enter your first and last name'),
  email: emailSchema,
  phone: phoneSchema,
  numCards: z.string().min(1, 'Select how many eligible cards you have'),
  avgLimit: z.string().min(1, 'Select your average credit limit'),
  cardAge: z.string().min(1, 'Select the age of your oldest card'),
  banks: z
    .string()
    .trim()
    .min(2, 'List at least one issuing bank')
    .max(300, 'Please keep the bank list under 300 characters'),
  contactMethod: z.string().min(1, 'Select a preferred contact method'),
  message: z
    .string()
    .trim()
    .max(1500, 'Message must be less than 1500 characters')
    .optional(),
});

export type SellTradelineFormData = z.infer<typeof sellTradelineSchema>;

const buildMessage = (data: SellTradelineFormData) => {
  const lines = [
    'New Credit Partner / Sell Tradelines application:',
    `• Eligible credit cards: ${data.numCards}`,
    `• Average credit limit: ${data.avgLimit}`,
    `• Oldest card age: ${data.cardAge}`,
    `• Issuing banks: ${data.banks}`,
    `• Preferred contact method: ${data.contactMethod}`,
  ];

  if (data.message && data.message.trim().length > 0) {
    lines.push('', `Additional notes: ${data.message.trim()}`);
  }

  return lines.join('\n');
};

export const useSellTradelineForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitForm = async (data: SellTradelineFormData) => {
    setIsSubmitting(true);

    try {
      const validated = sellTradelineSchema.parse(data);

      // Split full name into first/last for the shared contact-form backend.
      const [firstName, ...rest] = validated.fullName.trim().split(/\s+/);
      const lastName = rest.join(' ');

      const payload = {
        firstName,
        lastName,
        email: validated.email,
        phone: validated.phone,
        subject: `Sell Tradelines Application — ${validated.fullName}`,
        message: buildMessage(validated),
      };

      const { data: response, error } = await supabase.functions.invoke('contact-form', {
        body: payload,
      });

      if (error) {
        throw error;
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Application Received',
        description:
          "Thanks for applying to become a credit partner! Our team will review your details and reach out within 1 business day.",
      });

      return { success: true };
    } catch (error) {
      let errorMessage = 'Failed to submit your application. Please try again.';

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

  return { submitForm, isSubmitting };
};
