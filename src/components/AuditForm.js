'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const STATUS_LABELS = [
  'Calling Google PageSpeed…',
  'Running Lighthouse mobile and desktop…',
  'Collecting Core Web Vitals…',
  'Building report…',
];

export default function AuditForm({ onResult }) {
  const [url, setUrl] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % STATUS_LABELS.length;
        setStatusText(STATUS_LABELS[i]);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http') && formattedUrl.includes('.')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (!formattedUrl.includes('.')) {
      setError('Enter a valid domain (for example, example.com).');
      return;
    }

    setLoading(true);
    setStatusText(STATUS_LABELS[0]);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl, aiAnalysis }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('The audit service returned an unexpected response. Please try again.');
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed.');

      onResult(data);
    } catch (err) {
      setError(err.message || 'Could not complete the audit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative z-10 mx-auto mb-28 max-w-4xl px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] md:mb-36"
      id="audit-form"
      aria-labelledby="audit-form-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card glow-ring overflow-hidden p-6 md:p-10"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mono-label mb-2 text-zinc-500">Audit</p>
            <h2 id="audit-form-title" className="text-2xl font-light text-white md:text-3xl">
              Enter your website URL
            </h2>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-zinc-600 sm:max-w-xs sm:text-right">
            Usually 25–45 seconds while Google runs mobile and desktop Lighthouse. Turn off the AI
            summary below to skip the extra model request when the server is configured for it.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-md border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200">AI strategic summary</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">
              Two-sentence Hugging Face summary when enabled and a token is set; otherwise the
              built-in summary from your scores.
            </p>
          </div>
          <label className="inline-flex cursor-pointer select-none items-center gap-3 self-start sm:self-center">
            <span className="mono-label text-[10px] text-zinc-500">{aiAnalysis ? 'On' : 'Off'}</span>
            <input
              id="audit-ai-toggle"
              type="checkbox"
              checked={aiAnalysis}
              onChange={(e) => setAiAnalysis(e.target.checked)}
              className="peer sr-only"
              aria-label="Enable AI strategic summary"
            />
            <span
              className="relative h-7 w-12 shrink-0 rounded-full border border-white/10 bg-zinc-800 shadow-inner transition-colors after:absolute after:left-0.5 after:top-0.5 after:block after:h-6 after:w-6 after:translate-x-0 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:border-white/15 peer-checked:bg-zinc-200 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#121214]"
              aria-hidden
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <div className="min-w-0 flex-1">
            <label htmlFor="url-input" className="mono-label mb-2 block text-[10px] text-zinc-600">
              Website URL
            </label>
            <input
              id="url-input"
              type="text"
              placeholder="yoursite.ca"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full min-w-0 border-b border-white/10 bg-transparent py-3.5 text-xl font-light text-white outline-none transition-colors [overflow-wrap:anywhere] placeholder:text-zinc-600 focus:border-zinc-500 sm:py-4 sm:text-2xl md:text-3xl"
              required
              autoComplete="url"
              inputMode="url"
              enterKeyHint="go"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex min-h-11 w-full shrink-0 items-center justify-center gap-3 rounded-md bg-zinc-100 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white disabled:opacity-45 sm:min-h-0 sm:w-auto sm:px-10 sm:py-5 md:self-end"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                <span className="max-w-[14rem] text-left text-xs font-medium normal-case tracking-normal">
                  {statusText}
                </span>
              </>
            ) : (
              <>
                Run audit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-start gap-3 rounded-md border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-200/90"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
