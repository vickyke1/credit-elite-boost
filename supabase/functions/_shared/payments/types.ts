// Provider-neutral payment contract. Add a new provider (e.g. CoinPayments) by
// implementing PaymentProvider and registering it in registry.ts.
export type OrderStatus = "pending" | "paid" | "underpaid" | "overpaid" | "expired" | "failed";

export interface CreateInvoiceInput {
  orderId: string;
  amountUsd: number;
  description: string;
  callbackUrl: string;
  successUrl: string;
  cancelUrl: string;
}

export interface Invoice {
  invoiceId: string;
  paymentUrl: string;
}

export interface VerifiedEvent {
  eventKey: string; // unique per provider delivery state, used for idempotency
  orderId: string;
  invoiceId: string | null;
  providerStatus: string;
  priceAmount: number;
  priceCurrency: string;
  payCurrency: string | null;
  paidFiat: number | null;
}

export interface PaymentProvider {
  id: string;
  isConfigured(): boolean;
  listCurrencies(): Promise<string[]>;
  createInvoice(input: CreateInvoiceInput): Promise<Invoice>;
  /** Returns null when the signature is invalid. */
  verifyWebhook(rawBody: string, headers: Headers): Promise<VerifiedEvent | null>;
}
