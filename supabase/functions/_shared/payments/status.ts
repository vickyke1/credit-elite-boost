import type { OrderStatus, VerifiedEvent } from "./types.ts";

/** Maps a verified provider event to an order status, after checking it matches the order. */
export function decideStatus(event: VerifiedEvent, orderTotalUsd: number): { status: OrderStatus | null; reason: string } {
  if (!Number.isFinite(orderTotalUsd) || orderTotalUsd <= 0 || !Number.isFinite(event.priceAmount) || event.priceAmount <= 0 || (event.paidFiat !== null && (!Number.isFinite(event.paidFiat) || event.paidFiat < 0))) return { status: null, reason: "invalid amount" };
  if (event.priceCurrency.toLowerCase() !== "usd") return { status: null, reason: "currency mismatch" };
  if (Math.abs(event.priceAmount - orderTotalUsd) > 0.01) return { status: null, reason: "amount mismatch" };
  switch (event.providerStatus) {
    case "finished": {
      if (event.paidFiat !== null && event.paidFiat < orderTotalUsd - 0.01) return { status: "underpaid", reason: "paid below invoice" };
      if (event.paidFiat !== null && event.paidFiat > orderTotalUsd * 1.02) return { status: "overpaid", reason: "paid above invoice" };
      return { status: "paid", reason: "payment finished" };
    }
    case "partially_paid": return { status: "underpaid", reason: "partially paid" };
    case "expired": return { status: "expired", reason: "invoice expired" };
    case "failed":
    case "refunded": return { status: "failed", reason: `provider ${event.providerStatus}` };
    default: return { status: null, reason: `in progress: ${event.providerStatus}` };
  }
}
