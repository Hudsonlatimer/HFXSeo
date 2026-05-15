'use client';
import { motion } from 'framer-motion';

const items = [
  {
    title: 'Core Web Vitals',
    detail:
      'LCP, CLS, and interactivity straight from Lighthouse — what Google uses when evaluating real-world experience in Halifax mobile search.',
  },
  {
    title: 'On-page SEO signals',
    detail:
      'Lighthouse SEO category checks: meta tags, crawlability, structured data hints, and other issues that affect Halifax and Nova Scotia organic visibility.',
  },
  {
    title: 'Built for HRM operators',
    detail:
      'Whether you serve downtown Halifax, the North End, Dartmouth Crossing, Bedford, or Sackville, the audit reflects the same public rules Google publishes.',
  },
  {
    title: 'Actionable issue list',
    detail:
      'Performance opportunities sorted by estimated savings. Failing Lighthouse SEO audits appear separately when the SEO category is not already at 100.',
  },
];

export default function AboutSection() {
  return (
    <section className="border-y border-white/[0.06] py-24 md:py-32" id="about">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >
          <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">Halifax &amp; Nova Scotia SEO context</p>
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white md:text-5xl">
            Why local businesses run this check
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-zinc-500">
            Local competition in the Halifax Regional Municipality is tight: restaurants,
            contractors, clinics, and professional services all fight for the same map pack and
            organic slots. Slow mobile loads and missing on-page SEO quietly cap how many
            Dartmouth, Bedford, and peninsula leads you convert from search.
          </p>
          <p className="text-lg leading-relaxed text-zinc-500">
            This tool uses Google PageSpeed Insights (Lighthouse) — the same engine behind Chrome
            audits — so you see the same scores the ecosystem already trusts.
          </p>
        </motion.div>
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-lg border border-white/[0.08] bg-[#111] p-8 transition-colors hover:border-white/[0.12]"
            >
              <h3 className="mb-3 text-xl font-light text-zinc-100">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{item.detail}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
