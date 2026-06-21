'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AuditHero from '@/components/AuditHero';
import AuditForm from '@/components/AuditForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import AboutSection from '@/components/AboutSection';
import BusinessFAQ from '@/components/BusinessFAQ';
import ContactSection from '@/components/ContactSection';

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
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white" aria-label="HFX SEO home">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg accent-gradient text-sm font-black text-zinc-950">H</span>
          HFX <span className="text-zinc-500">SEO</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden items-center gap-7 md:flex">
            <a href="#about" className="text-sm text-zinc-400 transition-colors hover:text-white">About</a>
            <a href="#faq" className="text-sm text-zinc-400 transition-colors hover:text-white">FAQ</a>
            <a href="https://hudsonlatimer.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 transition-colors hover:text-white">Portfolio</a>
          </div>
          <a
            href="#audit-form"
            className="rounded-lg accent-gradient px-4 py-2 text-xs font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5"
          >
            Run audit
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
        <BusinessFAQ />
        <ContactSection />

        <footer className="border-t border-white/[0.06] py-12">
          <div className="container-app flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-md accent-gradient text-xs font-black text-zinc-950">H</span>
              HFX SEO
            </div>
            <div className="flex gap-6">
              <a href="https://hudsonlatimer.com" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">hudsonlatimer.com</a>
              <a href="https://hudsonlatimer.com/#services" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">Services</a>
              <a href="https://github.com/Hudsonlatimer/HFXSeo" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">GitHub</a>
            </div>
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} HFX SEO Audit · Hudson Latimer · Lighthouse data via Google · AI by Groq
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
