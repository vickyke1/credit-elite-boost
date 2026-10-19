export function cashAppLink(value: string | undefined): string | null {
  const tag = value?.trim().replace(/^\$/, "") ?? "";
  if (!/^[a-zA-Z0-9]{1,20}$/.test(tag) || !/[a-zA-Z]/.test(tag)) return null;
  return `https://cash.app/$${tag}`;
}

type Rpc = (name: string, args: Record<string, string>) => PromiseLike<{
  data: { changed?: boolean; status?: string } | null;
  error: unknown;
}>;

// The service-only RPC locks the order and validates buyer/owner identity and state.
export async function transitionManualPayment(rpc: Rpc, orderId: string, actorId: number, to: "review" | "paid" | "failed") {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
    throw new Error("Invalid order id");
  }
  const result = await rpc("transition_telegram_manual_order", {
    p_order: orderId, p_actor: `tg:${actorId}`, p_to: to,
  });
  if (result.error || !result.data) throw new Error("Manual payment transition rejected");
  return result.data;
}