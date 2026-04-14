import { NextResponse } from 'next/server';

export const maxDuration = 60;

const PLACEHOLDER_KEY = 'your_google_pagespeed_api_key_here';
const PARALLEL_PSI_MS = 28000;
const MAX_URL_LENGTH = 2048;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractPsiHttpError(body) {
  const e = body?.error;
  if (!e) return null;
  const fromList = Array.isArray(e.errors) ? e.errors[0]?.message : null;
  return e.message || fromList || null;
}

function isDailyQuotaExceeded(msg) {
  if (!msg || typeof msg !== 'string') return false;
  const m = msg.toLowerCase();
  return (
    m.includes('quota exceeded') ||
    m.includes('queries per day') ||
    m.includes('resource_exhausted') ||
    (m.includes('quota') && m.includes('per day'))
  );
}

function humanizePsiError(msg) {
  if (!msg || typeof msg !== 'string') return msg;
  if (isDailyQuotaExceeded(msg)) {
    return (
      'Google PageSpeed daily quota for this API key is exhausted (each audit uses two API requests: mobile and desktop). ' +
      'The limit usually resets at midnight Pacific. In Google Cloud Console open APIs & Services, select PageSpeed Insights API, ' +
      'then Quotas to raise the cap or enable billing; you can also use a new API key from another project.'
    );
  }
  if (msg.includes('Lighthouse returned error:')) {
    return `${msg} This often clears on a second try, or when using a PageSpeed API key for quota.`;
  }
  return msg;
}

function isRetryablePsiMessage(msg) {
  if (!msg || typeof msg !== 'string') return false;
  const m = msg.toLowerCase();
  return (
    m.includes('something went wrong') ||
    m.includes('lighthouse') ||
    m.includes('timeout') ||
    m.includes('temporar') ||
    m.includes(' rate ') ||
    (m.includes('quota') && !isDailyQuotaExceeded(msg)) ||
    m.includes('503') ||
    m.includes('502') ||
    m.includes('500') ||
    m.includes('429')
  );
}

function isBlockedTarget(hostname) {
  const h = hostname.toLowerCase();
  if (!h || h.length > 253) return true;
  if (h === 'localhost' || h.endsWith('.localhost')) return true;
  if (h.endsWith('.local')) return true;
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (m) {
    const o = m.slice(1, 5).map(Number);
    const [a, b] = o;
    if (a === 127 || a === 0 || a === 10) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  if (h === '[::1]' || h === '::1') return true;
  return false;
}

function buildPsiUrl(targetUrl, strategy, apiKey) {
  const key =
    apiKey && apiKey !== PLACEHOLDER_KEY ? `&key=${encodeURIComponent(apiKey)}` : '';
  const base = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const params = new URLSearchParams();
  params.set('url', targetUrl);
  params.set('strategy', strategy);
  params.append('category', 'performance');
  params.append('category', 'seo');
  params.append('category', 'best-practices');
  return `${base}?${params.toString()}${key}`;
}

function clipDescription(text, fallbackTitle) {
  if (!text || typeof text !== 'string') {
    return fallbackTitle
      ? `${fallbackTitle}. Open the full Lighthouse report for technical detail.`
      : 'See the Lighthouse documentation for this audit.';
  }
  const first = text.includes('. ') ? text.split('. ')[0] : text;
  const trimmed = first.length > 260 ? `${first.slice(0, 257)}…` : first;
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
}

function screenshotFromLighthouse(lhr) {
  const audit = lhr?.audits?.['final-screenshot'];
  const data = audit?.details?.data;
  if (typeof data === 'string' && data.startsWith('data:')) return data;
  return null;
}

function parseLighthouseBundle(json) {
  const lhr = json?.lighthouseResult;
  if (!lhr) return null;
  const audits = lhr.audits || {};
  const cats = lhr.categories || {};
  const perf = cats.performance?.score;
  const seo = cats.seo?.score;
  const bp = cats['best-practices']?.score;
  return {
    performance: perf != null ? Math.round(perf * 100) : null,
    seo: seo != null ? Math.round(seo * 100) : null,
    bestPractices: bp != null ? Math.round(bp * 100) : null,
    vitals: {
      lcp: audits['largest-contentful-paint']?.displayValue ?? '—',
      cls: audits['cumulative-layout-shift']?.displayValue ?? '—',
      tbt: audits['total-blocking-time']?.displayValue ?? '—',
      fcp: audits['first-contentful-paint']?.displayValue ?? '—',
    },
    screenshot: screenshotFromLighthouse(lhr),
    audits,
    lhr,
  };
}

function collectPerformanceIssues(audits, limit) {
  return Object.values(audits)
    .filter((a) => a?.score !== null && a.score < 0.9 && a.details?.type === 'opportunity')
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, limit)
    .map((a) => ({
      title: a.title || 'Performance opportunity',
      description: clipDescription(a.description, a.title),
      saving: a.displayValue || null,
    }));
}

function collectSeoIssues(lhr, limit) {
  const audits = lhr?.audits || {};
  const refs = lhr?.categories?.seo?.auditRefs || [];
  return refs
    .map((r) => audits[r.id])
    .filter((a) => a && a.score !== null && a.score < 1)
    .slice(0, limit)
    .map((a) => ({
      title: a.title || 'SEO audit',
      description: clipDescription(a.description, a.title),
      saving: null,
    }));
}

async function fetchPagespeedJson(targetUrl, strategy, apiKey, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(buildPsiUrl(targetUrl, strategy, apiKey), {
      signal: controller.signal,
      cache: 'no-store',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        extractPsiHttpError(body) || `PageSpeed request failed (${res.status})`;
      throw new Error(msg);
    }
    const topErr = extractPsiHttpError(body);
    if (topErr) {
      throw new Error(topErr);
    }
    if (!body?.lighthouseResult) {
      throw new Error(
        'Google PageSpeed returned no Lighthouse result. The page may be too heavy or temporarily unavailable—retry in a minute.',
      );
    }
    return body;
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(
        'Google PageSpeed timed out. Try again, use a simpler URL, or set PAGESPEED_API_KEY in .env.local for more reliable quota.',
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function runParallelPsi(normalized, apiKey) {
  return Promise.allSettled([
    fetchPagespeedJson(normalized, 'mobile', apiKey, PARALLEL_PSI_MS),
    fetchPagespeedJson(normalized, 'desktop', apiKey, PARALLEL_PSI_MS),
  ]);
}

function buildTemplateSummary({
  host,
  mobile,
  desktop,
  seo,
  bestPractices,
  perfTitles,
  seoTitles,
  lcp,
}) {
  const desk =
    typeof desktop === 'number' ? `${desktop} on desktop` : 'desktop data still pending or blocked';
  const lead =
    typeof mobile === 'number' && mobile < 55
      ? 'Heavy mobile load is likely costing you conversions on cellular networks around the HRM.'
      : typeof mobile === 'number' && mobile < 80
        ? 'You are close to a fast mobile experience; a focused pass on render-blocking work will move the needle.'
        : 'Mobile performance looks solid; keep monitoring Core Web Vitals as you ship new features.';
  const issues = [...perfTitles, ...seoTitles].filter(Boolean).slice(0, 2).join('; ');
  const issueSentence = issues
    ? ` Prioritize: ${issues}.`
    : ' Run another audit after changes to confirm gains.';
  const lcpFrag = lcp && lcp !== '—' ? `LCP (lab): ${lcp}.` : '';
  const topPerf = perfTitles[0];
  const perfLead = topPerf ? `First performance opportunity: ${topPerf}.` : '';
  const tail = [lcpFrag, perfLead, `${lead}${issueSentence}`].filter(Boolean).join(' ');
  return `${host} scores ${mobile}/100 mobile and ${desk}; SEO category ${seo}/100 with best practices ${bestPractices}/100. ${tail}`;
}

function isMarketingFluff(text) {
  if (!text || text.length < 24) return true;
  const t = text.toLowerCase();
  if (/\bwe\b|\bour\b|\bwe'll\b|\bwe are\b/.test(t)) return true;
  if (
    /strive to|exceptional|world-class|cutting-edge|unlock|deliver.*experience|at .* we |proud to|committed to serving|common optimization|potential performance issue|performance opportunity title|indicating a potential/i.test(
      t,
    )
  ) {
    return true;
  }
  return false;
}

function hfSummarySentenceChunks(text) {
  return text
    .split('. ')
    .map((c) => c.trim())
    .filter((c) => c.length > 8);
}

function firstLcpNumber(lcpDisplay) {
  const m = String(lcpDisplay || '').match(/[\d]+(?:\.\d+)?/);
  return m ? m[0] : null;
}

function perfTitleKeywordHits(text, titles) {
  const t = text.toLowerCase();
  return titles.some((title) =>
    title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 5)
      .some((w) => t.includes(w)),
  );
}

function summaryContradictsAudit(text, perfIssueCount, seoIssueCount) {
  if (!text || typeof text !== 'string') return true;
  const t = text.toLowerCase();
  const chunks = hfSummarySentenceChunks(text);
  if (chunks.length !== 2) {
    return true;
  }
  if (chunks[0] && /website:\s*/i.test(chunks[0])) {
    return true;
  }
  if (text.length > 260) {
    return true;
  }
  if (perfIssueCount > 0 && /no issues reported|no issues\b|without issues|nothing to fix/i.test(t)) {
    return true;
  }
  if (
    perfIssueCount > 0 &&
    seoIssueCount === 0 &&
    /seo.*(100|99|98).*no issues|no issues.*seo/i.test(t)
  ) {
    return true;
  }
  if (seoIssueCount === 0 && /\b(still failing|failing list|audits?\s+still\s+fail|seo audits.*fail)/i.test(t)) {
    return true;
  }
  if (seoIssueCount === 0 && /\bhowever\b/i.test(t) && /\bseo\b/i.test(t)) {
    return true;
  }
  return false;
}

function hfSummaryUnusable(text, ctx) {
  const { perfIssueCount, seoIssueCount, lcpDisplay, perfTitles } = ctx;
  if (!text) return true;
  if (isMarketingFluff(text)) return true;
  if (summaryContradictsAudit(text, perfIssueCount, seoIssueCount)) return true;
  const u = text.trim();
  if (/^website:\s*/i.test(u)) {
    return true;
  }
  const lcpNum = firstLcpNumber(lcpDisplay);
  if (perfIssueCount > 0 && lcpNum && !u.includes(lcpNum)) {
    return true;
  }
  if (perfIssueCount > 0 && perfTitles.length && !perfTitleKeywordHits(u, perfTitles.slice(0, 4))) {
    return true;
  }
  return false;
}

async function tryHuggingFaceSummary(prompt, token) {
  if (!token || token.length < 8) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);
  try {
    const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-1B-Instruct:fastest',
        max_tokens: 90,
        temperature: 0.12,
        messages: [
          {
            role: 'system',
            content:
              'Reply with exactly two sentences separated by one space after the first period. Each sentence under 22 words. Third person: "this site" or hostname only—never we, our, or us. First sentence: mobile and desktop scores only. Second sentence: LCP lab value and exactly one performance opportunity title from the user list (or say no opportunities if the list is empty). If SEO score is 100 and the SEO failing list is empty, you may say SEO category passed in one clause only—never mention failing SEO audits or a failing list. No "however", no hedging, no marketing adjectives.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text || text.length < 20) return null;
    return text.replace(/\s+/g, ' ').slice(0, 480);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const { url, aiAnalysis } = raw;
    const wantAi =
      aiAnalysis !== false && aiAnalysis !== 'false' && String(aiAnalysis).toLowerCase() !== '0';
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
      return NextResponse.json({ error: 'Only http and https URLs are allowed' }, { status: 400 });
    }
    if (isBlockedTarget(parsed.hostname)) {
      return NextResponse.json({ error: 'That URL cannot be audited' }, { status: 400 });
    }

    const normalized = parsed.toString();
    const host = parsed.hostname.replace(/^www\./, '');
    const apiKey = process.env.PAGESPEED_API_KEY;
    const hfToken = process.env.HUGGING_FACE_API_KEY;

    let mobileSettled;
    let desktopSettled;

    [mobileSettled, desktopSettled] = await runParallelPsi(normalized, apiKey);

    if (mobileSettled.status === 'rejected') {
      const firstMsg = mobileSettled.reason?.message || '';
      if (isRetryablePsiMessage(firstMsg) && !isDailyQuotaExceeded(firstMsg)) {
        await delay(2200);
        [mobileSettled, desktopSettled] = await runParallelPsi(normalized, apiKey);
      }
    }

    if (mobileSettled.status === 'rejected') {
      const msg =
        mobileSettled.reason?.message ||
        'Google PageSpeed could not complete the mobile audit.';
      const status = isDailyQuotaExceeded(msg) ? 429 : 504;
      return NextResponse.json({ error: humanizePsiError(msg) }, { status });
    }

    const mobileData = mobileSettled.value;
    const desktopData =
      desktopSettled.status === 'fulfilled' ? desktopSettled.value : null;

    const mobileParsed = parseLighthouseBundle(mobileData);
    if (!mobileParsed) {
      return NextResponse.json({ error: 'Unexpected PageSpeed response shape.' }, { status: 502 });
    }

    const desktopParsed = desktopData ? parseLighthouseBundle(desktopData) : null;

    const performanceIssues = collectPerformanceIssues(mobileParsed.audits, 6);
    const seoIssues = collectSeoIssues(mobileParsed.lhr, 6);

    const scores = {
      mobile: mobileParsed.performance ?? 0,
      desktop: desktopParsed?.performance ?? null,
      seo: mobileParsed.seo ?? 0,
      bestPractices: mobileParsed.bestPractices ?? 0,
    };

    const perfTitles = performanceIssues.map((i) => i.title);
    const seoTitles = seoIssues.map((i) => i.title);

    const template = buildTemplateSummary({
      host,
      mobile: scores.mobile,
      desktop: scores.desktop,
      seo: scores.seo,
      bestPractices: scores.bestPractices,
      perfTitles,
      seoTitles,
      lcp: mobileParsed.vitals.lcp,
    });

    let hfRaw = null;
    if (wantAi) {
      const hfPrompt = `Hostname ${host} (do not output the word "Website:" or a label—write sentences only).
Mobile score 0-100: ${scores.mobile}
Desktop score 0-100: ${scores.desktop ?? 'not available'}
SEO category 0-100: ${scores.seo}
Best practices 0-100: ${scores.bestPractices}
LCP lab value (must appear verbatim in sentence two): ${mobileParsed.vitals.lcp}
Performance opportunity titles: ${perfTitles.slice(0, 5).join('; ') || 'none'}
SEO audit failures (titles): ${seoTitles.slice(0, 5).join('; ') || 'none'}

Two sentences only, separated by ". " (period then space). Sentence one: mobile and desktop scores. Sentence two: include the LCP string exactly as given and name one opportunity title using its exact wording. If opportunity list is "none", sentence two is only LCP plus best-practices note.`;
      hfRaw = await tryHuggingFaceSummary(hfPrompt, hfToken);
    }
    const useHf =
      hfRaw &&
      !hfSummaryUnusable(hfRaw, {
        perfIssueCount: performanceIssues.length,
        seoIssueCount: seoIssues.length,
        lcpDisplay: mobileParsed.vitals.lcp,
        perfTitles,
      });
    const aiSummary = useHf ? hfRaw : template;

    return NextResponse.json({
      url: normalized,
      scores,
      vitals: mobileParsed.vitals,
      mobileScreenshot: mobileParsed.screenshot,
      desktopScreenshot: desktopParsed?.screenshot ?? null,
      performanceIssues,
      seoIssues,
      aiSummary,
    });
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : 'Something went wrong. Try again shortly.';
    return NextResponse.json({ error: humanizePsiError(message) }, { status: 500 });
  }
}
