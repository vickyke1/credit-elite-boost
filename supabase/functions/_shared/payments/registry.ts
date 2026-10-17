import type { PaymentProvider } from "./types.ts";
import { nowPayments } from "./nowpayments.ts";

const providers: Record<string, PaymentProvider> = { nowpayments: nowPayments };

export function activeProvider(): PaymentProvider {
  return providers[Deno.env.get("PAYMENT_PROVIDER") ?? "nowpayments"] ?? nowPayments;
}
export function providerById(id: string): PaymentProvider | undefined {
  return providers[id];
}
