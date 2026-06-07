# CSV Import Guide

Bulk-add products to DigitalHive from a spreadsheet. Each row becomes a product
with its own auto-generated page at `/product/<slug>`.

## Where

**Admin → CSV Import** (`/admin`, then the *CSV Import* tab).

## Columns

The importer expects a header row with these columns:

| Column | Required | Notes |
| --- | --- | --- |
| `Product Name` | ✅ | Becomes the product title and slug |
| `Description` | – | Full description; the first 140 chars become the short description |
| `Category` | – | Matched by name (e.g. `Business Templates`) → slug. Defaults to Business Templates |
| `Image URL` | – | Public image URL for the product gallery |
| `Etsy URL` | – | Powers the “Buy on Etsy” button + click tracking |
| `Tags` | – | Separate multiple tags with `;` or `|` |

Column order doesn't matter — matching is by header name.

## Example CSV

```csv
Product Name,Description,Category,Image URL,Etsy URL,Tags
Modern Pitch Deck Template,Investor-ready 20-slide pitch deck,Business Templates,https://images.unsplash.com/photo-1551288049-bebda4e38f71,https://www.etsy.com/listing/000/pitch-deck,pitch deck;startup;business
Wedding Guest List Tracker,Printable guest list & RSVP tracker,Printable Forms,https://images.unsplash.com/photo-1519225421980-715cb0215aed,https://www.etsy.com/listing/000/wedding-tracker,wedding;printable;planner
2026 Wall Calendar,Minimalist printable wall calendar,Digital Planners,https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b,https://www.etsy.com/listing/000/calendar,calendar;printable;2026
```

## Steps

1. Prepare your CSV with the header row above.
2. Go to **Admin → CSV Import**.
3. Click **Choose CSV file** and select your file.
4. A confirmation shows how many products were imported.
5. Open **Products** to review, edit, or delete them, or visit
   `/marketplace` to see them live.

> Tip: Click **Import sample rows** on the CSV Import tab to load a couple of
> example products instantly.

## How it works

- Categories are matched by **name** and converted to a slug (e.g.
  `Business Templates` → `business-templates`). Unknown categories fall back to
  `business-templates`.
- Each product gets a unique id and a slug derived from its name.
- New products default to `New Arrival` and a 5★ rating with 0 reviews, which
  you can adjust per product in the Products tab.
- The parser handles quoted fields and commas inside quotes.

## Scaling to a real database

The import logic lives in `src/lib/store.ts` (`parseCsv` and
`importProductsFromCsv`). To persist imports server-side, send the parsed rows
to an API route that writes to your database instead of `localStorage`.
