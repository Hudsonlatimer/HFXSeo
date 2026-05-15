'use client';
import { motion } from 'framer-motion';
import {
  Zap,
  Gauge,
  Search,
  ShieldCheck,
  Accessibility,
  Smartphone,
  Monitor,
  Camera,
  AlignLeft,
  TrendingUp,
  Clock,
  Eye,
  Share2,
  Sparkles,
} from 'lucide-react';

function scoreColor(n) {
  if (n == null) return 'rgb(113 113 122)';
  if (n >= 90) return 'rgb(34 197 94)';
  if (n >= 50) return 'rgb(250 204 21)';
  return 'rgb(239 68 68)';
}

function scoreTone(n) {
  if (n == null) return 'text-zinc-500';
  if (n >= 90) return 'text-green-400';
  if (n >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

function AnimatedScore({ value, className }) {
  const n = typeof value === 'number' ? value : null;
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {n == null ? '—' : n}
    </motion.span>
  );
}

function ScoreRing({ value, label, icon: Icon, delay = 0 }) {
  const n = typeof value === 'number' ? value : null;
  const pct = n == null ? 0 : Math.min(100, Math.max(0, n));
  const color = scoreColor(n);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 120 }}
      className="flex flex-col items-center gap-4 rounded-lg border border-white/[0.08] bg-[#111] p-6 text-center"
    >
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(63, 63, 70, 0.2) 0)`,
        }}
      >
        <div className="absolute inset-1.5 flex flex-col items-center justify-center rounded-full bg-[#111]">
          <AnimatedScore value={value} className={`text-3xl font-light tabular-nums ${scoreTone(n)}`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-zinc-500" />}
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </motion.div>
  );
}

function VitalCard({ label, hint, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-start gap-4 rounded-lg border border-white/[0.08] bg-[#111] p-5"
    >
      <div className="rounded-md border border-white/[0.08] bg-white/[0.03] p-2 text-zinc-400">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-zinc-600">{hint}</p>
        <p className="text-lg font-medium text-white">{label}</p>
        <p className="mt-1 text-2xl font-light tabular-nums text-zinc-200">{value ?? '—'}</p>
      </div>
    </motion.div>
  );
}

function IssueTag({ type }) {
  const colors = {
    performance: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
    seo: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
    accessibility: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
  };
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] ${colors[type] || 'border-white/[0.08] bg-white/[0.03] text-zinc-400'}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

export default function ResultsDisplay({ data }) {
  if (!data) return null;

  const host = data.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const m = typeof data.scores?.mobile === 'number' ? data.scores.mobile : null;
  const d = typeof data.scores?.desktop === 'number' ? data.scores.desktop : null;
  const seo = data.scores?.seo ?? null;
  const bp = data.scores?.bestPractices ?? null;
  const a11y = data.scores?.accessibility ?? null;

  const handleShare = () => {
    const line =
      m != null
        ? `HFX SEO audit: ${host} — mobile ${m}/100${d != null ? `, desktop ${d}/100` : ''}, SEO ${seo}/100.`
        : `HFX SEO audit completed for ${host}.`;
    if (navigator.share) {
      navigator.share({ title: 'HFX SEO audit', text: line, url: 'https://hfxseo.ca' });
    } else {
      navigator.clipboard.writeText(line);
    }
  };

  const perfList = data.performanceIssues || [];
  const seoList = data.seoIssues || [];
  const a11yList = data.accessibilityIssues || [];
  const allIssues = [...perfList, ...seoList, ...a11yList];

  return (
    <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-8 md:pt-12" id="results">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 flex flex-col gap-6 border-l-2 border-zinc-700 pl-6 md:flex-row md:items-end md:justify-between md:pl-8"
      >
        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">Results</p>
          <h2 className="mb-2 break-words text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            {host}
          </h2>
          <p className="max-w-lg text-sm text-zinc-500">
            Lighthouse lab data — mobile and desktop runs in parallel.
          </p>
        </div>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share audit results"
          className="flex items-center gap-2 self-start rounded-md border border-white/10 px-5 py-2.5 text-xs text-zinc-500 transition-colors hover:border-white/15 hover:text-zinc-300"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share results
        </button>
      </motion.div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <ScoreRing value={m} label="Mobile" icon={Smartphone} delay={0} />
        <ScoreRing value={d} label="Desktop" icon={Monitor} delay={0.06} />
        <ScoreRing value={seo} label="SEO" icon={Search} delay={0.12} />
        <ScoreRing value={bp} label="Best practices" icon={ShieldCheck} delay={0.18} />
        <ScoreRing value={a11y} label="Accessibility" icon={Accessibility} delay={0.24} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h3 className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Core Web Vitals</h3>
        <p className="text-xs text-zinc-600">Lab measurements from Lighthouse mobile run</p>
      </motion.div>
      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <VitalCard label="LCP" hint="Largest Contentful Paint" value={data.vitals?.lcp} icon={Zap} delay={0} />
        <VitalCard label="CLS" hint="Cumulative Layout Shift" value={data.vitals?.cls} icon={Eye} delay={0.06} />
        <VitalCard label="TBT" hint="Total Blocking Time" value={data.vitals?.tbt} icon={Clock} delay={0.12} />
        <VitalCard label="FCP" hint="First Contentful Paint" value={data.vitals?.fcp} icon={Gauge} delay={0.18} />
        <VitalCard label="SI" hint="Speed Index" value={data.vitals?.si} icon={TrendingUp} delay={0.24} />
        <VitalCard label="TTI" hint="Time to Interactive" value={data.vitals?.tti} icon={Gauge} delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-16 rounded-lg border border-white/[0.08] bg-[#111] p-6 sm:p-8 md:p-10"
      >
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#d4a27f]" />
          <h3 className="text-xl font-light text-white">AI Analysis</h3>
          <span className="ml-auto flex items-center gap-1.5 rounded border border-[#d4a27f]/20 bg-[#d4a27f]/5 px-2.5 py-1 text-[10px] text-[#d4a27f]">
            Powered by Claude
          </span>
        </div>
        <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">{data.aiSummary}</p>
      </motion.div>

      <div className="mb-20 grid gap-10 md:grid-cols-2">
        <ScreenshotPanel
          label="Mobile"
          icon={Smartphone}
          screenshot={data.mobileScreenshot}
          host={host}
          aspect="aspect-[9/16]"
        />
        <ScreenshotPanel
          label="Desktop"
          icon={Monitor}
          screenshot={data.desktopScreenshot}
          host={host}
          aspect="aspect-video"
          fallback={d == null ? 'Desktop pass did not finish. Retry or check API quota.' : null}
        />
      </div>

      <div className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 flex items-end justify-between"
        >
          <h3 className="text-3xl font-light text-white md:text-4xl">Prioritized issues</h3>
          <div className="flex gap-4 text-xs text-zinc-600">
            {perfList.length > 0 && <span>{perfList.length} perf</span>}
            {seoList.length > 0 && <span>{seoList.length} SEO</span>}
            {a11yList.length > 0 && <span>{a11yList.length} a11y</span>}
          </div>
        </motion.div>
        <p className="mb-10 max-w-xl text-zinc-500">
          {allIssues.length === 0
            ? 'No major issues flagged in this run.'
            : 'Ordered by category and estimated impact. Fix performance items first for the biggest gains.'}
        </p>
        <ul className="space-y-3">
          {allIssues.map((issue, i) => (
            <motion.li
              key={`${issue.title}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: 0.04 * i, duration: 0.35 }}
              className="rounded-lg border border-white/[0.08] bg-[#111] p-6 transition-colors hover:border-white/[0.12]"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <IssueTag type={issue.type} />
                {issue.saving && (
                  <span className="text-xs text-zinc-500">{issue.saving}</span>
                )}
              </div>
              <h4 className="mb-2 text-lg font-medium text-zinc-100">{issue.title}</h4>
              <p className="text-sm leading-relaxed text-zinc-500">{issue.description}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border-t border-white/[0.06] pt-16 text-center"
      >
        <h3 className="mb-4 text-3xl font-light text-white md:text-5xl">Need these fixed?</h3>
        <p className="mx-auto mb-10 max-w-xl text-zinc-500">
          Send a note with your URL and goals. I work with Halifax and Nova Scotia businesses.
        </p>
        <button
          type="button"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-md bg-zinc-100 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white sm:px-10 sm:py-4"
        >
          Contact
        </button>
      </motion.div>
    </div>
  );
}

function ScreenshotPanel({ label, icon: Icon, screenshot, host, aspect, fallback }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-zinc-600">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="text-[10px] text-zinc-700">Lighthouse</span>
      </div>
      <div
        className={`${aspect} max-w-sm overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-950`}
      >
        {screenshot ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={screenshot}
            alt={`${label} render of ${host}`}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Camera className="h-8 w-8 text-zinc-700" />
            <p className="max-w-xs text-xs text-zinc-600">
              {fallback || 'No screenshot in this response.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
