# Roadmap

- [ ] Add Cash App Telegram shop links and secure owner confirmation; activation blocked until owner supplies business $Cashtag (secure form declined).

- [x] Fix returning Telegram sign-in beyond the first account page; deployed and passed four pagination/error regression tests.
- [x] Reset signup captcha after failed submissions; three mocked browser flows retained values and retried successfully without refresh.

- [x] Handle unavailable checkout items before invoice creation; deployed preflight, live product-to-cart Telegram fallback verified, 18 tests passed; product approval restrictions preserved.

- [x] Redesign homepage and tradelines for readable mobile browsing.
- [x] Add lawful credit-education pricing inquiries and verify saved leads.
- [ ] Display monthly rates — blocked until owner supplies actual rates.
- [x] Send pricing and education inquiries to the owner's Telegram chat and store incoming replies (two real form alerts delivered; synthetic reply storage verified).

- [x] Redesign the Tradelines inventory as a responsive, compact striped table based on the supplied reference.
- [x] Preserve search, sorting, filtering, product details, availability, pagination, and cart actions.
- [x] Verify desktop and mobile scrolling and navigation behavior.
- [x] Audit and fix broken links (sitemap cleaned of nonexistent pages).
- [x] Side-by-side tradeline comparison view.
- [x] AI tradeline advisor that recommends inventory matches.
- [x] Show the brand as "CpnCreditBoost" (no ".com") everywhere it is displayed; keep real cpncreditboost.com URLs.
- [x] Create the site logo and place the emblem in the header; tab icon derived from it.
- [x] Fix the sign-in form so the "Remember me" checkbox no longer blocks submission.
- [x] Crypto checkout foundation (NOWPayments adapter, orders, verified webhooks, Telegram alerts); removed manual payment instructions.
- [ ] Turn on crypto checkout — blocked on merchant coin availability and owner approval of products for sale (credentials saved).
- [x] Verify deployed NOWPayments IPN reachability and strengthen signature, provider reconciliation, and atomic duplicate handling (13 tests passed; unsigned live requests rejected).
- [ ] Verify actual dashboard IPN format, signed sandbox payment, database duplicate retries and Telegram payment alert — blocked on merchant coin availability and an approved test product.
- [ ] Set payout wallet and enable USDT/BTC in NOWPayments — blocked: requires owner's NOWPayments dashboard access (not API-settable with current key).
- [ ] Run one real crypto purchase end to end — blocked: requires sending real crypto to a live invoice.
- [ ] Wire Zelle/Venmo fiat checkout with owner-confirmed payment — blocked on owner's real Zelle/Venmo handles (user skipped providing them).
- [x] Telegram bot orders dashboard: /orders command replies with recent orders (status, amount, buyer); verified live.
- [x] Secure admin panel at /admin listing orders, inquiries and Telegram messages with status actions; admin-only via server check.
- [x] Fulfillment page at /admin/orders/:id: mark paid, save delivery note, mark fulfilled, pre-filled Telegram message to buyer.

## New tasks (19:16)
- [ ] Signup with captcha + Telegram signup option
- [ ] Buyer dashboard tab in admin panel (Telegram buyers + purchase history)
- [ ] Product photos in /shop and channel post (/setphoto command)
- [ ] Fiat Zelle/Venmo payment buttons in bot (needs ZELLE_HANDLE / VENMO_HANDLE secrets)
