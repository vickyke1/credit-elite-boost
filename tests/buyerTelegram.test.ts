import { test } from "node:test";
import assert from "node:assert/strict";
import { telegramChatUrl, takeNewPaidOrders } from "../src/lib/buyerTelegram";

test("follow-up opens the specific buyer with an encoded draft", () => {
  assert.equal(telegramChatUrl("@buyer_name", "Hello & thanks!"), "https://t.me/buyer_name?text=Hello%20%26%20thanks!");
});
test("unsafe Telegram handles cannot create a redirect", () => {
  assert.equal(telegramChatUrl("buyer_name?url=https://evil.example"), null);
});
test("only confirmed paid and overpaid orders trigger chats", () => {
  const orders = ["pending", "review", "underpaid", "paid", "overpaid", "failed", "expired"].map((status) => ({ id: status, status, telegram: "buyer_name", total_usd: 725 }));
  assert.deepEqual(takeNewPaidOrders(orders, new Set()).map((o) => o.id), ["paid", "overpaid"]);
});
test("duplicate updates and paid-to-overpaid changes do not reopen chats", () => {
  const seen = new Set<string>();
  const order = { id: "order1", status: "paid", telegram: "buyer_name", total_usd: 725 };
  assert.equal(takeNewPaidOrders([order], seen).length, 1);
  assert.equal(takeNewPaidOrders([order, { ...order, status: "overpaid" }], seen).length, 0);
});