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
  if (!signature || !/^[a-fA-F0-9]{128}$/.test(signature)) return null;
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    body = parsed;
  } catch { return null; }
  const expected = await hmacSha512Hex(secret.trim(), JSON.stringify(sortKeys(body)));
  return safeEqual(signature.toLowerCase(), expected) ? body : null;
}

async function call(path: string, init: RequestInit = {}) {
  const apiKey = Deno.env.get("NOWPAYMENTS_API_KEY");
  if (!apiKey) throw new Error("NOWPayments is not configured");
  const res = await fetch(`${base()}${path}`, { ...init, headers: { "x-api-key": apiKey, "Content-Type": "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`NOWPayments request failed [${res.status}]`);
  return res.json();
}

export async function reconcileNowPayments(body: Record<string, unknown>, enabled: string[]): Promise<Record<string, unknown> | null> {
  const paymentId = String(body.payment_id ?? "");
  if (!/^\d+$/.test(paymentId)) return null;
  const payment = await call(`/payment/${paymentId}`);
  if (!["waiting", "confirming", "confirmed", "sending", "partially_paid", "finished", "failed", "refunded", "expired"].includes(String(payment.payment_status))) return null;
  for (const field of ["payment_id", "invoice_id", "order_id", "payment_status", "price_currency", "pay_currency"]) {
    if (body[field] == null || payment[field] == null || String(body[field]) !== String(payment[field])) return null;
  }
  if (!enabled.includes(String(payment.pay_currency))) return null;
  for (const field of ["price_amount", "pay_amount", "actually_paid"]) {
    if (body[field] == null || payment[field] == null || !Number.isFinite(Number(body[field])) || Number(body[field]) < 0 || Number(body[field]) !== Number(payment[field])) return null;
  }
  if (Number(payment.price_amount) <= 0 || Number(payment.pay_amount) <= 0) return null;
  // A finished callback alone is not proof that the requested crypto amount arrived.
  if (payment.payment_status === "finished" && Number(payment.actually_paid) < Number(payment.pay_amount)) {
    return { ...payment, payment_status: "partially_paid" };
  }
  return payment;
}

export const nowPayments: PaymentProvider = {
  id: "nowpayments",
  isConfigured: () => Boolean(Deno.env.get("NOWPAYMENTS_API_KEY") && Deno.env.get("NOWPAYMENTS_IPN_SECRET")),
  async listCurrencies() {
    const data = await call("/merchant/coins");
    return Array.isArray(data?.currencies) ? data.currencies.filter((c: unknown) => typeof c === "string" && /^[a-z0-9]{2,32}$/.test(c)) : [];
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
    const payment = await reconcileNowPayments(b, await this.listCurrencies());
    if (!payment) return null;
    const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));
    return {
      eventKey: `${b.payment_id}:${b.payment_status}`,
      orderId: String(payment.order_id),
      invoiceId: String(payment.invoice_id),
      providerStatus: String(payment.payment_status),
      priceAmount: Number(payment.price_amount),
      priceCurrency: String(payment.price_currency ?? ""),
      payCurrency: String(payment.pay_currency),
      paidFiat: num(payment.actually_paid_at_fiat),
    };
  },
};
