'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Search, Sparkles, Clock, X } from 'lucide-react';

const BASE_STEPS = [
  'Reaching Google PageSpeed…',
  'Running Lighthouse on mobile…',
  'Running Lighthouse on desktop…',
  'Measuring Core Web Vitals…',
];
const AI_STEP = 'Writing your AI action plan…';

const EXAMPLES = ['stackoverflow.com', 'vercel.com', 'cbc.ca', 'dal.ca'];
const HISTORY_KEY = 'hfxseo:recent';

function normalize(input) {
  let v = input.trim();
  if (!v) return '';
  if (!/^https?:\/\//i.test(v) && v.includes('.')) v = `https://${v}`;
  return v;
}

export default function AuditForm({ onResult }) {
  const [url, setUrl] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const steps = aiAnalysis ? [...BASE_STEPS, AI_STEP] : BASE_STEPS;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw).slice(0, 4));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!loading) return undefined;
    const maxStep = (aiAnalysis ? BASE_STEPS.length + 1 : BASE_STEPS.length) - 1;
    setStep(0);
    setProgress(8);
    const stepTimer = setInterval(() => setStep((s) => Math.min(s + 1, maxStep)), 4200);
    const progTimer = setInterval(() => setProgress((p) => (p < 92 ? p + Math.random() * 6 : p)), 600);
    return () => {
      clearInterval(stepTimer);
      clearInterval(progTimer);
    };
  }, [loading, aiAnalysis]);

  const saveHistory = (host) => {
    try {
      const next = [host, ...history.filter((h) => h !== host)].slice(0, 4);
      setHistory(next);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const runAudit = async (rawUrl) => {
    setError('');
    const formatted = normalize(rawUrl);
    if (!formatted.includes('.')) {
      setError('Enter a valid domain (for example, example.com).');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formatted, aiAnalysis }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('The audit service returned an unexpected response. Please try again.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed.');

      setProgress(100);
      saveHistory(data.host || formatted.replace(/^https?:\/\//, '').replace(/\/.*$/, ''));
      onResult(data);
    } catch (err) {
      setError(err.message || 'Could not complete the audit.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runAudit(url);
  };

  const runExample = (ex) => {
    setUrl(ex);
    runAudit(ex);
  };

  return (
    <section className="relative z-10 mx-auto mb-28 max-w-3xl scroll-mt-24 px-6" id="audit-form" aria-labelledby="audit-form-title">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="glass relative overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-9"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" aria-hidden />

        <div className="relative mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">Free audit</p>
            <h2 id="audit-form-title" className="text-2xl font-semibold text-white sm:text-3xl">
              Audit any website
            </h2>
          </div>
          <label className="inline-flex cursor-pointer select-none items-center gap-2.5 self-start">
            <span className="hidden text-right text-[11px] leading-tight text-zinc-500 sm:block">
              AI
              <br />
              plan
            </span>
            <input
              type="checkbox"
              checked={aiAnalysis}
              onChange={(e) => setAiAnalysis(e.target.checked)}
              className="peer sr-only"
              aria-label="Enable AI action plan"
            />
            <span
              className="relative h-7 w-12 shrink-0 rounded-full border border-white/10 bg-zinc-800 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-accent"
              aria-hidden
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 transition-colors focus-within:border-accent/50">
              <Search className="h-5 w-5 shrink-0 text-zinc-500" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                placeholder="yourbusiness.ca"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent py-4 text-lg text-white outline-none placeholder:text-zinc-600"
                required
                autoComplete="url"
                inputMode="url"
                enterKeyHint="go"
                aria-label="Website URL"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl accent-gradient px-7 py-4 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
              {loading ? 'Auditing…' : 'Run audit'}
            </button>
          </div>
        </form>

        {!loading && (
          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => runExample(ex)}
                className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-accent/40 hover:text-accent"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative mt-6 overflow-hidden"
            >
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full accent-gradient"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={step}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {steps[Math.min(step, steps.length - 1)]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-start gap-3 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-200/90"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{error}</span>
              <button type="button" onClick={() => setError('')} className="ml-auto text-red-300/60 hover:text-red-200" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && !loading && (
          <div className="relative mt-6 border-t border-white/[0.06] pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                <Clock className="h-3.5 w-3.5" aria-hidden /> Recent:
              </span>
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => runExample(h)}
                  className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 transition-colors hover:text-white"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
