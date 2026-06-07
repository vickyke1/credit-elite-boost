# Installation Guide

This guide walks you through running DigitalHive locally.

## Prerequisites

- **Node.js 18.18+** (Node 20+ recommended) — check with `node --version`
- **npm** (ships with Node), or `pnpm` / `yarn` / `bun` if you prefer

## 1. Get the code

```bash
git clone <your-repo-url>
cd digitalhive
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Copy the example file and edit the values:

```bash
cp .env.example .env.local
```

All variables are optional for local development:

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://digitalhive.com` | Used for canonical URLs, sitemap, OG tags |
| `NEXT_PUBLIC_GA_ID` | _(empty)_ | Google Analytics 4 ID, e.g. `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GSC_VERIFICATION` | _(empty)_ | Google Search Console verification token |
| `NEXT_PUBLIC_ADMIN_PASSCODE` | `digitalhive-admin` | Passcode for `/admin` |

## 4. Start the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

## 5. Production build (optional, to verify)

```bash
npm run build
npm start
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Run the production server (after `build`) |
| `npm run lint` | Run ESLint |

## Troubleshooting

- **Images don't load** — remote images are served from Unsplash. Ensure you
  have network access, or replace the URLs in `src/lib/data/*`. Remote hosts are
  allow-listed in `next.config.mjs`.
- **Fonts fail at build** — the build fetches Google Fonts (Inter, Sora). If you
  are offline, the build may fail; reconnect or self-host the fonts.
- **Port already in use** — run `npm run dev -- -p 3001` to use a different port.
