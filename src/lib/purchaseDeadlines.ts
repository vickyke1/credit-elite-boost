import type { Tradeline } from "../utils/tradelineData";

export const utcToday = () => new Date().toISOString().slice(0, 10);

export function deadlineISO(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [month, day, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

export function displayDeadline(value: string): string {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

export const isDeadlineExpired = (value: string, today = utcToday()) => deadlineISO(value) < today;

// Day extensions start from today, not an already-expired cutoff.
export function extendedDeadline(days: number, today = utcToday()): string {
  if (!Number.isInteger(days) || days < 1) throw new Error("Choose a positive whole number of days.");
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function applyPurchaseDeadlines(inventory: Tradeline[], deadlines: { listing_id: string; purchase_deadline: string }[]): Tradeline[] {
  const map = new Map(deadlines.map(row => [row.listing_id, row.purchase_deadline]));
  return inventory.map(item => {
    const date = map.get(item.id);
    return date ? { ...item, purchaseDeadline: displayDeadline(date) } : item;
  });
}