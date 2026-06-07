# Admin Dashboard Guide

The admin dashboard lets you manage the marketplace without touching code. It
lives at **`/admin`** and is gated by a passcode.

> **Demo storage note:** The dashboard stores admin-created products in the
> browser's `localStorage` so it works instantly with no backend. Products you
> add appear in the dashboard and are layered on top of the seed catalog. For a
> production multi-user setup, swap `src/lib/store.ts` for a database behind the
> existing API routes (see the README roadmap).

## Signing in

1. Go to `/admin`.
2. Enter the passcode. The default is `digitalhive-admin`.
3. Change it by setting `NEXT_PUBLIC_ADMIN_PASSCODE` in your environment.

Your session is remembered until you click **Sign out** or close the tab.

## Tabs

### 📊 Analytics
A snapshot of catalog stats (total products, admin-created products, categories,
blog posts) and instructions for connecting Google Analytics. Once
`NEXT_PUBLIC_GA_ID` is set, live page views and events flow into GA4.

### 📦 Products
- **Add a product** using the form on the left: title, descriptions, category,
  image URL, Etsy URL, tags, and the Featured / Bestseller / New flags.
- **Edit** any admin-created product with the pencil icon — the form is
  pre-filled.
- **Delete** with the trash icon.
- New products automatically get a slug and a generated product page at
  `/product/<slug>`.

> Seed (demo) products are read-only in the dashboard. Edit them in
> `src/lib/data/products.ts`.

### 📥 CSV Import
Bulk-import products from a spreadsheet. See the
[CSV Import Guide](./CSV_IMPORT.md) for the exact format. Click **Import sample
rows** to see it in action.

### 🗂️ Categories
View all ten categories and their slugs. To add or rename categories, edit
`src/lib/data/categories.ts` (and add a matching Lucide icon name).

### 📝 Blog
Lists all blog posts with author and reading time. To add articles, edit
`src/lib/data/blog.ts`.

## Adding a product — quick walkthrough

1. Open **Products**.
2. Fill in **Title** (required) and a **Short description**.
3. Pick a **Category**.
4. Paste an **Image URL** (any public image; the host must be allowed in
   `next.config.mjs` — `**` is allowed by default).
5. Paste the **Etsy URL** — this powers the “Buy on Etsy” button and click
   tracking.
6. Add comma-separated **tags**.
7. Toggle **Featured / Bestseller / New** as needed.
8. Click **Add product**. It appears in the list and gets its own page.

## Resetting demo data

Admin-created products live under the `digitalhive:admin:products` key in
`localStorage`. Clear your browser storage for the site to reset them.
