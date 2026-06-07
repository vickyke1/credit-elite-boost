# Deployment Guide

DigitalHive is optimized for **Vercel**, but runs anywhere that supports
Next.js 15.

## Deploy to Vercel (recommended)

### Option A — Dashboard

1. Push this project to a GitHub/GitLab/Bitbucket repository.
2. Go to <https://vercel.com/new> and **import** the repository.
3. Vercel auto-detects Next.js. Leave the defaults:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Root Directory:** `digitalhive` (if the app lives in a subfolder)
4. Add your **Environment Variables** (see below).
5. Click **Deploy**.

### Option B — CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

## Environment variables (Production)

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://digitalhive.com` |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `abc123...` |
| `NEXT_PUBLIC_ADMIN_PASSCODE` | _(a strong secret)_ |

> After changing env vars, **redeploy** so they take effect.

## Custom domain

1. In **Vercel → Project → Settings → Domains**, add your domain
   (e.g. `digitalhive.com`).
2. Update your DNS records as instructed by Vercel (usually an `A` record to
   `76.76.21.21` or a `CNAME` to `cname.vercel-dns.com`).
3. Set `NEXT_PUBLIC_SITE_URL` to your final domain and redeploy so canonical
   URLs, the sitemap, and OG images resolve correctly.

## Post-deploy checklist

- [ ] Visit `/sitemap.xml` and `/robots.txt` — confirm they show your domain.
- [ ] Submit the sitemap in **Google Search Console**.
- [ ] Confirm Google Analytics is receiving events (Realtime view).
- [ ] Test a **Buy on Etsy** button and verify the `etsy_click` event fires.
- [ ] Open the OG image at `/opengraph-image` and validate with the
      [Twitter Card Validator](https://cards-dev.twitter.com/validator) or
      [opengraph.xyz](https://www.opengraph.xyz/).
- [ ] Change the admin passcode from the default.

## Deploying elsewhere

DigitalHive is a standard Next.js app and also runs on:

- **Netlify** (with the Next.js runtime)
- **Cloudflare Pages**
- **A Node server / Docker** — `npm run build` then `npm start`

For a self-hosted Node deployment, ensure the host runs Node 18.18+ and that the
environment variables above are set.
