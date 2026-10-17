# Project Architecture Rules

- Render the Tradelines marketplace inventory as a compact row list where every row shows the replica bank-card mockup (real bank logo with embossed fallback); shoppers compare via the side-by-side comparison view rather than a table.
- AI tradeline recommendations run in the `recommend-tradelines` backend function, which only returns ids from the inventory the client sends, because the inventory is generated client-side and the AI key must stay server-side.

- Pricing inquiries cover legitimate credit-building services, pass through a validated Edge Function, and use a service-only atomic database RPC for durable IP rate limits and idempotency so anonymous visitors cannot read leads or bypass submission controls.
- Homepage tradeline previews use the marketplace inventory generator so displayed prices and detail links share the same source.
- Pricing and education share the pricing-inquiry handler; claim delivery atomically before sending Telegram alerts and persist message IDs for reply linking, so retries do not resend confirmed alerts. Telegram webhook validates the gateway-derived secret and accepts only the configured owner chat; replies are stored, not automatically forwarded to visitors.
- Crypto checkout goes through backend functions (`create-order`, `payment-webhook`, `order-status`) behind a provider adapter in `supabase/functions/_shared/payments`, because prices, inventory and payment status must be server-controlled; only `checkout_products` rows with `compliance_status = 'approved'` can be bought, and order status changes only via the `transition_order` RPC after a verified webhook.
