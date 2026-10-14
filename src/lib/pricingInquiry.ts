import { z } from "zod";

export const pricingInquirySchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Enter your name").max(100),
  telegram: z.string().trim().regex(/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/, "Enter a valid Telegram username"),
  service: z.enum(["credit-education", "credit-repair", "authorized-user-tradelines"]),
  message: z.string().trim().min(10, "Please add at least 10 characters about your goals").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to be contacted on Telegram" }) }),
  website: z.string().max(0).optional(),
});

export const inquiryServices = [
  { id: "credit-education", name: "Credit education", detail: "Understand your report, utilization, and credit-building options." },
  { id: "credit-repair", name: "Credit repair guidance", detail: "Explore legitimate ways to address inaccurate credit-report information." },
  { id: "authorized-user-tradelines", name: "Authorized-user tradelines", detail: "Compare account ages, limits, and reporting windows using your real identity." },
] as const;