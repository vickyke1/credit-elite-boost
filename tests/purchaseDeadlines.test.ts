import { expect, test } from "bun:test";
import { applyPurchaseDeadlines, extendedDeadline, isDeadlineExpired } from "../src/lib/purchaseDeadlines";
import { generateTradelines } from "../src/utils/tradelineData";

test("expired deadlines are strictly earlier than today, not today itself", () => {
  expect(isDeadlineExpired("10/27/2026", "2026-10-28")).toBe(true);
  expect(isDeadlineExpired("10/28/2026", "2026-10-28")).toBe(false);
  expect(isDeadlineExpired("10/29/2026", "2026-10-28")).toBe(false);
});
for (const [days, expected] of [[7, "2026-11-04"], [14, "2026-11-11"], [30, "2026-11-27"]] as const) {
  test(`${days} day extension starts from today`, () => {
    expect(extendedDeadline(days, "2026-10-28")).toBe(expected);
  });
}
test("deadline extension preserves every other listing field", () => {
  const original = generateTradelines()[0];
  const before = structuredClone(original);
  const updated = applyPurchaseDeadlines([original], [{ listing_id: original.id, purchase_deadline: "2027-01-01" }])[0];
  expect(updated).toEqual({ ...before, purchaseDeadline: "01/01/2027" });
  expect(original).toEqual(before);
});
test("date overrides cover listings beyond the first 1000", () => {
  const inventory = generateTradelines();
  const item = inventory.find(row => row.id === "TL2500");
  if (!item) throw new Error("Missing listing");
  expect(applyPurchaseDeadlines(inventory, [{ listing_id: item.id, purchase_deadline: "2026-12-31" }]).find(row => row.id === item.id)?.purchaseDeadline).toBe("12/31/2026");
});