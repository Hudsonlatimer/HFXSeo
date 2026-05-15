# Environment Variables

This project requires API keys stored in a `.env.local` file at the project root. This file is gitignored and must never be committed.

## Setup

1. Copy the template:

```bash
cp .env.example .env.local
```

2. Fill in your keys as described below.

---

## PAGESPEED_API_KEY

**Required.** Used to query the Google PageSpeed Insights API for performance and SEO data.

### How to get one

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to APIs and Services > Library
4. Search for "PageSpeed Insights API" and enable it
5. Go to APIs and Services > Credentials
6. Click "Create Credentials" > "API Key"
7. Copy the key into your `.env.local`

### Rate limits

- Without an API key: shared public quota only (thin and unreliable for production).
- With an API key: Google assigns a **per-project** daily cap. This app runs **two queries per audit** (mobile + desktop), so usable audits per day are roughly half the query cap.
- If you see quota errors: wait for daily reset (midnight Pacific), create a new key in another GCP project, or request a higher limit in Cloud Console.

---

## ANTHROPIC_API_KEY

**Optional.** Used to generate AI-powered strategic summaries via Claude Haiku 4.5 (cheapest Claude model).

### How to get one

1. Create an account at [console.anthropic.com](https://console.anthropic.com/)
2. Go to Settings > API Keys
3. Create a new key
4. Copy it into your `.env.local`

### Fallback behavior

If this key is missing or the API call fails, the app generates a templated summary from the audit scores. The user experience is still complete — the AI summary is a value-add, not a requirement.

### Cost

- Claude Haiku 4.5: $0.80/MTok input, $4/MTok output
- Each audit uses ~300 input tokens + ~100 output tokens ≈ $0.0006 per audit

---

## Production (Netlify)

Set these variables in **Site Settings > Environment Variables**. Do not use `.env.local` in production.
