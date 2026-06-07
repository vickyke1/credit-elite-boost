# 🐝 DigitalHive

**Discover Premium Digital Products.** — a production-ready marketplace and
discovery platform for digital products: templates, planners, ebooks, design
assets, AI prompts, printables, and more.

DigitalHive functions as a premium **storefront and discovery platform**.
Customers browse products here and, when they click **“Buy on Etsy”**, are
redirected to the corresponding Etsy listing to complete checkout. The platform
is architected to scale from an Etsy traffic funnel into a full standalone
marketplace with direct payments later.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## ✨ Features

- **Next.js 15 App Router** with React Server Components & static generation
- **TypeScript** end to end
- **Tailwind CSS** + **shadcn-style UI** components (Radix primitives)
- **Framer Motion** animations
- **Lucide React** icons
- **Dark / Light mode** with `next-themes`
- **Fully responsive**, mobile-first design
- **SEO optimized**: dynamic metadata, sitemap, robots, JSON-LD structured
  data, Open Graph, Twitter cards, canonical URLs, breadcrumbs
- **Auto-generated Open Graph images** via `next/og`
- **Analytics ready**: Google Analytics 4, outbound Etsy click tracking,
  product click tracking, newsletter & search events
- **Etsy redirect system** — every product has a tracked “Buy on Etsy” button
- **Admin dashboard** — add / edit / delete products, manage categories & blog,
  view analytics, and **bulk import products via CSV**
- **Content included**: 20 demo products, 10 categories, 10 blog articles

## 🗂️ Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, featured, trending, best sellers, new arrivals, categories, benefits, testimonials, FAQ, newsletter, CTAs |
| `/marketplace` | Product grid with search, category filters, sort, pagination |
| `/product/[slug]` | Product page — gallery, info, features, reviews, FAQ, related, Buy on Etsy |
| `/categories` | All categories |
| `/category/[slug]` | Products within a category |
| `/blog` | SEO blog index |
| `/blog/[slug]` | Article with author bio, social sharing, related posts |
| `/about` | Brand story, mission, values |
| `/contact` | Contact form + FAQ |
| `/admin` | Passcode-gated admin dashboard + CSV import |

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then edit values

# 3. Run the dev server
npm run dev                  # http://localhost:3000

# 4. Build for production
npm run build && npm start
```

> Requires Node.js 18.18+ (Node 20+ recommended).

## ⚙️ Environment variables

See [`.env.example`](./.env.example). All are optional for local development.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap, OG) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification token |
| `NEXT_PUBLIC_ADMIN_PASSCODE` | Passcode for the `/admin` dashboard |

## 📦 Project structure

```
digitalhive/
├── src/
│   ├── app/                # App Router pages, layouts, API routes, sitemap, robots
│   ├── components/         # UI primitives + feature components
│   │   ├── ui/             # Button, Card, Input, Accordion, Select, ...
│   │   ├── layout/         # Header, Footer
│   │   └── admin/          # Admin dashboard
│   └── lib/
│       ├── data/           # Products, categories, blog, testimonials, FAQ
│       ├── seo.ts          # Metadata helpers + site config
│       ├── analytics.ts    # Event tracking
│       ├── store.ts        # Admin product store + CSV parser
│       ├── types.ts        # Shared TypeScript types
│       └── utils.ts        # Helpers (cn, slugify, formatters)
└── public/                 # favicon, web manifest
```

## 📚 Guides

- [Installation Guide](./docs/INSTALLATION.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Admin Dashboard Guide](./docs/ADMIN.md)
- [CSV Import Guide](./docs/CSV_IMPORT.md)
- [SEO Guide](./docs/SEO.md)

## 🛣️ Scaling roadmap

DigitalHive ships as an **Etsy funnel** today. To grow into a full marketplace:

1. **Swap the data layer** in `src/lib/data/*` and `src/lib/store.ts` for a
   database (Supabase, Postgres, PlanetScale) behind the existing API routes.
2. **Add authentication** for sellers and customers.
3. **Layer in direct checkout** (Stripe) alongside the Etsy redirect.
4. **Persist analytics** by extending `src/app/api/track/route.ts`.

---

Built with Next.js. DigitalHive is a discovery platform — purchases are
completed on Etsy.
