'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AuditHero from '@/components/AuditHero';
import AuditForm from '@/components/AuditForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import AboutSection from '@/components/AboutSection';
import BusinessFAQ from '@/components/BusinessFAQ';
import HuddyPromo from '@/components/HuddyPromo';

export default function Home() {
  const [result, setResult] = useState(null);

  const handleResult = (data) => {
    setResult(data);
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 120);
  };

  return (
    <main className="relative min-h-screen">
      <div className="aurora" aria-hidden />

      <a
        href="#audit-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900"
      >
        Skip to audit tool
      </a>

      <nav
        className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/[0.06] bg-bg/70 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-10"
        aria-label="Main navigation"
      >
        <Link href="/" className="text-lg font-bold tracking-tight text-white" aria-label="HFX SEO home">
          HFX <span className="text-zinc-500">SEO</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden items-center gap-7 md:flex">
            <a href="#about" className="text-sm text-zinc-400 transition-colors hover:text-white">About</a>
            <a href="#faq" className="text-sm text-zinc-400 transition-colors hover:text-white">FAQ</a>
            <a href="#audit-form" className="text-sm text-zinc-400 transition-colors hover:text-white">Run audit</a>
          </div>
          <a
            href="https://huddydigital.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg accent-gradient px-4 py-2 text-xs font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5"
          >
            Hire Huddy Digital
          </a>
        </div>
      </nav>

      <div className="relative z-10">
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
        <HuddyPromo />
        <BusinessFAQ />

        <footer className="border-t border-white/[0.06] py-14">
          <div className="container-app flex flex-col items-center gap-5 text-center">
            <div className="text-sm font-bold text-white">HFX SEO</div>
            <p className="max-w-md text-sm text-zinc-400">
              A free tool by Hudson Latimer at{' '}
              <a href="https://huddydigital.ca" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Huddy Digital
              </a>{' '}
              — web design, SEO &amp; performance for Halifax &amp; Nova Scotia businesses.
            </p>
            <div className="flex gap-6">
              <a href="https://huddydigital.ca" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">huddydigital.ca</a>
              <a href="https://huddydigital.ca/#services" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">Services</a>
              <a href="https://github.com/Hudsonlatimer/HFXSeo" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">GitHub</a>
            </div>
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} HFX SEO Audit · Built by Hudson Latimer · Huddy Digital · Lighthouse data via Google · AI by Groq
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
