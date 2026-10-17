import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { checkoutAvailable } from "./availability.ts";

Deno.test("missing server products cannot proceed to payment", () => {
  assertEquals(checkoutAvailable(["synchrony-91297"], []), false);
});
Deno.test("pending review products cannot proceed to payment", () => {
  assertEquals(checkoutAvailable(["sku"], [{ sku: "sku", compliance_status: "pending_review", inventory: 1 }]), false);
});
Deno.test("approved in-stock products can proceed to payment", () => {
  assertEquals(checkoutAvailable(["sku"], [{ sku: "sku", compliance_status: "approved", inventory: 1 }]), true);
});
Deno.test("sold-out products cannot proceed to payment", () => {
  assertEquals(checkoutAvailable(["sku"], [{ sku: "sku", compliance_status: "approved", inventory: 0 }]), false);
});
Deno.test("one unavailable item blocks the entire cart", () => {
  assertEquals(checkoutAvailable(["sku", "missing"], [{ sku: "sku", compliance_status: "approved", inventory: null }]), false);
});