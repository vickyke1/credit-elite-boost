export interface PaidBuyerOrder {
  id: string;
  telegram: string;
  status: string;
  total_usd: number;
}

export function telegramChatUrl(handle: string, message = ""): string | null {
  const username = handle.trim().replace(/^@/, "");
  if (!/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(username)) return null;
  return `https://t.me/${username}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`;
}

export function followUpDraft(order: PaidBuyerOrder): string {
  return `Hi @${order.telegram.replace(/^@/, "")}, your CpnCreditBoost order ${order.id.slice(0, 8)} ($${Number(order.total_usd).toFixed(2)}) is confirmed. How can I help with your next steps?`;
}

export function takeNewPaidOrders(orders: PaidBuyerOrder[], seen: Set<string>): PaidBuyerOrder[] {
  return orders.filter((order) => {
    if (!["paid", "overpaid"].includes(order.status) || seen.has(order.id)) return false;
    seen.add(order.id);
    return true;
  });
}