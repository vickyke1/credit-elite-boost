import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { decideStatus } from "./status.ts";
import { hmacSha512Hex, sortKeys, verifyNowPaymentsSignature, reconcileNowPayments } from "./nowpayments.ts";

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
Deno.test("non-finite invoice amounts never change status", () => {
  assertEquals(decideStatus(ev({ priceAmount: NaN }), 100).status, null);
  assertEquals(decideStatus(ev({ priceAmount: Infinity }), 100).status, null);
});
Deno.test("finished payment below invoice amount is not paid", () => assertEquals(decideStatus(ev({ paidFiat: 50 }), 100).status, "underpaid"));
Deno.test("negative or non-finite paid amounts are rejected", () => {
  assertEquals(decideStatus(ev({ paidFiat: -1 }), 100).status, null);
  assertEquals(decideStatus(ev({ paidFiat: NaN }), 100).status, null);
});
Deno.test("signed non-object payloads are rejected", async () => {
  for (const raw of ["null", "[]", "42"]) {
    const signature = await hmacSha512Hex("test-only-secret", raw);
    assertEquals(await verifyNowPaymentsSignature(raw, signature, "test-only-secret"), null);
  }
});

Deno.test("valid NOWPayments signature verifies, tampered body fails", async () => {
  const body = { payment_status: "finished", order_id: "o", price_amount: 100 };
  const sig = await hmacSha512Hex("secret", JSON.stringify(sortKeys(body)));
  assert(await verifyNowPaymentsSignature(JSON.stringify(body), sig, "secret"));
  assertEquals(await verifyNowPaymentsSignature(JSON.stringify({ ...body, price_amount: 1 }), sig, "secret"), null);
  assertEquals(await verifyNowPaymentsSignature(JSON.stringify(body), sig, "wrong"), null);
  assertEquals(await verifyNowPaymentsSignature(JSON.stringify(body), null, "secret"), null);
});

Deno.test("provider reconciliation rejects changed invoice, network, amount and status", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = Deno.env.get("NOWPAYMENTS_API_KEY");
  const payment = { payment_id: 123, invoice_id: 456, order_id: "order", payment_status: "finished", price_currency: "usd", price_amount: 100, pay_currency: "usdttrc20", pay_amount: 100, actually_paid: 100 };
  Deno.env.set("NOWPAYMENTS_API_KEY", "test-only-key");
  globalThis.fetch = async () => new Response(JSON.stringify(payment), { headers: { "Content-Type": "application/json" } });
  try {
    assert(await reconcileNowPayments(payment, ["usdttrc20"]));
    for (const change of [{ invoice_id: 789 }, { order_id: "other" }, { pay_currency: "usdterc20" }, { pay_amount: 1 }, { actually_paid: 1 }, { payment_status: "confirmed" }, { price_amount: null }]) {
      assertEquals(await reconcileNowPayments({ ...payment, ...change }, ["usdttrc20"]), null);
    }
    assertEquals(await reconcileNowPayments(payment, ["btc"]), null);
    const underpaid = { ...payment, actually_paid: 50 };
    globalThis.fetch = async () => new Response(JSON.stringify(underpaid));
    assertEquals((await reconcileNowPayments(underpaid, ["usdttrc20"]))?.payment_status, "partially_paid");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) Deno.env.delete("NOWPAYMENTS_API_KEY");
    else Deno.env.set("NOWPAYMENTS_API_KEY", originalKey);
  }
});
