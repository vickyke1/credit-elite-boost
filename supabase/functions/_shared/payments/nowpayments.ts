import type { PaymentProvider, VerifiedEvent } from "./types.ts";

const base = () => Deno.env.get("NOWPAYMENTS_SANDBOX") === "true" ? "https://api-sandbox.nowpayments.io/v1" : "https://api.nowpayments.io/v1";

export function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).sort().reduce((acc, k) => {
      acc[k] = sortKeys((value as Record<string, unknown>)[k]);
      return acc;
    }, {} as Record<string, unknown>);
  }
  return value;
}

export async function hmacSha512Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function verifyNowPaymentsSignature(rawBody: string, signature: string | null, secret: string): Promise<Record<string, unknown> | null> {
  if (!signature) return null;
  let body: Record<string, unknown>;
  try { body = JSON.parse(rawBody); } catch { return null; }
  const expected = await hmacSha512Hex(secret, JSON.stringify(sortKeys(body)));
  return safeEqual(signature.toLowerCase(), expected) ? body : null;
}

async function call(path: string, init: RequestInit = {}) {
  const apiKey = Deno.env.get("NOWPAYMENTS_API_KEY");
  if (!apiKey) throw new Error("NOWPayments is not configured");
  const res = await fetch(`${base()}${path}`, { ...init, headers: { "x-api-key": apiKey, "Content-Type": "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`NOWPayments [${res.status}]: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

export const nowPayments: PaymentProvider = {
  id: "nowpayments",
  isConfigured: () => Boolean(Deno.env.get("NOWPAYMENTS_API_KEY") && Deno.env.get("NOWPAYMENTS_IPN_SECRET")),
  async listCurrencies() {
    const data = await call("/merchant/coins");
    return Array.isArray(data?.selectedCurrencies) ? data.selectedCurrencies : [];
  },
  async createInvoice(input) {
    const data = await call("/invoice", {
      method: "POST",
      body: JSON.stringify({
        price_amount: input.amountUsd, price_currency: "usd", order_id: input.orderId,
        order_description: input.description, ipn_callback_url: input.callbackUrl,
        success_url: input.successUrl, cancel_url: input.cancelUrl,
      }),
    });
    if (!data?.id || !data?.invoice_url) throw new Error("NOWPayments returned no invoice");
    return { invoiceId: String(data.id), paymentUrl: String(data.invoice_url) };
  },
  async verifyWebhook(rawBody, headers): Promise<VerifiedEvent | null> {
    const secret = Deno.env.get("NOWPAYMENTS_IPN_SECRET");
    if (!secret) return null;
    const b = await verifyNowPaymentsSignature(rawBody, headers.get("x-nowpayments-sig"), secret);
    if (!b || typeof b.order_id !== "string") return null;
    const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));
    return {
      eventKey: `${b.payment_id}:${b.payment_status}`,
      orderId: b.order_id,
      invoiceId: b.invoice_id != null ? String(b.invoice_id) : null,
      providerStatus: String(b.payment_status),
      priceAmount: Number(b.price_amount),
      priceCurrency: String(b.price_currency ?? ""),
      payCurrency: b.pay_currency ? String(b.pay_currency) : null,
      paidFiat: num(b.actually_paid_at_fiat),
    };
  },
};
