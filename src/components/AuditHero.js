'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AuditHero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-end overflow-x-hidden px-[max(1rem,env(safe-area-inset-left))] pb-[max(6rem,env(safe-area-inset-bottom))] pr-[max(1rem,env(safe-area-inset-right))] pt-28 sm:px-6 sm:pt-32 md:pb-32"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 mesh-bg grid-noise" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0b]/50 to-[#0a0a0b]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mono-label mb-8 text-balance px-0.5 text-[9px] leading-relaxed text-zinc-500 sm:text-[10px]">
            Halifax Regional Municipality · Nova Scotia · Google Lighthouse
          </p>
          <h1
            id="hero-heading"
            className="mb-8 text-balance text-3xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl md:text-7xl"
          >
            Free Halifax{' '}
            <span className="serif-italic text-gradient">SEO &amp; speed audit</span>
            <br />
            for your website URL
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg md:text-xl">
            Instant Lighthouse scores for Halifax, Dartmouth, Bedford, and the rest of HRM—mobile
            and desktop performance, Core Web Vitals, final-frame screenshots, and prioritized SEO
            and speed issues you can act on.
          </p>
          <div className="flex flex-col items-center gap-3">
            <span className="mono-label text-zinc-600">Scroll to run the audit</span>
            <motion.div
              aria-hidden
              className="h-14 w-px bg-gradient-to-b from-zinc-500/40 to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: 'top' }}
            />
          </div>
        </motion.div>
      </div>

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
