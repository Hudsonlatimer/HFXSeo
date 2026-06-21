'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShieldCheck, Accessibility, Smartphone, Monitor, Camera, Zap, Clock, Eye,
  Gauge, TrendingUp, Share2, Download, Sparkles, Check, ArrowUpRight, Layers, Activity, ListChecks,
} from 'lucide-react';
import { scoreHex, scoreTone, scoreLabel, ratingMeta } from '@/lib/utils';
import ScoreGauge from '@/components/ui/ScoreGauge';
import CountUp from '@/components/ui/CountUp';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'vitals', label: 'Core Web Vitals', icon: Activity },
  { id: 'issues', label: 'Issues', icon: ListChecks },
  { id: 'screens', label: 'Screenshots', icon: Camera },
];

const IMPACT = {
  high: 'border-red-500/30 bg-red-500/10 text-red-300',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
};

const VITAL_DEFS = [
  { key: 'lcp', label: 'LCP', name: 'Largest Contentful Paint', icon: Zap },
  { key: 'cls', label: 'CLS', name: 'Cumulative Layout Shift', icon: Eye },
  { key: 'tbt', label: 'TBT', name: 'Total Blocking Time', icon: Clock },
  { key: 'fcp', label: 'FCP', name: 'First Contentful Paint', icon: Gauge },
  { key: 'si', label: 'SI', name: 'Speed Index', icon: TrendingUp },
  { key: 'tti', label: 'TTI', name: 'Time to Interactive', icon: Gauge },
];

export default function ResultsDisplay({ data }) {
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  if (!data) return null;

  const host = data.host || data.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const { overall, grade, scores, vitals, ai } = data;
  const perfList = data.performanceIssues || [];
  const seoList = data.seoIssues || [];
  const a11yList = data.accessibilityIssues || [];

  const handleShare = async () => {
    const line = `HFX SEO audit — ${host}: overall ${overall}/100 (grade ${grade}), mobile ${scores.mobile}/100, SEO ${scores.seo}/100. https://hfxseo.ca`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'HFX SEO audit', text: line, url: 'https://hfxseo.ca' });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hfxseo-${host}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pb-28 pt-10" id="results">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-5">
          <GradeBadge grade={grade} value={overall} />
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Audit results</p>
            <h2 className="break-all text-2xl font-semibold tracking-tight text-white sm:text-3xl">{host}</h2>
            {ai?.verdict && <p className="mt-1 text-sm text-accent">{ai.verdict}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Share'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            <Download className="h-3.5 w-3.5" />
            Report
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-10 flex gap-1 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card/60 p-1.5">
        {TABS.map((t) => {
          const active = tab === t.id;
          const count = t.id === 'issues' ? perfList.length + seoList.length + a11yList.length : null;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? 'text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {active && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-xl accent-gradient" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <span className="relative flex items-center gap-2">
                <t.icon className="h-4 w-4" aria-hidden />
                {t.label}
                {count != null && count > 0 && (
                  <span className={`rounded-full px-1.5 text-[10px] ${active ? 'bg-black/20' : 'bg-white/10'}`}>{count}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {tab === 'overview' && <Overview data={data} host={host} />}
          {tab === 'vitals' && <Vitals vitals={vitals} />}
          {tab === 'issues' && <Issues perfList={perfList} seoList={seoList} a11yList={a11yList} />}
          {tab === 'screens' && <Screens data={data} host={host} />}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-10 text-center"
      >
        <h3 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">Want these fixed for you?</h3>
        <p className="mx-auto mb-8 max-w-xl text-zinc-400">
          Huddy Digital helps Halifax &amp; Nova Scotia businesses turn these scores into faster
          sites and more leads.
        </p>
        <a
          href="https://huddydigital.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl accent-gradient px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5"
        >
          Get in touch <ArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
}

/* ----------------------------- Sub-views ----------------------------- */

function GradeBadge({ grade, value }) {
  const color = scoreHex(value);
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      className="relative flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border"
      style={{ borderColor: `${color}55`, background: `${color}12` }}
    >
      <span className="text-3xl font-bold leading-none" style={{ color }}>{grade}</span>
      <span className="mt-1 text-[10px] text-zinc-500">
        <CountUp value={value} duration={900} />/100
      </span>
    </motion.div>
  );
}

function Overview({ data, host }) {
  const { scores, ai } = data;
  return (
    <div className="space-y-12">
      {/* Score gauges */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <ScoreGauge value={scores.mobile} label="Mobile" icon={Smartphone} delay={0} />
        <ScoreGauge value={scores.desktop} label="Desktop" icon={Monitor} delay={0.06} />
        <ScoreGauge value={scores.seo} label="SEO" icon={Search} delay={0.12} />
        <ScoreGauge value={scores.bestPractices} label="Best practices" icon={ShieldCheck} delay={0.18} />
        <ScoreGauge value={scores.accessibility} label="Accessibility" icon={Accessibility} delay={0.24} />
      </div>

      {/* AI analysis */}
      {ai && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="glass rounded-2xl p-7 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold text-white">AI analysis</h3>
              <span className="ml-auto rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[10px] text-accent">
                {ai.source === 'groq' ? 'Powered by Groq' : 'Heuristic summary'}
              </span>
            </div>
            <p className="text-base leading-relaxed text-zinc-300">{ai.summary}</p>
            {ai.businessImpact && (
              <div className="mt-5 flex gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-zinc-400">{ai.businessImpact}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-card/60 p-7 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Quick wins</h3>
            <ul className="space-y-4">
              {(ai.quickWins || []).map((w, i) => (
                <motion.li
                  key={`${w.title}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3"
                >
                  <span className={`mt-0.5 inline-flex h-fit shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase ${IMPACT[w.impact] || IMPACT.medium}`}>
                    {w.impact}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{w.title}</p>
                    {w.detail && <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{w.detail}</p>}
                  </div>
                </motion.li>
              ))}
              {(!ai.quickWins || ai.quickWins.length === 0) && (
                <li className="text-sm text-zinc-500">No critical fixes flagged — nicely done, {host}.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Vitals({ vitals }) {
  return (
    <div>
      <p className="mb-6 text-sm text-zinc-500">
        Lab measurements from the Lighthouse mobile run, rated against Google&apos;s Core Web Vitals thresholds.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VITAL_DEFS.map((v, i) => {
          const d = vitals?.[v.key] || {};
          const meta = ratingMeta[d.rating] || ratingMeta.unknown;
          return (
            <motion.div
              key={v.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border p-5 ${meta.ring}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-300">
                  <v.icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{v.label}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${meta.tone}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
              <p className={`text-3xl font-semibold tabular-nums ${meta.tone}`}>{d.value ?? '—'}</p>
              <p className="mt-1 text-xs text-zinc-600">{v.name}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Issues({ perfList, seoList, a11yList }) {
  const groups = [
    { id: 'performance', label: 'Performance', items: perfList, tone: 'text-amber-400', icon: Zap },
    { id: 'seo', label: 'SEO', items: seoList, tone: 'text-sky-400', icon: Search },
    { id: 'accessibility', label: 'Accessibility', items: a11yList, tone: 'text-violet-400', icon: Accessibility },
  ];
  const [filter, setFilter] = useState('all');
  const total = perfList.length + seoList.length + a11yList.length;
  const visible = filter === 'all' ? groups : groups.filter((g) => g.id === filter);

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <Check className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
        <p className="text-lg text-emerald-300">No major issues flagged in this run.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ id: 'all', label: `All (${total})` }, ...groups.filter((g) => g.items.length).map((g) => ({ id: g.id, label: `${g.label} (${g.items.length})` }))].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              filter === f.id ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {visible.map((g) =>
          g.items.length ? (
            <div key={g.id}>
              <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${g.tone}`}>
                <g.icon className="h-4 w-4" /> {g.label}
              </h3>
              <ul className="space-y-3">
                {g.items.map((issue, i) => (
                  <motion.li
                    key={`${issue.title}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-2xl border border-white/[0.08] bg-card/60 p-5 transition-colors hover:border-white/[0.14]"
                  >
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                      <h4 className="font-medium text-zinc-100">{issue.title}</h4>
                      {issue.saving && <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 text-xs text-zinc-400">{issue.saving}</span>}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-500">{issue.description}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

function Screens({ data, host }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ScreenshotPanel label="Mobile" icon={Smartphone} screenshot={data.mobileScreenshot} host={host} aspect="aspect-[9/16]" maxW="max-w-xs" />
      <ScreenshotPanel
        label="Desktop"
        icon={Monitor}
        screenshot={data.desktopScreenshot}
        host={host}
        aspect="aspect-video"
        maxW="max-w-xl"
        fallback={data.scores.desktop == null ? 'Desktop pass did not finish. Retry or check API quota.' : null}
      />
    </div>
  );
}

function ScreenshotPanel({ label, icon: Icon, screenshot, host, aspect, maxW, fallback }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={`${aspect} ${maxW} overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950`}>
        {screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={screenshot} alt={`${label} render of ${host}`} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Camera className="h-8 w-8 text-zinc-700" />
            <p className="max-w-xs text-xs text-zinc-600">{fallback || 'No screenshot in this response.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
