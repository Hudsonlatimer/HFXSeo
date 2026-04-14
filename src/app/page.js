'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuditHero from '@/components/AuditHero';
import AuditForm from '@/components/AuditForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import AboutSection from '@/components/AboutSection';
import BusinessFAQ from '@/components/BusinessFAQ';
import ContactSection from '@/components/ContactSection';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    setResult(data);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <main className="mesh-bg grid-noise min-h-screen selection:bg-zinc-600/35 selection:text-white">
      <a
        href="#audit-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-zinc-100 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900"
      >
        Skip to audit tool
      </a>

      <nav
        className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/[0.06] bg-[#0a0a0b]/80 px-[max(1rem,env(safe-area-inset-left))] py-3 pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl md:px-10 md:py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-lg font-semibold tracking-tight text-white"
          aria-label="HFX SEO home"
        >
          <span className="whitespace-nowrap">
            HFX <span className="text-zinc-400">SEO</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="https://huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-[10px] text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Portfolio
            </a>
            <a
              href="https://services.huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-[10px] text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Services
            </a>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href="https://huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-center text-[9px] text-zinc-500"
            >
              Work
            </a>
            <a
              href="https://services.huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-center text-[9px] text-zinc-500"
            >
              Hire
            </a>
          </div>
          <a
            href="#contact"
            className="mono-label flex min-h-11 items-center rounded-md border border-white/10 bg-white/[0.04] px-4 text-[10px] font-semibold text-zinc-200 transition-colors hover:border-white/15 hover:bg-white/[0.07]"
          >
            Contact
          </a>
        </div>
      </nav>

      <AuditHero />
      <AuditForm onResult={handleResult} />

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results-view"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ResultsDisplay data={result} />
          </motion.div>
        )}
      </AnimatePresence>

      <AboutSection />
      <BusinessFAQ />
      <ContactSection />

      <footer className="border-t border-white/[0.06] bg-[#0a0a0b]/90 py-16 pb-[max(4rem,env(safe-area-inset-bottom))] text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]">
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-[10px] text-zinc-600 hover:text-zinc-400"
            >
              huddydev.ca
            </a>
            <a
              href="https://services.huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-[10px] text-zinc-600 hover:text-zinc-400"
            >
              services.huddydev.ca
            </a>
          </div>
          <p className="mono-label max-w-md text-[10px] leading-relaxed text-zinc-600">
            © {new Date().getFullYear()} HFX SEO Audit · Hudson Latimer
          </p>
        </div>
      </footer>
    </main>
  );
}
