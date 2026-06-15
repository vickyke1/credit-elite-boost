import { z } from "zod";
import { emailSchema, phoneSchema } from "@/lib/security";

// Front-end checkout validation. Mirrors the server-side rules in the
// create-order edge function — the server remains the source of truth.
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  email: emailSchema,
  phone: phoneSchema,
  addressLine1: z.string().trim().min(3, "Street address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State / region is required").max(100),
  postalCode: z.string().trim().min(3, "Postal code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100),
  paymentMethod: z.enum(["card", "cashapp", "venmo", "bitcoin"], {
    errorMap: () => ({ message: "Select a payment method" }),
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Maps a cart item to the {type, ref} shape the server validator expects.
// Tradelines validate by their numeric card id; everything else the server
// doesn't recognise (e.g. CPN packages) is rejected by validate-purchase.
export const cartItemToServer = (item: {
  type: "tradeline" | "package";
  cardId?: string;
  id: string;
}): { type: string; ref: string } => {
  if (item.type === "tradeline") {
    return { type: "tradeline", ref: item.cardId ?? item.id };
  }
  // Education products use ids like "edu-...". Anything else is sent through
  // as-is and will be rejected server-side (compliant: blocks CPN items).
  if (item.id.startsWith("edu-")) {
    return { type: "education", ref: item.id };
  }
  return { type: item.type, ref: item.id };
};

export const formatUsd = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
