import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const PLACEHOLDER_KEY = 'your_google_pagespeed_api_key_here';
const PARALLEL_PSI_MS = 28000;
const MAX_URL_LENGTH = 2048;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/* ----------------------------- URL safety ----------------------------- */

function isBlockedTarget(hostname) {
  const h = hostname.toLowerCase();
  if (!h || h.length > 253) return true;
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local')) return true;
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (m) {
    const [a, b] = m.slice(1, 5).map(Number);
    if (a === 127 || a === 0 || a === 10) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  if (h === '[::1]' || h === '::1') return true;
  return false;
}

/* ----------------------------- PageSpeed ----------------------------- */

function buildPsiUrl(targetUrl, strategy, apiKey) {
  const params = new URLSearchParams();
  params.set('url', targetUrl);
  params.set('strategy', strategy);
  params.append('category', 'performance');
  params.append('category', 'seo');
  params.append('category', 'best-practices');
  params.append('category', 'accessibility');
  const key = apiKey && apiKey !== PLACEHOLDER_KEY ? `&key=${encodeURIComponent(apiKey)}` : '';
  return `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}${key}`;
}

function extractPsiError(body) {
  const e = body?.error;
  if (!e) return null;
  return e.message || (Array.isArray(e.errors) ? e.errors[0]?.message : null) || null;
}

function isDailyQuota(msg) {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return m.includes('quota exceeded') || m.includes('queries per day') || m.includes('resource_exhausted');
}

function safeError(rawMsg) {
  const msg = typeof rawMsg === 'string' ? rawMsg : '';
  if (msg) console.error('[analyze]', msg.slice(0, 1800));
  if (isDailyQuota(msg)) return 'Too many audits today. Please try again tomorrow.';
  if (msg.includes('AbortError') || msg.includes('timeout')) return 'The audit took too long. Try a lighter page.';
  if (/api.?key|invalid key/i.test(msg)) return 'Audit service temporarily unavailable.';
  if (/lighthouse/i.test(msg)) return 'Lighthouse did not finish. Try again in a minute.';
  return 'The audit could not be completed. Please try again.';
}

async function fetchPsi(targetUrl, strategy, apiKey) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PARALLEL_PSI_MS);
  try {
    const res = await fetch(buildPsiUrl(targetUrl, strategy, apiKey), {
      signal: controller.signal,
      cache: 'no-store',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(extractPsiError(body) || `PageSpeed ${res.status}`);
    const topErr = extractPsiError(body);
    if (topErr) throw new Error(topErr);
    if (!body?.lighthouseResult) throw new Error('No Lighthouse result returned.');
    return body;
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error('PageSpeed timeout');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/* ----------------------------- Vitals + thresholds ----------------------------- */

// Google Core Web Vitals / Lighthouse lab thresholds (mobile).
const VITAL_THRESHOLDS = {
  lcp: { good: 2500, ni: 4000, unit: 'ms' },
  cls: { good: 0.1, ni: 0.25, unit: '' },
  tbt: { good: 200, ni: 600, unit: 'ms' },
  fcp: { good: 1800, ni: 3000, unit: 'ms' },
  si: { good: 3400, ni: 5800, unit: 'ms' },
  tti: { good: 3800, ni: 7300, unit: 'ms' },
};

function rate(key, numeric) {
  if (numeric == null) return 'unknown';
  const t = VITAL_THRESHOLDS[key];
  if (!t) return 'unknown';
  if (numeric <= t.good) return 'good';
  if (numeric <= t.ni) return 'needs-improvement';
  return 'poor';
}

function vital(audits, id, key) {
  const a = audits[id];
  return {
    value: a?.displayValue ?? '—',
    numeric: typeof a?.numericValue === 'number' ? a.numericValue : null,
    rating: rate(key, typeof a?.numericValue === 'number' ? a.numericValue : null),
  };
}

function parseLhr(json) {
  const lhr = json?.lighthouseResult;
  if (!lhr) return null;
  const cats = lhr.categories || {};
  const audits = lhr.audits || {};
  const score = (cat) => {
    const s = cats[cat]?.score;
    return s != null ? Math.round(s * 100) : null;
  };
  return {
    performance: score('performance'),
    seo: score('seo'),
    bestPractices: score('best-practices'),
    accessibility: score('accessibility'),
    vitals: {
      lcp: vital(audits, 'largest-contentful-paint', 'lcp'),
      cls: vital(audits, 'cumulative-layout-shift', 'cls'),
      tbt: vital(audits, 'total-blocking-time', 'tbt'),
      fcp: vital(audits, 'first-contentful-paint', 'fcp'),
      si: vital(audits, 'speed-index', 'si'),
      tti: vital(audits, 'interactive', 'tti'),
    },
    screenshot: (() => {
      const d = audits['final-screenshot']?.details?.data;
      return typeof d === 'string' && d.startsWith('data:') ? d : null;
    })(),
    audits,
    lhr,
  };
}

/* ----------------------------- Issues ----------------------------- */

function collectIssues(audits, type, lhr, limit) {
  if (type === 'performance') {
    return Object.values(audits)
      .filter((a) => a?.score !== null && a.score < 0.9 && a.details?.type === 'opportunity')
      .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
      .slice(0, limit)
      .map((a) => ({
        title: a.title,
        description: clipDesc(a.description),
        saving: a.displayValue || null,
        type: 'performance',
      }));
  }
  const refs = lhr?.categories?.[type]?.auditRefs || [];
  return refs
    .map((r) => audits[r.id])
    .filter((a) => a && a.score !== null && a.score < 1)
    .slice(0, limit)
    .map((a) => ({
      title: a.title,
      description: clipDesc(a.description),
      saving: null,
      type,
    }));
}

function clipDesc(text) {
  if (!text) return 'See Lighthouse documentation for this audit.';
  const first = text.includes('. ') ? text.split('. ')[0] : text;
  const trimmed = first.length > 260 ? `${first.slice(0, 257)}…` : first;
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
}

/* ----------------------------- Overall grade ----------------------------- */

function letterGrade(n) {
  if (n == null) return '—';
  if (n >= 90) return 'A';
  if (n >= 80) return 'B';
  if (n >= 70) return 'C';
  if (n >= 50) return 'D';
  return 'F';
}

function overallScore({ mobile, desktop, seo, bestPractices, accessibility }) {
  // Weighted toward mobile performance + SEO, which drive local search outcomes.
  const parts = [
    { v: mobile, w: 0.3 },
    { v: desktop, w: 0.15 },
    { v: seo, w: 0.3 },
    { v: bestPractices, w: 0.1 },
    { v: accessibility, w: 0.15 },
  ].filter((p) => typeof p.v === 'number');
  if (!parts.length) return null;
  const totalW = parts.reduce((s, p) => s + p.w, 0);
  return Math.round(parts.reduce((s, p) => s + p.v * p.w, 0) / totalW);
}

/* ----------------------------- AI (Groq) ----------------------------- */

const AI_SYSTEM = `You are a senior technical SEO consultant writing for a small-business owner who is not technical.
Return ONLY valid JSON matching this exact shape, no markdown, no commentary:
{
  "verdict": "a punchy 4-8 word headline verdict about the site",
  "summary": "2-3 plain-English sentences. Reference the hostname, the mobile and desktop scores, and the single biggest problem. Third person ('this site'). No fluff, no exclamation marks.",
  "businessImpact": "one sentence connecting the findings to real outcomes (lost leads, slower conversions, lower local ranking)",
  "quickWins": [
    { "title": "short imperative fix", "impact": "high|medium|low", "detail": "one sentence on what to do and why it helps" }
  ]
}
Give 3-5 quick wins, ordered by impact (high first). Be specific and technical in the detail but readable.`;

function buildAiPrompt(ctx) {
  return `Hostname: ${ctx.host}
Overall score: ${ctx.overall}/100 (grade ${ctx.grade})
Mobile performance: ${ctx.mobile}/100
Desktop performance: ${ctx.desktop ?? 'unavailable'}
SEO: ${ctx.seo}/100
Best practices: ${ctx.bestPractices}/100
Accessibility: ${ctx.accessibility ?? 'unavailable'}
LCP: ${ctx.vitals.lcp.value} (${ctx.vitals.lcp.rating})
FCP: ${ctx.vitals.fcp.value} (${ctx.vitals.fcp.rating})
CLS: ${ctx.vitals.cls.value} (${ctx.vitals.cls.rating})
TBT: ${ctx.vitals.tbt.value} (${ctx.vitals.tbt.rating})
Top performance issues: ${ctx.perfTitles.slice(0, 5).join('; ') || 'none'}
SEO failures: ${ctx.seoTitles.slice(0, 5).join('; ') || 'none'}
Accessibility failures: ${ctx.a11yTitles.slice(0, 4).join('; ') || 'none'}`;
}

async function groqAnalysis(ctx, apiKey) {
  if (!apiKey) return null;
  try {
    const client = new Groq({ apiKey });
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 900,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: AI_SYSTEM },
        { role: 'user', content: buildAiPrompt(ctx) },
      ],
    });
    const text = completion.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = JSON.parse(text);
    return normalizeAi(parsed);
  } catch (err) {
    console.error('[analyze] groq failed:', err?.message);
    return null;
  }
}

function normalizeAi(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  const wins = Array.isArray(parsed.quickWins)
    ? parsed.quickWins
        .filter((w) => w && (w.title || w.detail))
        .slice(0, 5)
        .map((w) => ({
          title: String(w.title || 'Fix').slice(0, 90),
          impact: ['high', 'medium', 'low'].includes(String(w.impact).toLowerCase())
            ? String(w.impact).toLowerCase()
            : 'medium',
          detail: String(w.detail || '').slice(0, 240),
        }))
    : [];
  const summary = typeof parsed.summary === 'string' ? parsed.summary.replace(/\s+/g, ' ').slice(0, 600) : '';
  if (!summary && !wins.length) return null;
  return {
    verdict: typeof parsed.verdict === 'string' ? parsed.verdict.slice(0, 80) : '',
    summary,
    businessImpact:
      typeof parsed.businessImpact === 'string' ? parsed.businessImpact.replace(/\s+/g, ' ').slice(0, 300) : '',
    quickWins: wins,
    source: 'groq',
  };
}

/* ----------------------------- Template fallback ----------------------------- */

function templateAnalysis(ctx) {
  const { host, mobile, desktop, seo, bestPractices, accessibility, perfTitles, vitals } = ctx;
  const lead =
    mobile < 55
      ? 'Heavy mobile load is likely costing conversions on cellular networks.'
      : mobile < 80
        ? 'Close to a fast mobile experience; a focused pass on render-blocking work will help.'
        : 'Mobile performance looks solid; keep monitoring Core Web Vitals.';

  const summary = `${host} scores ${mobile}/100 on mobile${
    desktop != null ? ` and ${desktop}/100 on desktop` : ''
  }, with SEO at ${seo}/100, best practices at ${bestPractices}/100${
    accessibility != null ? `, and accessibility at ${accessibility}/100` : ''
  }. Largest Contentful Paint is ${vitals.lcp.value}. ${lead}`;

  const wins = [];
  if (vitals.lcp.rating !== 'good')
    wins.push({
      title: 'Speed up Largest Contentful Paint',
      impact: 'high',
      detail: 'Compress the hero image, preload it, and cut render-blocking CSS/JS to paint main content faster.',
    });
  perfTitles.slice(0, 2).forEach((t) =>
    wins.push({ title: t, impact: 'high', detail: 'Flagged by Lighthouse as a top performance opportunity.' }),
  );
  if (seo < 100)
    wins.push({
      title: 'Resolve failing SEO checks',
      impact: 'medium',
      detail: 'Add missing meta descriptions, alt text, and crawlable links so search engines index the page cleanly.',
    });
  if (accessibility != null && accessibility < 90)
    wins.push({
      title: 'Improve accessibility',
      impact: 'medium',
      detail: 'Fix colour contrast and label form fields — better accessibility also helps SEO and usability.',
    });

  return {
    verdict: mobile >= 80 ? 'Solid foundation, room to refine' : 'Performance is holding this site back',
    summary,
    businessImpact:
      mobile < 70
        ? 'Slow mobile loads quietly reduce form submissions and calls from local search.'
        : 'A few targeted fixes can lift rankings and conversions from Halifax-area search.',
    quickWins: wins.slice(0, 5),
    source: 'template',
  };
}

/* ----------------------------- Handler ----------------------------- */

export async function POST(req) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { url, aiAnalysis } = raw;
    const wantAi = aiAnalysis !== false && String(aiAnalysis).toLowerCase() !== 'false';

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    if (url.length > MAX_URL_LENGTH) {
      return NextResponse.json({ error: 'URL is too long' }, { status: 400 });
    }

    let parsed;
    try {
      parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only http/https URLs allowed' }, { status: 400 });
    }
    if (isBlockedTarget(parsed.hostname)) {
      return NextResponse.json({ error: 'That URL cannot be audited' }, { status: 400 });
    }

    const normalized = parsed.toString();
    const host = parsed.hostname.replace(/^www\./, '');
    const apiKey = process.env.PAGESPEED_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const startedAt = Date.now();
    const [mobileResult, desktopResult] = await Promise.allSettled([
      fetchPsi(normalized, 'mobile', apiKey),
      fetchPsi(normalized, 'desktop', apiKey),
    ]);

    if (mobileResult.status === 'rejected') {
      const msg = mobileResult.reason?.message || 'Mobile audit failed';
      return NextResponse.json({ error: safeError(msg) }, { status: isDailyQuota(msg) ? 429 : 504 });
    }

    const mobile = parseLhr(mobileResult.value);
    if (!mobile) {
      return NextResponse.json({ error: 'Incomplete response from PageSpeed.' }, { status: 502 });
    }

    const desktop = desktopResult.status === 'fulfilled' ? parseLhr(desktopResult.value) : null;

    const perfIssues = collectIssues(mobile.audits, 'performance', mobile.lhr, 8);
    const seoIssues = collectIssues(mobile.audits, 'seo', mobile.lhr, 8);
    const a11yIssues = collectIssues(mobile.audits, 'accessibility', mobile.lhr, 6);

    const scores = {
      mobile: mobile.performance ?? 0,
      desktop: desktop?.performance ?? null,
      seo: mobile.seo ?? 0,
      bestPractices: mobile.bestPractices ?? 0,
      accessibility: mobile.accessibility ?? null,
    };
    const overall = overallScore(scores);
    const grade = letterGrade(overall);

    const aiCtx = {
      host,
      overall,
      grade,
      mobile: scores.mobile,
      desktop: scores.desktop,
      seo: scores.seo,
      bestPractices: scores.bestPractices,
      accessibility: scores.accessibility,
      vitals: mobile.vitals,
      perfTitles: perfIssues.map((i) => i.title),
      seoTitles: seoIssues.map((i) => i.title),
      a11yTitles: a11yIssues.map((i) => i.title),
    };

    // When the AI toggle is off, skip analysis entirely — no Groq call, no
    // heuristic summary. The response carries no `ai` field at all.
    let ai = null;
    if (wantAi) {
      ai = templateAnalysis(aiCtx);
      if (groqKey) {
        const groqResult = await groqAnalysis(aiCtx, groqKey);
        if (groqResult) ai = groqResult;
      }
    }

    return NextResponse.json({
      url: normalized,
      host,
      overall,
      grade,
      scores,
      vitals: mobile.vitals,
      mobileScreenshot: mobile.screenshot,
      desktopScreenshot: desktop?.screenshot ?? null,
      performanceIssues: perfIssues,
      seoIssues,
      accessibilityIssues: a11yIssues,
      ai,
      meta: {
        analyzedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        aiSource: ai ? ai.source : 'disabled',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: safeError(message) }, { status: 500 });
  }
}
