import { test, expect } from "bun:test";
import { telegramChatUrl, takeNewPaidOrders } from "./buyerTelegram";

test("follow-up opens the specific buyer with an encoded draft", () => {
  expect(telegramChatUrl("@buyer_name", "Hello & thanks!")).toBe("https://t.me/buyer_name?text=Hello%20%26%20thanks!");
});
test("unsafe Telegram handles cannot create a redirect", () => {
  expect(telegramChatUrl("buyer_name?url=https://evil.example")).toBeNull();
});
test("only confirmed paid and overpaid orders trigger chats", () => {
  const orders = ["pending", "review", "underpaid", "paid", "overpaid", "failed", "expired"].map((status) => ({ id: status, status, telegram: "buyer_name", total_usd: 725 }));
  expect(takeNewPaidOrders(orders, new Set()).map((o) => o.id)).toEqual(["paid", "overpaid"]);
});
test("duplicate updates and paid-to-overpaid changes do not reopen chats", () => {
  const seen = new Set<string>();
  const order = { id: "order1", status: "paid", telegram: "buyer_name", total_usd: 725 };
  expect(takeNewPaidOrders([order], seen)).toHaveLength(1);
  expect(takeNewPaidOrders([order, { ...order, status: "overpaid" }], seen)).toHaveLength(0);
});