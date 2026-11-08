import type { Tradeline } from "../utils/tradelineData";
import { isDeadlineExpired } from "./purchaseDeadlines";

export const bundleDefinitions = [
  { id: "foundation", name: "Foundation Builder", count: 2, minimumAge: 2, minimumLimit: 25000, description: "Two seasoned accounts with a lower listed-price total." },
  { id: "accelerator", name: "Credit Accelerator", count: 3, minimumAge: 5, minimumLimit: 50000, description: "Three accounts combining longer history and higher listed limits." },
  { id: "elite", name: "Elite Credit Suite", count: 5, minimumAge: 8, minimumLimit: 75000, description: "Five aged, high-limit accounts from different listed issuers." },
] as const;

export function buildTradelineBundles(inventory: Tradeline[], today?: string) {
  return bundleDefinitions.map(definition => {
    const candidates = inventory.filter(item => item.availability > 0 && item.status !== "sold-out" && !isDeadlineExpired(item.purchaseDeadline, today) && item.ageInYears >= definition.minimumAge && item.creditLimit >= definition.minimumLimit)
      .sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
    const issuers = new Set<string>();
    const items = candidates.filter(item => {
      if (issuers.has(item.bankName)) return false;
      issuers.add(item.bankName);
      return true;
    }).slice(0, definition.count);
    return { ...definition, items, complete: items.length === definition.count, totalPrice: items.reduce((total, item) => total + item.price, 0), totalLimit: items.reduce((total, item) => total + item.creditLimit, 0) };
  });
}