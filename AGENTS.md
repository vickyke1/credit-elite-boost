# Project Architecture Rules

- Admin buyer follow-up polls server-authorized confirmed orders while the panel is open, deduplicates by order ID, and navigates only an owner-preopened Telegram tab; drafts require sending in Telegram and never change payment status.

- Payment education lives on a public tutorial route linked from the shop; embedded video and Telegram contact never change order or payment status.

- Telegram manual payments use validated Cashtag links and a service-only row-locking transition RPC bound to numeric Telegram buyer IDs; only the verified owner may confirm receipt, so buyer taps and duplicate callbacks cannot mark payments paid.

- Telegram account lookup must exhaust paginated auth results and fail on lookup errors before creating an account, so returning users are not treated as new users.
- Signup consumes and resets Turnstile after each server submission; regression checks use mocked external services to exercise retry behavior without creating accounts or bypassing production verification.

- Render the Tradelines marketplace inventory as a compact row list where every row shows the replica bank-card mockup (real bank logo with embossed fallback); shoppers compare via the side-by-side comparison view rather than a table.
- AI tradeline recommendations run in the `recommend-tradelines` backend function, which only returns ids from the inventory the client sends, because the inventory is generated client-side and the AI key must stay server-side.

- Pricing inquiries cover legitimate credit-building services, pass through a validated Edge Function, and use a service-only atomic database RPC for durable IP rate limits and idempotency so anonymous visitors cannot read leads or bypass submission controls.
- Homepage tradeline previews use the marketplace inventory generator so displayed prices and detail links share the same source.
- Pricing and education share the pricing-inquiry handler; claim delivery atomically before sending Telegram alerts and persist message IDs for reply linking, so retries do not resend confirmed alerts. Telegram webhook validates the gateway-derived secret and accepts only the configured owner chat; replies are stored, not automatically forwarded to visitors.
- Crypto checkout uses backend provider adapters; only compliance-approved server products can be bought. Webhooks must verify signatures and reconcile provider payment records and merchant coin/network codes before the service-only `apply_verified_payment_event` RPC atomically records events and calls `transition_order`, preventing partial duplicate processing. Telegram delivery is claimed separately so duplicate callbacks cannot resend confirmed alerts.
- Checkout checks cart eligibility through a read-only backend preflight before offering payment; the atomic order RPC still enforces eligibility and stock to prevent stale checks from authorizing purchases.
