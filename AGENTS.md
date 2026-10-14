# Project Architecture Rules

- Render the Tradelines marketplace inventory as a responsive card grid where every card shows the replica bank-card mockup (real bank logo with embossed fallback); shoppers compare via the side-by-side comparison view rather than a table.
- AI tradeline recommendations run in the `recommend-tradelines` backend function, which only returns ids from the inventory the client sends, because the inventory is generated client-side and the AI key must stay server-side.

- Pricing inquiries cover legitimate credit-building services, pass through a validated Edge Function, and use a service-only atomic database RPC for durable IP rate limits and idempotency so anonymous visitors cannot read leads or bypass submission controls.
- Homepage tradeline previews use the marketplace inventory generator so displayed prices and detail links share the same source.
