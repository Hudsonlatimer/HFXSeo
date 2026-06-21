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

**Required.** Used to query the Google PageSpeed Insights API for performance, SEO, accessibility, and best-practices data.

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

## GROQ_API_KEY

**Optional.** Used to generate the AI action plan (verdict, plain-English summary, business impact, and prioritized quick wins). Runs on Groq's free, extremely fast inference using `llama-3.3-70b-versatile`.

### How to get one

1. Create a free account at [console.groq.com](https://console.groq.com/)
2. Go to **API Keys** and create a new key
3. Copy it into your `.env.local`

### Fallback behavior

If this key is missing or the API call fails, the app generates a structured heuristic analysis from the audit scores — same shape (verdict, summary, quick wins), just rule-based instead of model-generated. The user experience stays complete; the AI plan is a value-add, not a requirement.

### Cost

Groq's free tier covers typical usage for this tool at no cost. Each audit sends ~400 input tokens and receives ~500 output tokens.

---

## Production (Vercel)

Set both variables under **Project > Settings > Environment Variables** in the Vercel dashboard (Production, Preview, and Development as needed). Do not commit `.env.local`.
