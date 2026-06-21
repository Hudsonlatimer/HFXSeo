'use client';
import { motion } from 'framer-motion';
import { Link2, Gauge, Sparkles, Activity, Search, ShieldCheck, MapPin } from 'lucide-react';

const steps = [
  { icon: Link2, title: 'Paste your URL', detail: 'Any public website — your own or a competitor’s.' },
  { icon: Gauge, title: 'Real Lighthouse run', detail: 'Google audits mobile and desktop in parallel.' },
  { icon: Sparkles, title: 'AI action plan', detail: 'Groq turns the data into prioritized, plain-English fixes.' },
];

const features = [
  {
    icon: Activity,
    title: 'Core Web Vitals, rated',
    detail: 'LCP, CLS, TBT and more, each graded against Google’s good / needs-work / poor thresholds.',
  },
  {
    icon: Search,
    title: 'On-page SEO signals',
    detail: 'Lighthouse SEO checks — meta tags, crawlability, structured data hints — that affect Nova Scotia visibility.',
  },
  {
    icon: ShieldCheck,
    title: 'Best practices & a11y',
    detail: 'Security, modern web standards, and accessibility scores that quietly shape rankings and trust.',
  },
  {
    icon: MapPin,
    title: 'Built for HRM operators',
    detail: 'Downtown Halifax, the North End, Dartmouth Crossing, Bedford, or Sackville — same public Google rules.',
  },
];

export default function AboutSection() {
  return (
    <section className="border-y border-white/[0.06] py-24 md:py-32" id="about">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">How it works</p>
          <h2 className="mb-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Real Google data, an AI plan you can act on
          </h2>
          <p className="text-lg leading-relaxed text-zinc-400">
            Local competition in Halifax is tight — restaurants, contractors, clinics, and pros all
            fight for the same map pack and organic slots. Slow mobile loads and missing on-page SEO
            quietly cap how many leads you convert from search. This tool shows you exactly where you
            stand and what to fix first.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mb-16 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/[0.08] bg-card/60 p-7"
            >
              <span className="absolute right-5 top-5 text-4xl font-bold text-white/5">{i + 1}</span>
              <s.icon className="mb-4 h-6 w-6 text-accent" />
              <h3 className="mb-1.5 text-lg font-semibold text-zinc-100">{s.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{s.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {features.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-4 rounded-2xl border border-white/[0.08] bg-card/60 p-7 transition-colors hover:border-white/[0.14]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-accent">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1.5 text-lg font-semibold text-zinc-100">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{item.detail}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
