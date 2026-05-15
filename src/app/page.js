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
    <main className="min-h-screen">
      <a
        href="#audit-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-zinc-100 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900"
      >
        Skip to audit tool
      </a>

      <nav
        className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/[0.06] bg-[#0a0a0b]/80 px-4 py-3 backdrop-blur-md sm:px-6 md:px-10 md:py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
          aria-label="HFX SEO home"
        >
          HFX <span className="text-zinc-400">SEO</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
          <div className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-xs text-zinc-500 transition-colors hover:text-zinc-300">About</a>
            <a href="#faq" className="text-xs text-zinc-500 transition-colors hover:text-zinc-300">FAQ</a>
            <a
              href="https://hudsonlatimer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Portfolio
            </a>
          </div>
          <div className="flex items-center gap-1 sm:hidden">
            <a href="#about" className="px-2 py-2 text-xs text-zinc-500">About</a>
            <a href="#faq" className="px-2 py-2 text-xs text-zinc-500">FAQ</a>
          </div>
          <a
            href="#contact"
            className="rounded-md border border-white/10 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
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

      <footer className="border-t border-white/[0.06] py-12 text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6">
          <div className="flex gap-6">
            <a
              href="https://hudsonlatimer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-zinc-400"
            >
              hudsonlatimer.com
            </a>
            <a
              href="https://hudsonlatimer.com/#services"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-zinc-400"
            >
              Services
            </a>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} HFX SEO Audit · Hudson Latimer · AI summaries powered by Claude
          </p>
        </div>
      </footer>
    </main>
  );
}
