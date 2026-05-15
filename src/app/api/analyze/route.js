import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const PLACEHOLDER_KEY = 'your_google_pagespeed_api_key_here';
const PARALLEL_PSI_MS = 28000;
const MAX_URL_LENGTH = 2048;

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
      lcp: audits['largest-contentful-paint']?.displayValue ?? '—',
      cls: audits['cumulative-layout-shift']?.displayValue ?? '—',
      tbt: audits['total-blocking-time']?.displayValue ?? '—',
      fcp: audits['first-contentful-paint']?.displayValue ?? '—',
      si: audits['speed-index']?.displayValue ?? '—',
      tti: audits['interactive']?.displayValue ?? '—',
    },
    screenshot: (() => {
      const d = audits['final-screenshot']?.details?.data;
      return typeof d === 'string' && d.startsWith('data:') ? d : null;
    })(),
    audits,
    lhr,
  };
}

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
  const refs = lhr?.categories?.seo?.auditRefs || [];
  return refs
    .map((r) => audits[r.id])
    .filter((a) => a && a.score !== null && a.score < 1)
    .slice(0, limit)
    .map((a) => ({
      title: a.title,
      description: clipDesc(a.description),
      saving: null,
      type: 'seo',
    }));
}

function collectAccessibilityIssues(audits, lhr, limit) {
  const refs = lhr?.categories?.accessibility?.auditRefs || [];
  return refs
    .map((r) => audits[r.id])
    .filter((a) => a && a.score !== null && a.score < 1)
    .slice(0, limit)
    .map((a) => ({
      title: a.title,
      description: clipDesc(a.description),
      saving: null,
      type: 'accessibility',
    }));
}

function clipDesc(text) {
  if (!text) return 'See Lighthouse documentation for this audit.';
  const first = text.includes('. ') ? text.split('. ')[0] : text;
  const trimmed = first.length > 260 ? `${first.slice(0, 257)}…` : first;
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
}

async function claudeSummary(prompt, apiKey) {
  if (!apiKey) return null;
  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system:
        'You are a concise SEO consultant. Write exactly 2-3 short sentences. Third person only ("this site", use the hostname). First sentence: state the mobile and desktop performance scores. Second sentence: mention the LCP value and the top performance issue. Third sentence (optional): one actionable recommendation. No marketing fluff, no "we", no exclamation marks. Be direct and technical.',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content?.[0]?.text?.trim();
    if (!text || text.length < 20) return null;
    return text.replace(/\s+/g, ' ').slice(0, 500);
  } catch {
    return null;
  }
}

function templateSummary({ host, mobile, desktop, seo, bestPractices, accessibility, perfTitles, lcp }) {
  const lead =
    mobile < 55
      ? 'Heavy mobile load is likely costing conversions on cellular networks.'
      : mobile < 80
        ? 'Close to a fast mobile experience; a focused pass on render-blocking work will help.'
        : 'Mobile performance looks solid; keep monitoring Core Web Vitals.';
  const top = perfTitles[0] ? ` Top priority: ${perfTitles[0]}.` : '';
  return `${host} scores ${mobile}/100 mobile${desktop != null ? ` and ${desktop}/100 desktop` : ''}. SEO ${seo}/100, best practices ${bestPractices}/100${accessibility != null ? `, accessibility ${accessibility}/100` : ''}. LCP: ${lcp}. ${lead}${top}`;
}

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
    const claudeKey = process.env.ANTHROPIC_API_KEY;

    const [mobileResult, desktopResult] = await Promise.allSettled([
      fetchPsi(normalized, 'mobile', apiKey),
      fetchPsi(normalized, 'desktop', apiKey),
    ]);

    if (mobileResult.status === 'rejected') {
      const msg = mobileResult.reason?.message || 'Mobile audit failed';
      return NextResponse.json(
        { error: safeError(msg) },
        { status: isDailyQuota(msg) ? 429 : 504 },
      );
    }

    const mobile = parseLhr(mobileResult.value);
    if (!mobile) {
      return NextResponse.json({ error: 'Incomplete response from PageSpeed.' }, { status: 502 });
    }

    const desktop = desktopResult.status === 'fulfilled' ? parseLhr(desktopResult.value) : null;

    const perfIssues = collectIssues(mobile.audits, 'performance', mobile.lhr, 8);
    const seoIssues = collectIssues(mobile.audits, 'seo', mobile.lhr, 8);
    const a11yIssues = collectAccessibilityIssues(mobile.audits, mobile.lhr, 6);

    const scores = {
      mobile: mobile.performance ?? 0,
      desktop: desktop?.performance ?? null,
      seo: mobile.seo ?? 0,
      bestPractices: mobile.bestPractices ?? 0,
      accessibility: mobile.accessibility ?? null,
    };

    const perfTitles = perfIssues.map((i) => i.title);
    const seoTitles = seoIssues.map((i) => i.title);

    let aiSummary = templateSummary({
      host,
      mobile: scores.mobile,
      desktop: scores.desktop,
      seo: scores.seo,
      bestPractices: scores.bestPractices,
      accessibility: scores.accessibility,
      perfTitles,
      lcp: mobile.vitals.lcp,
    });

    if (wantAi && claudeKey) {
      const prompt = `Hostname: ${host}
Mobile performance: ${scores.mobile}/100
Desktop performance: ${scores.desktop ?? 'unavailable'}
SEO: ${scores.seo}/100
Best practices: ${scores.bestPractices}/100
Accessibility: ${scores.accessibility ?? 'unavailable'}
LCP (lab): ${mobile.vitals.lcp}
FCP: ${mobile.vitals.fcp}
CLS: ${mobile.vitals.cls}
TBT: ${mobile.vitals.tbt}
Top performance issues: ${perfTitles.slice(0, 4).join('; ') || 'none'}
SEO failures: ${seoTitles.slice(0, 4).join('; ') || 'none'}`;

      const claudeResult = await claudeSummary(prompt, claudeKey);
      if (claudeResult) aiSummary = claudeResult;
    }

    return NextResponse.json({
      url: normalized,
      scores,
      vitals: mobile.vitals,
      mobileScreenshot: mobile.screenshot,
      desktopScreenshot: desktop?.screenshot ?? null,
      performanceIssues: perfIssues,
      seoIssues,
      accessibilityIssues: a11yIssues,
      aiSummary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: safeError(message) }, { status: 500 });
  }
}
