'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Gauge, Search, Code2, TrendingUp } from 'lucide-react';

const services = [
  { icon: Gauge, title: 'Speed & Core Web Vitals', detail: 'Turn red scores green — faster loads that Google and customers reward.' },
  { icon: Search, title: 'Local SEO that ranks', detail: 'On-page SEO and content built to win Halifax & Nova Scotia search.' },
  { icon: Code2, title: 'Modern websites', detail: 'Fast, conversion-focused sites built on the same stack that powers this tool.' },
  { icon: TrendingUp, title: 'Ongoing growth', detail: 'Audits, fixes, and reporting that keep the leads coming in.' },
];

export default function HuddyPromo() {
  return (
    <section className="border-y border-white/[0.06] py-24 md:py-32" id="huddy">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-8 sm:p-12 md:p-16"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl" aria-hidden />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300">
                Built by Huddy Digital
              </p>
              <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                This audit is free.
                <br />
                <span className="text-gradient">Fixing it is what we do.</span>
              </h2>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-zinc-400">
                Huddy Digital builds fast, high-ranking websites for Halifax &amp; Nova Scotia
                businesses. We don&apos;t just hand you a report — we turn it into more calls, more
                bookings, and more revenue.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://huddydigital.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl accent-gradient px-8 py-4 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5"
                >
                  Work with Huddy Digital <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="https://huddydigital.ca/#services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/[0.04]"
                >
                  See our services
                </a>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {services.map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-white/[0.08] bg-card/60 p-6 transition-colors hover:border-white/[0.16]"
                >
                  <s.icon className="mb-3 h-6 w-6 text-white" />
                  <h3 className="mb-1.5 text-base font-semibold text-zinc-100">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{s.detail}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
