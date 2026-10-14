# Project Architecture Rules

- Render the Tradelines marketplace inventory as a semantic, horizontally scrollable table because shoppers compare many numeric fields side by side.
- AI tradeline recommendations run in the `recommend-tradelines` backend function, which only returns ids from the inventory the client sends, because the inventory is generated client-side and the AI key must stay server-side.

- Pricing inquiries cover legitimate credit-building services, pass through a validated Edge Function, and use a service-only atomic database RPC for durable IP rate limits and idempotency so anonymous visitors cannot read leads or bypass submission controls.
- Homepage tradeline previews use the marketplace inventory generator so displayed prices and detail links share the same source.
