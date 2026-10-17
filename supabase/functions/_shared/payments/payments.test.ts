import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { decideStatus } from "./status.ts";
import { hmacSha512Hex, sortKeys, verifyNowPaymentsSignature } from "./nowpayments.ts";

const ev = (o: Record<string, unknown> = {}) => ({ eventKey: "1:x", orderId: "o", invoiceId: null, providerStatus: "finished", priceAmount: 100, priceCurrency: "usd", payCurrency: "usdttrc20", paidFiat: 100, ...o });

Deno.test("finished payment matching the order marks it paid", () => assertEquals(decideStatus(ev(), 100).status, "paid"));
Deno.test("amount mismatch never changes status", () => assertEquals(decideStatus(ev({ priceAmount: 1 }), 100).status, null));
Deno.test("non-USD invoice never changes status", () => assertEquals(decideStatus(ev({ priceCurrency: "eur" }), 100).status, null));
Deno.test("partial payment is underpaid", () => assertEquals(decideStatus(ev({ providerStatus: "partially_paid" }), 100).status, "underpaid"));
Deno.test("overpayment is flagged", () => assertEquals(decideStatus(ev({ paidFiat: 150 }), 100).status, "overpaid"));
Deno.test("expired and failed are explicit", () => {
  assertEquals(decideStatus(ev({ providerStatus: "expired" }), 100).status, "expired");
  assertEquals(decideStatus(ev({ providerStatus: "failed" }), 100).status, "failed");
});
Deno.test("waiting/confirming do not change status", () => assertEquals(decideStatus(ev({ providerStatus: "confirming" }), 100).status, null));

Deno.test("valid NOWPayments signature verifies, tampered body fails", async () => {
  const body = { payment_status: "finished", order_id: "o", price_amount: 100 };
  const sig = await hmacSha512Hex("secret", JSON.stringify(sortKeys(body)));
  assert(await verifyNowPaymentsSignature(JSON.stringify(body), sig, "secret"));
  assertEquals(await verifyNowPaymentsSignature(JSON.stringify({ ...body, price_amount: 1 }), sig, "secret"), null);
  assertEquals(await verifyNowPaymentsSignature(JSON.stringify(body), sig, "wrong"), null);
  assertEquals(await verifyNowPaymentsSignature(JSON.stringify(body), null, "secret"), null);
});
