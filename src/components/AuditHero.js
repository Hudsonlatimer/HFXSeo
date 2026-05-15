'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function AuditHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pb-24 pt-28 sm:px-6 sm:pt-32 md:pb-32"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0b]/50 to-[#0a0a0b]" />

      <motion.div className="relative z-10 mx-auto max-w-5xl text-center" style={{ y, opacity }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-xs tracking-wide text-zinc-500"
        >
          Halifax Regional Municipality · Nova Scotia · Google Lighthouse
        </motion.p>
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-8 text-balance text-3xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl md:text-7xl"
        >
          Free Halifax SEO &amp; speed audit
          <br />
          <span className="text-zinc-400">for your website</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg md:text-xl"
        >
          Instant Lighthouse scores for Halifax, Dartmouth, Bedford, and the rest of HRM — mobile
          and desktop performance, Core Web Vitals, screenshots, and prioritized issues.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <a
            href="#audit-form"
            className="rounded-md bg-zinc-100 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white"
          >
            Run free audit
          </a>
          <motion.div
            aria-hidden
            className="mt-6 h-16 w-px bg-gradient-to-b from-zinc-500/40 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </motion.div>

      <div className="relative z-[1] mx-auto mt-16 w-full max-w-6xl opacity-90 md:mt-24">
        <div className="relative border-t border-white/[0.07] bg-gradient-to-t from-[#0a0a0b] to-transparent px-4 pt-8">
          <Image
            src="/halifax-skyline.svg"
            alt="Stylized Halifax waterfront skyline illustration"
            width={1400}
            height={400}
            unoptimized
            className="h-auto w-full max-h-[min(28vh,220px)] object-contain object-bottom opacity-40 grayscale contrast-125 [mask-image:linear-gradient(to_top,black,transparent)]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
