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

- Without an API key: 1-2 requests per second (shared quota, unreliable)
- With an API key: 25,000 queries per day (free tier)

For a small-traffic tool, the free tier is more than sufficient.

---

## HUGGING_FACE_API_KEY

**Optional.** Used to generate AI-powered strategic summaries for each audit via the Hugging Face Inference API (Mistral 7B Instruct).

### How to get one

1. Create a free account at [huggingface.co](https://huggingface.co/)
2. Go to Settings > Access Tokens
3. Create a new token with "Read" permissions
4. Copy the token into your `.env.local`

### Fallback behavior

If this key is missing or the API call fails, the app generates a templated summary using the audit scores. The user experience is still complete -- the AI summary is a value-add, not a requirement.

### Rate limits

- Free tier: approximately 1,000 requests per month
- Requests are kept lightweight (120 max tokens per call)

---

## Production (Netlify)

When deploying to Netlify, set these same variables in:

**Site Settings > Environment Variables**

Do not use the `.env.local` file in production. Netlify injects environment variables at build time and into serverless functions automatically.
