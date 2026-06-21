'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Gauge, Search, Sparkles, Zap } from 'lucide-react';

const chips = [
  { icon: Gauge, label: 'Core Web Vitals' },
  { icon: Search, label: 'SEO signals' },
  { icon: Zap, label: 'Mobile + desktop' },
  { icon: Sparkles, label: 'AI quick wins' },
];

const stats = [
  { value: '5', label: 'category scores' },
  { value: '~30s', label: 'per audit' },
  { value: '$0', label: 'no sign-up' },
];

export default function AuditHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pb-24 pt-32 sm:px-6"
      aria-labelledby="hero-heading"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />

      <motion.div className="relative z-10 mx-auto max-w-4xl text-center" style={{ y, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-zinc-400"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Halifax · Dartmouth · Bedford · all of HRM
        </motion.div>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-7 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient">See exactly why</span>
          <br />
          your website loses leads
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          A free, instant SEO &amp; speed audit for Nova Scotia businesses, from{' '}
          <a href="https://huddydigital.ca" target="_blank" rel="noopener noreferrer" className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
            Huddy Digital
          </a>
          . Real Google Lighthouse scores, Core Web Vitals, screenshots, and an AI action plan — in
          about 30 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10 flex flex-col items-center gap-4"
        >
          <a
            href="#audit-form"
            className="group inline-flex items-center gap-2.5 rounded-xl accent-gradient px-8 py-4 text-sm font-semibold text-zinc-950 shadow-[0_8px_40px_-8px_rgba(45,212,191,0.5)] transition-transform hover:-translate-y-0.5"
          >
            Run my free audit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {chips.map(({ icon: Icon, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400"
              >
                <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
                {label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto flex max-w-md items-center justify-center divide-x divide-white/10"
        >
          {stats.map((s) => (
            <div key={s.label} className="px-6 text-center">
              <dt className="text-2xl font-semibold text-white tabular-nums">{s.value}</dt>
              <dd className="mt-0.5 text-xs text-zinc-500">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.a
        href="#audit-form"
        aria-label="Scroll to audit tool"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
      >
        <motion.span
          className="block h-12 w-px bg-gradient-to-b from-accent/50 to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.a>
    </section>
  );
}
