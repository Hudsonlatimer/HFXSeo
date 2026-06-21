'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'Does site speed affect Google rankings in Halifax?',
    a: 'Yes. Core Web Vitals and page experience influence how Google evaluates quality, especially on mobile where most Halifax, Dartmouth, and HRM local searches happen.',
  },
  {
    q: 'I am on Google Maps. Do I still need website SEO in Nova Scotia?',
    a: 'Google Business Profile helps discovery, but your website still competes for service keywords and “near me” searches across Halifax Regional Municipality. On-page SEO connects those queries to your offers.',
  },
  {
    q: 'How soon will rankings change after technical fixes?',
    a: 'Lab metrics improve as soon as changes deploy. Organic rankings typically shift over several weeks as Google re-crawls and re-evaluates Halifax and Nova Scotia search results.',
  },
  {
    q: 'Does this free audit work for Dartmouth and Bedford businesses?',
    a: 'Yes. Enter any public URL. The same Lighthouse rules apply across HRM; local rankings still depend on your content, citations, and competition in each neighbourhood.',
  },
  {
    q: 'What data powers the HFX SEO audit?',
    a: 'The tool uses Google PageSpeed Insights (Lighthouse) for mobile and desktop, then summarizes the findings into a plain-English action plan with Groq-hosted AI.',
  },
  {
    q: 'Is the Halifax SEO audit free for small businesses?',
    a: 'Yes. Running a URL audit on hfxseo.ca is completely free, including the AI-powered analysis. No sign-up or payment required.',
  },
];

function Item({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.04 }}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-card/60"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="text-base font-medium text-zinc-100">{faq.q}</span>
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-accent">
          <Plus className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BusinessFAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-24 md:py-32" id="faq">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">FAQ</p>
          <h2 className="text-3xl font-semibold text-white md:text-5xl">Halifax SEO &amp; speed questions</h2>
        </motion.div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <Item key={faq.q} faq={faq} index={i} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
