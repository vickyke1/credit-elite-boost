import { expect, test } from "bun:test";
import { buildTradelineBundles } from "../src/lib/tradelineBundles";
import { generateTradelines } from "../src/utils/tradelineData";

const inventory = generateTradelines().map(item => ({ ...item, purchaseDeadline: "12/31/2026" }));

test("authorized-user bundles retain existing listing IDs and exact listed prices", () => {
  const bundles = buildTradelineBundles(inventory, "2026-11-08");
  expect(bundles.map(bundle => bundle.items.length)).toEqual([2, 3, 5]);
  for (const bundle of bundles) {
    expect(bundle.complete).toBe(true);
    expect(bundle.totalPrice).toBe(bundle.items.reduce((total, item) => total + item.price, 0));
    expect(new Set(bundle.items.map(item => item.bankName)).size).toBe(bundle.count);
    for (const item of bundle.items) expect(inventory.find(source => source.id === item.id)).toEqual(item);
  }
});

test("expired and unavailable listings cannot be included in a bundle", () => {
  const unavailable = inventory.map((item, index) => index % 2 === 0 ? { ...item, purchaseDeadline: "11/07/2026" } : { ...item, availability: 0 });
  for (const bundle of buildTradelineBundles(unavailable, "2026-11-08")) {
    expect(bundle.items).toHaveLength(0);
    expect(bundle.complete).toBe(false);
    expect(bundle.totalPrice).toBe(0);
  }
});