# HFX SEO Audit

A free SEO and performance audit tool built for Halifax small businesses. Enter any URL and get an instant report covering mobile performance, Core Web Vitals, search visibility, and an AI-generated strategic summary.

Live at **[hfxseo.ca](https://hfxseo.ca)**

---

## What It Does

- Runs parallel mobile and desktop audits via the Google PageSpeed Insights API
- Reports performance scores, SEO scores, best practices, and Core Web Vitals (LCP, CLS, TBT, FCP)
- Captures and displays mobile and desktop screenshots of the audited page
- Identifies the top speed bottlenecks and SEO issues with actionable descriptions
- Generates a two-sentence AI strategic summary using Hugging Face (Mistral 7B)
- Includes a contact form (Formspree) for prospective clients

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 16 (App Router)             |
| Styling     | Tailwind CSS 4                      |
| Animation   | Framer Motion                       |
| Icons       | Lucide React                        |
| Fonts       | Inter, EB Garamond (next/font)      |
| APIs        | Google PageSpeed Insights, Hugging Face Inference |
| Forms       | Formspree                           |
| Hosting     | Netlify                             |

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

| Variable              | Required | Description                              |
|-----------------------|----------|------------------------------------------|
| `PAGESPEED_API_KEY`   | Yes      | Google PageSpeed Insights API key        |
| `HUGGING_FACE_API_KEY`| No       | Hugging Face token for AI summaries      |

The app works without a Hugging Face key -- it falls back to a templated summary. Without a PageSpeed key, requests are rate-limited by Google but still functional.

See [docs/environment.md](docs/environment.md) for setup instructions.

## Deployment

This project is configured for Netlify. See [docs/deployment.md](docs/deployment.md) for full instructions.

**Quick deploy:**

1. Push this repo to GitHub
2. Connect the repo in Netlify
3. Set environment variables in Netlify dashboard under Site Settings > Environment Variables
4. Deploy

The `netlify.toml` and `@netlify/plugin-nextjs` handle everything else automatically.

## Project Structure

```
HFXSeo/
  src/
    app/
      api/analyze/route.js   -- POST endpoint that calls PageSpeed + Hugging Face
      layout.js              -- Root layout with SEO metadata and structured data
      page.js                -- Main page assembling all sections
      globals.css            -- Tailwind theme and base styles
    components/
      AuditHero.js           -- Hero section with headline and CTA
      AuditForm.js           -- URL input form with loading states
      ResultsDisplay.js      -- Full audit results with screenshots and metrics
      AboutSection.js        -- Services/capabilities list
      BusinessFAQ.js         -- FAQ section for local SEO questions
      ContactSection.js      -- Contact form via Formspree
  public/
    robots.txt               -- Search engine directives
  netlify.toml               -- Netlify build configuration
  .env.example               -- Environment variable template
```

## Documentation

- [docs/environment.md](docs/environment.md) -- Getting and configuring API keys
- [docs/deployment.md](docs/deployment.md) -- Deploying to Netlify and custom domain setup
- [docs/architecture.md](docs/architecture.md) -- How the audit pipeline works

## Author

**Hudson Latimer**
- [huddydev.ca](https://huddydev.ca)
- [services.huddydev.ca](https://services.huddydev.ca)

## License

MIT
