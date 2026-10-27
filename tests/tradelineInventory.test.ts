import { expect, test } from "bun:test";
import { generateTradelines, getTradelineBySlug } from "../src/utils/tradelineData";

test("adds 1,000 listings to the existing 1,500 without duplicate identifiers", () => {
  const inventory = generateTradelines();
  expect(inventory).toHaveLength(2500);
  expect(new Set(inventory.map((item) => item.id)).size).toBe(2500);
  expect(new Set(inventory.map((item) => item.slug)).size).toBe(2500);
  expect(new Set(inventory.map((item) => item.cardId)).size).toBe(2500);
  expect(inventory.find((item) => item.id === "TL1500")).toBeDefined();
  const added = inventory.find((item) => item.id === "TL2500");
  expect(added).toBeDefined();
  if (!added) throw new Error("Missing added listing");
  expect(getTradelineBySlug(added.slug)?.id).toBe("TL2500");
});