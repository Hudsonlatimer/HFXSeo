# Deployment

This project is optimized for [Vercel](https://vercel.com), the platform built by the creators of Next.js. Server-side rendering, the `/api/analyze` route, image handling, and `sitemap`/`robots`/`manifest` routes all work with zero extra configuration.

---

## Prerequisites

- A [Vercel](https://vercel.com) account
- This repository pushed to GitHub

---

## Deploy to Vercel

### Option 1: Vercel Dashboard (recommended)

1. Log in to [vercel.com](https://vercel.com) and click **Add New… > Project**
2. Import your GitHub repository (`Hudsonlatimer/HFXSeo`)
3. Vercel auto-detects Next.js — no build settings to change
4. Add your environment variables (see below) before the first deploy
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel            # preview deploy
vercel --prod     # production deploy
```

---

## Environment Variables

In **Project > Settings > Environment Variables**, add:

| Variable            | Required | Value                  |
|---------------------|----------|------------------------|
| `PAGESPEED_API_KEY` | Yes      | Your Google API key    |
| `GROQ_API_KEY`      | No       | Your Groq API key      |

Redeploy after changing variables (they are injected at build/runtime, not picked up live).

### Function duration

`vercel.json` sets the `/api/analyze` function `maxDuration` to 60 seconds, since a parallel mobile + desktop Lighthouse run can take ~30–45s. On the Hobby plan, 60s is the maximum.

---

## Custom Domain (hfxseo.ca)

1. In Vercel: **Project > Settings > Domains > Add** → enter `hfxseo.ca`
2. At your registrar, point DNS at Vercel:
   - Apex (`hfxseo.ca`): `A` record → `76.76.21.21`
   - `www`: `CNAME` → `cname.vercel-dns.com`
   - (Or switch nameservers to Vercel and let it manage records.)
3. Vercel provisions a free SSL certificate automatically once DNS propagates.
4. Set the primary domain to `hfxseo.ca`; Vercel redirects `www` automatically.

---

## Troubleshooting

**Build fails with "missing environment variable"**
The build itself does not require API keys — they are only read at runtime by `/api/analyze`. Check the build log for a syntax or dependency error instead.

**API route returns 500 / 504 in production**
Verify `PAGESPEED_API_KEY` is set in Vercel. A 504 usually means Lighthouse exceeded the function timeout on a heavy page — retry or test a lighter URL.

**AI plan looks generic**
That's the heuristic fallback. Add `GROQ_API_KEY` in Vercel and redeploy to get model-generated analysis (look for the "Powered by Groq" badge on results).
