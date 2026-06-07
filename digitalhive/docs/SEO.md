# SEO Guide

DigitalHive ships with a complete technical-SEO foundation. This guide explains
what's included and how to configure it.

## What's built in

| Feature | Where |
| --- | --- |
| **Dynamic metadata** (title, description, keywords) | `src/lib/seo.ts` → `buildMetadata()`, used by every page |
| **Canonical URLs** | `alternates.canonical` in `buildMetadata()` |
| **Open Graph + Twitter cards** | `buildMetadata()` + auto-generated images |
| **Auto-generated OG image** | `src/app/opengraph-image.tsx` (via `next/og`) |
| **Per-product / per-article OG images** | Product & blog pages pass their own image |
| **JSON-LD structured data** | `src/components/structured-data.tsx` |
| **Breadcrumbs (visual + JSON-LD)** | `src/components/breadcrumbs.tsx` |
| **Sitemap** | `src/app/sitemap.ts` → `/sitemap.xml` |
| **robots.txt** | `src/app/robots.ts` → `/robots.txt` |
| **Search Console verification** | `NEXT_PUBLIC_GSC_VERIFICATION` env var |

## Structured data (Schema.org)

The following JSON-LD types are emitted:

- **Organization** & **WebSite** (with `SearchAction`) — site-wide in the root
  layout.
- **Product** — on every product page, including `AggregateRating` and `Offer`.
- **BlogPosting** — on every article.
- **BreadcrumbList** — wherever breadcrumbs appear.

Validate with the [Rich Results Test](https://search.google.com/test/rich-results).

## Configuration

### 1. Set your domain
In production, set `NEXT_PUBLIC_SITE_URL` to your real domain. This drives
canonical URLs, the sitemap, robots, and absolute OG image URLs.

```bash
NEXT_PUBLIC_SITE_URL=https://digitalhive.com
```

### 2. Edit default metadata
Update the site name, tagline, description, keywords, and social handle in
`src/lib/seo.ts`:

```ts
export const siteConfig = {
  name: "DigitalHive",
  tagline: "Discover Premium Digital Products.",
  description: "...",
  keywords: ["digital products", "templates", ...],
  twitter: "@digitalhive",
};
```

### 3. Per-page metadata
Each page exports `metadata` (or `generateMetadata`) via `buildMetadata`:

```ts
export const metadata = buildMetadata({
  title: "Marketplace",
  description: "Browse the full DigitalHive marketplace...",
  path: "/marketplace",
});
```

Pass `image` to override the auto-generated OG image, `keywords` for custom
keywords, `type: "article"` for blog/product pages, and `noIndex: true` to keep
a page (like `/admin`) out of search engines.

## Submitting to search engines

1. Deploy with `NEXT_PUBLIC_SITE_URL` set.
2. Add the property in **Google Search Console**.
3. Verify via the meta tag — set `NEXT_PUBLIC_GSC_VERIFICATION` to the token and
   redeploy (it renders into `<head>` automatically).
4. Submit `https://your-domain.com/sitemap.xml`.
5. Repeat for **Bing Webmaster Tools** if desired.

## Content SEO tips

- The blog (`/blog`) is built for keyword-targeted articles — add posts in
  `src/lib/data/blog.ts` targeting digital-product search terms.
- Product titles and tags feed both on-site search and metadata keywords — keep
  them descriptive and keyword-rich.
- Internal linking is everywhere (categories ↔ products ↔ blog) to spread link
  equity.

## Performance = SEO

Core Web Vitals are a ranking factor. DigitalHive is built for speed:

- **Static generation (SSG)** for all content pages.
- **Server Components** by default; client JS only where needed.
- **`next/image`** optimization with responsive `sizes` and lazy loading.
- **Font optimization** via `next/font` (Inter + Sora).
- Minimal client bundles.

Run [PageSpeed Insights](https://pagespeed.web.dev/) or Lighthouse against your
deployed URL to confirm scores.
