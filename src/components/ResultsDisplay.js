'use client';
import { motion } from 'framer-motion';
import {
  Zap,
  Gauge,
  Search,
  ShieldCheck,
  Smartphone,
  Monitor,
  Camera,
  AlignLeft,
} from 'lucide-react';

function scoreTone(n) {
  if (n == null || Number.isNaN(n)) return 'text-zinc-500';
  if (n >= 90) return 'text-zinc-100';
  if (n >= 50) return 'text-zinc-300';
  return 'text-zinc-500';
}

function ScoreRing({ value, label, sub }) {
  const n = typeof value === 'number' ? value : null;
  const pct = n == null ? 0 : Math.min(100, Math.max(0, n));
  return (
    <div className="surface-panel relative flex flex-col items-center gap-3 p-6 text-center sm:p-8">
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-full sm:h-36 sm:w-36"
        style={{
          background: `conic-gradient(rgb(212 212 216) ${pct * 3.6}deg, rgba(63, 63, 70, 0.35) 0)`,
        }}
      >
        <div className="absolute inset-1.5 flex flex-col items-center justify-center rounded-full bg-[#121214] sm:inset-2">
          <span className={`text-3xl font-light tabular-nums sm:text-4xl ${scoreTone(n)}`}>
            {n == null ? '—' : n}
          </span>
          <span className="mono-label mt-1 text-[9px] text-zinc-600">/ 100</span>
        </div>
      </div>
      <div>
        <p className="mono-label mb-1 text-zinc-500">{label}</p>
        {sub && <p className="text-xs text-zinc-600">{sub}</p>}
      </div>
    </div>
  );
}

export default function ResultsDisplay({ data }) {
  if (!data) return null;

  const host = data.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const m = typeof data.scores?.mobile === 'number' ? data.scores.mobile : null;
  const d = typeof data.scores?.desktop === 'number' ? data.scores.desktop : null;

  const handleShare = () => {
    const line =
      m != null
        ? `HFX SEO audit: ${host} — mobile ${m}/100${d != null ? `, desktop ${d}/100` : ''}.`
        : `HFX SEO audit completed for ${host}.`;
    if (navigator.share) {
      navigator.share({ title: 'HFX SEO audit', text: line, url: 'https://hfxseo.ca' });
    } else {
      navigator.clipboard.writeText(line);
    }
  };

  const perfList = data.performanceIssues || [];
  const seoList = data.seoIssues || [];
  const issues = [...perfList, ...seoList];
  const perfCount = perfList.length;
  const seoCount = seoList.length;

  const resultsIntro =
    d == null
      ? 'Lighthouse lab data for Nova Scotia sites. Mobile and desktop are requested in parallel; if desktop shows a dash, Google did not return that run in time—retry once or check your API key quota.'
      : 'Lighthouse lab data for Nova Scotia sites. Both mobile and desktop runs completed; scores reflect Google’s lab environment (not field CrUX data).';

  const issuesIntro =
    perfCount > 0 && seoCount > 0
      ? 'Performance items are ordered by estimated impact. SEO rows are failing Lighthouse checks you should fix next.'
      : perfCount > 0 && seoCount === 0
        ? 'Performance items are ordered by estimated impact. The SEO category had no failing audits in this run—focus on speed work below.'
        : perfCount === 0 && seoCount > 0
          ? 'These SEO items failed Lighthouse checks; there were no large performance opportunities flagged in this run.'
          : 'No major Lighthouse issues were flagged in this run for the categories requested.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-auto max-w-6xl px-[max(1.5rem,env(safe-area-inset-left))] pb-[max(8rem,env(safe-area-inset-bottom))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-8 md:pt-12"
      id="results"
    >
      <div className="mb-16 border-l-2 border-zinc-700 pl-6 md:pl-8">
        <p className="mono-label mb-3 text-zinc-500">Results</p>
        <h2 className="mb-4 break-words text-3xl font-light tracking-tight text-white sm:text-4xl md:text-6xl">
          {host}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">{resultsIntro}</p>
      </div>

      <div className="mb-16 grid gap-6 md:grid-cols-2">
        <ScoreRing value={m} label="Mobile performance" sub="Primary signal" />
        <ScoreRing
          value={d}
          label="Desktop performance"
          sub={d == null ? 'Not returned (timeout or error)' : 'Lab, wired profile'}
        />
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: 'LCP', v: data.vitals?.lcp, icon: Zap, hint: 'Largest Contentful Paint' },
          { k: 'CLS', v: data.vitals?.cls, icon: Gauge, hint: 'Cumulative Layout Shift' },
          { k: 'TBT', v: data.vitals?.tbt, icon: Gauge, hint: 'Total Blocking Time' },
          { k: 'FCP', v: data.vitals?.fcp, icon: Gauge, hint: 'First Contentful Paint' },
        ].map(({ k, v, icon: Icon, hint }) => (
          <div key={k} className="surface-panel flex items-start gap-4 p-5">
            <div className="rounded-md border border-white/[0.08] bg-white/[0.03] p-2 text-zinc-400">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="mono-label text-[10px] text-zinc-600">{hint}</p>
              <p className="text-lg font-medium text-white">{k}</p>
              <p className="mt-1 text-2xl font-light tabular-nums text-zinc-200">{v ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <Search className="h-4 w-4 text-zinc-500" aria-hidden />
            <span className="text-sm">
              SEO <strong className="text-zinc-200">{data.scores?.seo ?? '—'}</strong>
              <span className="text-zinc-600"> /100</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-zinc-500" aria-hidden />
            <span className="text-sm">
              Best practices{' '}
              <strong className="text-zinc-200">{data.scores?.bestPractices ?? '—'}</strong>
              <span className="text-zinc-600"> /100</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="mono-label flex min-h-11 items-center rounded-md border border-white/10 px-4 text-[10px] text-zinc-500 transition-colors hover:border-white/15 hover:text-zinc-300"
        >
          Copy summary
        </button>
      </div>

      <div className="surface-panel mb-16 p-6 sm:p-8 md:p-10">
        <div className="mb-4 flex items-center gap-2">
          <AlignLeft className="h-5 w-5 text-zinc-500" aria-hidden />
          <h3 className="text-xl font-light text-white">Summary</h3>
        </div>
        <p className="text-base leading-relaxed text-zinc-400 sm:text-lg md:text-xl">{data.aiSummary}</p>
      </div>

      <div className="mb-20 grid gap-10 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="mono-label flex items-center gap-2 text-zinc-600">
              <Smartphone className="h-3.5 w-3.5" aria-hidden />
              Mobile
            </span>
            <span className="mono-label text-[9px] text-zinc-700">Lighthouse</span>
          </div>
          <div className="aspect-[9/16] max-w-sm overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-950">
            {data.mobileScreenshot ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- Lighthouse data URLs */}
                <img
                  src={data.mobileScreenshot}
                  alt={`Mobile render of ${host}`}
                  className="h-full w-full object-cover object-top"
                />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <Camera className="h-8 w-8 text-zinc-700" aria-hidden />
                <p className="mono-label text-[10px] text-zinc-600">No screenshot in this response.</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="mono-label flex items-center gap-2 text-zinc-600">
              <Monitor className="h-3.5 w-3.5" aria-hidden />
              Desktop
            </span>
            <span className="mono-label text-[9px] text-zinc-700">Lighthouse</span>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-950">
            {data.desktopScreenshot ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- Lighthouse data URLs */}
                <img
                  src={data.desktopScreenshot}
                  alt={`Desktop render of ${host}`}
                  className="h-full w-full object-cover object-top"
                />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <Camera className="h-8 w-8 text-zinc-700" aria-hidden />
                <p className="mono-label max-w-xs text-[10px] text-zinc-600">
                  {d == null
                    ? 'Desktop pass did not finish in time. Retry or check hosting limits.'
                    : 'No screenshot in this response.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-24">
        <h3 className="mb-3 text-3xl font-light text-white md:text-4xl">Prioritized issues</h3>
        <p className="mb-10 max-w-xl text-zinc-500">{issuesIntro}</p>
        <ul className="space-y-3">
          {issues.length === 0 && (
            <li className="surface-panel p-8 text-zinc-500">No major issues in this run.</li>
          )}
          {issues.map((issue, i) => {
            const isPerf = i < (data.performanceIssues?.length || 0);
            const desc =
              typeof issue.description === 'string' && issue.description.length > 0
                ? issue.description
                : 'See Lighthouse documentation for this audit.';
            return (
              <li
                key={`${issue.title}-${i}`}
                className="surface-panel p-6 transition-colors hover:border-white/[0.1]"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="mono-label rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] text-zinc-400">
                    {isPerf ? 'Performance' : 'SEO'}
                  </span>
                  {issue.saving && (
                    <span className="mono-label text-[9px] text-zinc-500">{issue.saving}</span>
                  )}
                </div>
                <h4 className="mb-2 text-lg font-medium text-zinc-100">{issue.title}</h4>
                <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-white/[0.06] pt-16 text-center">
        <h3 className="mb-4 text-3xl font-light text-white md:text-5xl">Implementation help</h3>
        <p className="mx-auto mb-10 max-w-xl text-zinc-500">
          If you want these items fixed on a deadline, send a note with your URL and goals.
        </p>
        <button
          type="button"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="min-h-11 rounded-md bg-zinc-100 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white sm:px-10 sm:py-4"
        >
          Contact
        </button>
      </div>
    </motion.div>
  );
}
