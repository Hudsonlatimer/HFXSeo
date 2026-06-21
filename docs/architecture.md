# Architecture

This document explains how the HFX SEO Audit tool works internally.

---

## Overview

The app is a single-page Next.js application. The user enters a URL, the client sends it to a server-side API route, and the results render in-page (in a tabbed report) without navigation.

```
User enters URL
      |
      v
POST /api/analyze  (Next.js route handler, runs server-side on Node)
      |
      +---> Google PageSpeed Insights API (mobile)   ┐
      +---> Google PageSpeed Insights API (desktop)  ┘ parallel, awaited together
      |
      +---> Compute overall weighted score + letter grade
      +---> Rate Core Web Vitals against Google thresholds
      +---> Collect performance / SEO / accessibility issues
      |
      +---> Groq (llama-3.3-70b-versatile) → JSON action plan
      |         (falls back to a heuristic plan if no key / failure)
      v
   Response: overall, grade, scores, rated vitals, screenshots, issues, ai{}
      |
      v
Client renders ResultsDisplay (tabbed: Overview / Vitals / Issues / Screenshots)
```

---

## API Route: /api/analyze

**File:** `src/app/api/analyze/route.js` · `runtime = 'nodejs'`, `maxDuration = 60`

The only server-side endpoint. Accepts `POST` with `{ url, aiAnalysis }`.

### Processing steps

1. **Validation & SSRF guard** — normalizes the URL, allows only http/https, and blocks localhost, `.local`, and private/loopback IP ranges.
2. **PageSpeed requests** — two parallel requests (mobile + desktop) for the performance, SEO, best-practices, and accessibility categories, each with a 28s abort timeout.
3. **Data extraction** — category scores (0–100), Core Web Vitals (display value + numeric value + good/needs-improvement/poor rating), final screenshots, and the top issues per category.
4. **Overall grade** — a weighted blend (mobile 30%, SEO 30%, accessibility 15%, desktop 15%, best practices 10%) mapped to an A–F letter.
5. **AI action plan** — sends the structured context to Groq and requests strict JSON: `verdict`, `summary`, `businessImpact`, and `quickWins[]` (each with `impact` high/medium/low).
6. **Fallback** — if Groq is unavailable, a rule-based `templateAnalysis` returns the same shape so the UI is identical.
7. **Response** — one JSON object plus a `meta` block (`analyzedAt`, `durationMs`, `aiSource`).

### Response shape

```json
{
  "url": "https://example.com",
  "host": "example.com",
  "overall": 78,
  "grade": "C",
  "scores": { "mobile": 72, "desktop": 91, "seo": 85, "bestPractices": 95, "accessibility": 88 },
  "vitals": {
    "lcp": { "value": "2.4 s", "numeric": 2400, "rating": "good" },
    "cls": { "value": "0.05", "numeric": 0.05, "rating": "good" }
  },
  "mobileScreenshot": "data:image/jpeg;base64,...",
  "desktopScreenshot": "data:image/jpeg;base64,...",
  "performanceIssues": [{ "title": "Reduce unused JavaScript", "saving": "1.2 s", "description": "..." }],
  "seoIssues": [{ "title": "Document does not have a meta description", "description": "..." }],
  "accessibilityIssues": [{ "title": "Background and foreground colors...", "description": "..." }],
  "ai": {
    "verdict": "Fast desktop, sluggish mobile",
    "summary": "example.com scores 72/100 on mobile...",
    "businessImpact": "Slow mobile loads quietly reduce calls from local search.",
    "quickWins": [{ "title": "Compress the hero image", "impact": "high", "detail": "..." }],
    "source": "groq"
  },
  "meta": { "analyzedAt": "2026-01-01T00:00:00.000Z", "durationMs": 31200, "aiSource": "groq" }
}
```

---

## Client-Side Components

### page.js
Root page. Holds the audit result in state, renders the nav, ambient `aurora` background, all sections, and the footer. When `AuditForm` returns data, it stores the result and smooth-scrolls to `#results`.

### AuditHero
Animated hero — gradient headline, live status pill, feature chips, trust stats, and parallax on scroll.

### AuditForm
URL input with example domains, a recent-audits list (localStorage), an AI-plan toggle, and a staged progress bar with rotating status messages during the run.

### ResultsDisplay
The tabbed report:
- **Overview** — animated overall grade badge, five category gauges (animated SVG rings), AI summary, business impact, and prioritized quick wins.
- **Core Web Vitals** — each metric colour-coded against Google's thresholds.
- **Issues** — filterable performance / SEO / accessibility lists.
- **Screenshots** — mobile and desktop renders.
Includes Share (Web Share API / clipboard) and a JSON report download.

### Shared UI (`src/components/ui/`)
- `ScoreGauge` — animated circular score dial.
- `CountUp` — count-up number animation, reduced-motion aware.

### AboutSection / BusinessFAQ / ContactSection
"How it works" + feature grid, an accordion FAQ, and a Formspree-powered contact form.

---

## Styling

- Tailwind CSS 4 with a custom theme in `globals.css` (brand teal→blue→indigo accent, glass surfaces, aurora glows, grid texture).
- Custom utilities: `glass`, `accent-gradient`, `text-gradient`, `container-app`, plus `aurora`, `grid-bg`, and `shimmer` helpers.
- Inter throughout; respects `prefers-reduced-motion`.

---

## Third-Party Services

| Service                   | Purpose                          | Cost |
|---------------------------|----------------------------------|------|
| Google PageSpeed Insights | Performance, SEO, a11y audits    | Free |
| Groq (Llama 3.3 70B)      | AI action-plan generation        | Free |
| Formspree                 | Contact form submissions         | Free |
| Vercel                    | Hosting, CDN, serverless funcs   | Free |
