# Architecture

This document explains how the HFX SEO Audit tool works internally.

---

## Overview

The app is a single-page Next.js application. The user enters a URL, the client sends it to a server-side API route, and the results are rendered in-page without navigation.

```
User enters URL
      |
      v
POST /api/analyze  (Next.js API route, runs server-side)
      |
      +---> Google PageSpeed Insights API (mobile)
      |         |
      +---> Google PageSpeed Insights API (desktop)
      |         |
      |    (parallel requests, awaited together)
      |         |
      +---> Hugging Face Inference API (Mistral 7B)
      |         |
      v         v
   Response: scores, vitals, screenshots, issues, AI summary
      |
      v
Client renders ResultsDisplay component
```

---

## API Route: /api/analyze

**File:** `src/app/api/analyze/route.js`

This is the only server-side endpoint. It accepts a POST request with a JSON body containing a `url` field.

### Processing steps

1. **Validation** -- Checks that a URL was provided
2. **PageSpeed requests** -- Fires two parallel requests to the Google PageSpeed Insights API:
   - Mobile strategy (performance, SEO, best-practices categories)
   - Desktop strategy (same categories)
3. **Data extraction** -- From the Lighthouse results, extracts:
   - Category scores (performance, SEO, best practices) as 0-100 integers
   - Core Web Vitals display values (LCP, CLS, TBT, FCP)
   - Final screenshots for both mobile and desktop (base64 data URIs)
   - Performance opportunities sorted by potential time savings (top 4)
   - SEO audit failures (top 4), or wins if none are failing
4. **AI summary** -- Sends a prompt to Hugging Face with the scores and top issues, requesting a two-sentence strategic summary focused on the Halifax market
5. **Fallback** -- If the AI call fails or no key is configured, generates a templated summary from the score data
6. **Response** -- Returns a JSON object with all extracted data

### Response shape

```json
{
  "url": "https://example.com",
  "scores": {
    "mobile": 72,
    "desktop": 91,
    "seo": 85,
    "bestPractices": 95
  },
  "vitals": {
    "lcp": "2.4 s",
    "cls": "0.05",
    "tbt": "150 ms",
    "fcp": "1.2 s"
  },
  "mobileScreenshot": "data:image/jpeg;base64,...",
  "desktopScreenshot": "data:image/jpeg;base64,...",
  "performanceIssues": [
    {
      "title": "Reduce unused JavaScript",
      "saving": "1.2 s",
      "description": "Remove unused JavaScript to reduce bytes consumed by network activity."
    }
  ],
  "seoIssues": [
    {
      "title": "Document does not have a meta description",
      "description": "Meta descriptions may be included in search results to summarize page content."
    }
  ],
  "aiSummary": "Your 72 mobile score means Halifax customers on Bell or Rogers connections..."
}
```

---

## Client-Side Components

### Page (page.js)

The root page manages a single piece of state: the audit result. When `AuditForm` returns data, the result is stored and `ResultsDisplay` renders below with a smooth scroll.

### AuditHero

Static hero section. Headline, subheadline, and a link to the services site.

### AuditForm

Handles URL input, validation (auto-prepends `https://`), and the fetch call to `/api/analyze`. Shows a rotating status message during the 10-15 second analysis window.

### ResultsDisplay

Renders the full audit report:
- Mobile and desktop screenshots side by side
- Score grid (mobile, LCP, SEO, best practices)
- AI summary in a full-width dark block
- Performance issues list with savings values
- SEO issues list
- CTA to scroll to the contact section

### AboutSection

Static list of service capabilities.

### BusinessFAQ

Three FAQ items about local SEO, targeting common questions from Halifax business owners.

### ContactSection

Form powered by Formspree. Collects name, business, website, email, and message. Shows a success state after submission.

---

## Styling

- Tailwind CSS 4 with a custom theme defined in `globals.css`
- Color palette is intentionally minimal: white, stone grays, black
- Typography uses Inter for body and EB Garamond (serif) for headings
- A `.mono-label` utility class provides the monospace uppercase label style used throughout

---

## Third-Party Services

| Service                  | Purpose                     | Cost     |
|--------------------------|-----------------------------|----------|
| Google PageSpeed Insights| Performance and SEO audits  | Free     |
| Hugging Face Inference   | AI summary generation       | Free     |
| Formspree                | Contact form submissions    | Free     |
| Netlify                  | Hosting and CDN             | Free     |
