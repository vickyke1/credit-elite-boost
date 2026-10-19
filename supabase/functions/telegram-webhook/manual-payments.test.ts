import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { cashAppLink, transitionManualPayment } from "./manual-payments.ts";

const id = "11111111-1111-4111-8111-111111111111";
Deno.test("Cash App uses an actual Cashtag URL without invented BTC or amount redirects", () => {
  assertEquals(cashAppLink("$ExampleBusiness"), "https://cash.app/$ExampleBusiness");
  assertEquals(cashAppLink("18zzeUz9UXTZ58W6TxdKCh94un8JK7Jc3t"), null);
  assertEquals(cashAppLink(undefined), null);
  assertEquals(cashAppLink("https://evil.example"), null);
  assertEquals(cashAppLink("12345"), null);
});
Deno.test("buyer submission asks for review only and passes numeric Telegram identity", async () => {
  const result = await transitionManualPayment((_name, args) => {
    assertEquals(args, { p_order: id, p_actor: "tg:123", p_to: "review" });
    return Promise.resolve({ data: { changed: true, status: "review" }, error: null });
  }, id, 123, "review");
  assertEquals(result.status, "review");
});
Deno.test("rejected ownership checks cannot return a successful payment result", async () => {
  await assertRejects(() => transitionManualPayment(() => Promise.resolve({ data: null, error: "not_order_buyer" }), id, 999, "review"));
});
Deno.test("duplicate submission keeps changed false so notifications are skipped", async () => {
  const result = await transitionManualPayment(() => Promise.resolve({ data: { changed: false, status: "review" }, error: null }), id, 123, "review");
  assertEquals(result.changed, false);
});
Deno.test("owner confirmation supplies authenticated owner identity to server transition", async () => {
  const result = await transitionManualPayment((_name, args) => {
    assertEquals(args.p_actor, "tg:7086831521");
    assertEquals(args.p_to, "paid");
    return Promise.resolve({ data: { changed: true, status: "paid" }, error: null });
  }, id, 7086831521, "paid");
  assertEquals(result.status, "paid");
});