# Crypto checkout and security hardening — plan

## Scope note
Crypto checkout will cover lawful products only: authorized-user tradelines, credit education, and consulting. It will not be connected to CPN or substitute-SSN packages, because those are commonly used for credit fraud. Those buttons will send visitors to a Telegram inquiry instead of a checkout.

## Recommendation
Use a hosted crypto payment processor that sends signed confirmations to the backend:
- **BTCPay Server** (recommended): free and non-custodial. Funds go straight to your wallet, and no private keys are stored in the app. You need a hosted or self-run instance.
- **NOWPayments or Coinbase Commerce**: the fastest setup. They support many coins, sign their webhooks, and charge a small fee.

Keep the backend functions you already have as the server side. They already run the inquiry form and Telegram alerts correctly, so moving to Cloudflare Functions would mean building it twice. Cloudflare stays the frontend host.

## Phase 1 — Read-only audit (first step, no changes)
I'll produce a report covering:
1. Hosting setup (wrangler config, Lovable hosting) and environment variables.
2. Every table, function and grant, with RLS status, plus a check for any data visitors can reach without signing in.
3. Auth flows and how admin roles are checked.
4. A scan for secrets in the code and built files (names only, never values).
5. All backend functions: input checks, rate limits, CORS, and what they send back to the browser.
6. Places where the app trusts the browser. Issues already visible in the code:
   - The checkout shows "Order Submitted" in the browser only. No order is saved and no payment is checked.
   - The order total comes from the browser cart.
   - There is one fixed Bitcoin address with a static QR code, so payments can't be matched to orders.
   - The "Cashaap" link domain doesn't match the allowed domain in the security policy ("cashaapp").
   - The checkout lists Zelle and Venmo via an email address, which breaks the Telegram-only contact rule.
7. Results from the security scan and database linter, and a list of missing tests.

The audit report comes back to you for approval before any changes.

## Phase 2–3 — Payment build (after audit approval)
- New tables for products/prices, orders, and payment events. Only the server can write to them. Buyers can read only their own orders, and admins can read everything.
- A `create-order` function that sets the price from the server-side catalog, reserves inventory atomically, creates the provider invoice, and returns only the payment link.
- A `payment-webhook` function that:
  - verifies the provider's signature;
  - checks the invoice, order, coin, network and amount;
  - stores each event only once, even if the provider sends it twice;
  - moves orders through server-controlled statuses (pending, paid, underpaid, overpaid, expired, failed), with each change logged.
- A Telegram alert after each verified payment.
- The success page reads the order status from the server. Visiting the success link never marks an order paid.
- Remove the fixed address, the QR code, the Cashaap link and the email-based Zelle/Venmo instructions.

## Phase 4 — Cloudflare hardening (checklist)
A checklist for you to apply, since I can't verify Cloudflare settings from here:
- Security headers, WAF and rate-limit rules for the order and webhook addresses.
- Separate preview and production settings.
- Monitoring for failed webhooks.

## Phase 5 — Tests and delivery
Tests for:
- anonymous, cross-user and admin access;
- invalid input;
- bad webhook signatures and duplicate events;
- two people buying the last item at the same moment.

Plus the security scan, a deployment checklist and a pass/fail/unverified report.

## Needed from you later
- Which processor to use, and its API key and webhook secret (stored server-side only).
- Which products to sell through checkout.
