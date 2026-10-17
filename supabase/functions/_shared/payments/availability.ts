export interface CheckoutProduct {
  sku: string;
  compliance_status: string;
  inventory: number | null;
}

// Advisory only: the atomic order RPC remains authoritative at purchase time.
export function checkoutAvailable(skus: string[], products: CheckoutProduct[]): boolean {
  if (skus.length === 0 || skus.length > 10 || new Set(skus).size !== skus.length) return false;
  return skus.every((sku) => products.some((product) =>
    product.sku === sku && product.compliance_status === "approved" &&
    (product.inventory === null || product.inventory > 0)
  ));
}