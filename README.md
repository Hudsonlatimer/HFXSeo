# HFX SEO Audit

A free SEO and performance audit tool built for Halifax small businesses. Enter any URL and get an instant, shareable report covering mobile & desktop performance, Core Web Vitals, SEO, accessibility, screenshots, and an **AI action plan** — an overall grade plus prioritized quick wins.

Live at **[hfxseo.ca](https://hfxseo.ca)**

---

## What It Does

- Runs **parallel mobile + desktop** audits via the Google PageSpeed Insights API (Lighthouse)
- Reports performance, SEO, best-practices, and accessibility scores, plus a single **weighted overall score and A–F grade**
- Rates Core Web Vitals (LCP, CLS, TBT, FCP, SI, TTI) against **Google's good / needs-work / poor thresholds**
- Captures mobile and desktop **screenshots** of the audited page
- Generates an **AI action plan with Groq** (Llama 3.3 70B): a verdict, plain-English summary, business impact, and prioritized **quick wins** — with a heuristic fallback if no key is set
- Tabbed results UI (Overview / Vitals / Issues / Screenshots), animated score gauges, recent-audit history, **share + JSON report export**
- Contact form (Formspree) for prospective clients

## Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)           |
| UI / Styling| React 19, Tailwind CSS 4                     |
| Animation   | Framer Motion                                |
| Icons       | Lucide React                                 |
| Fonts       | Inter (next/font)                            |
| APIs        | Google PageSpeed Insights, Groq Inference    |
| Forms       | Formspree                                     |
| Hosting     | Vercel                                        |

## Quick Start

```bash
git clone https://github.com/Hudsonlatimer/HFXSeo.git
cd HFXSeo
npm install
```

Copy the environment template and add your keys:

```bash
cp .env.example .env.local
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable            | Required | Description                                   |
|---------------------|----------|-----------------------------------------------|
| `PAGESPEED_API_KEY` | Yes      | Google PageSpeed Insights API key             |
| `GROQ_API_KEY`      | No       | Groq API key for the AI action plan           |

The app works without a Groq key — it falls back to a structured heuristic plan of the same shape. Without a PageSpeed key, requests use Google's shared quota (rate-limited but functional).

See [docs/environment.md](docs/environment.md) for setup instructions.

## Deployment

This project is configured for **Vercel** (zero-config Next.js). See [docs/deployment.md](docs/deployment.md) for full instructions.

**Quick deploy:**

1. Push this repo to GitHub
2. Import it at [vercel.com](https://vercel.com) → it auto-detects Next.js
3. Add `PAGESPEED_API_KEY` (and optionally `GROQ_API_KEY`) under Settings → Environment Variables
4. Deploy

`vercel.json` raises the `/api/analyze` function timeout to 60s for the parallel Lighthouse run.

## Project Structure

```
HFXSeo/
  src/
    app/
      api/analyze/route.js   -- POST endpoint: PageSpeed + grade + Groq action plan
      layout.js              -- Root layout, SEO metadata, structured data
      page.js                -- Main page shell (nav, sections, footer)
      globals.css            -- Tailwind theme, design tokens, utilities
      manifest.js / sitemap.js / robots.js / opengraph-image.js
    components/
      AuditHero.js           -- Animated hero
      AuditForm.js           -- URL input, examples, history, progress
      ResultsDisplay.js      -- Tabbed report (gauges, AI plan, vitals, issues, screenshots)
      AboutSection.js        -- How it works + feature grid
      BusinessFAQ.js         -- Accordion FAQ
      ContactSection.js      -- Formspree contact form
      ui/ScoreGauge.js       -- Animated SVG score dial
      ui/CountUp.js          -- Count-up number animation
    lib/utils.js             -- cn() + score/grade/rating helpers
  public/                    -- favicon, skyline art
  vercel.json                -- Vercel function config
  .env.example               -- Environment variable template
```

## Documentation

- [docs/environment.md](docs/environment.md) — Getting and configuring API keys
- [docs/deployment.md](docs/deployment.md) — Deploying to Vercel and custom domain setup
- [docs/architecture.md](docs/architecture.md) — How the audit pipeline works

## Author

**Hudson Latimer**
- [hudsonlatimer.com](https://hudsonlatimer.com)

## License

MIT
