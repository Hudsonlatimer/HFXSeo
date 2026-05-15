'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ContactSection() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xqabqqll', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="py-24 md:py-32" id="contact">
        <div className="mx-auto max-w-lg px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border border-white/[0.08] bg-[#111] p-12"
          >
            <h2 className="mb-4 text-3xl font-light text-white">Message received</h2>
            <p className="mb-8 text-zinc-500">
              Thank you. You will receive a reply as soon as possible.
            </p>
            <button
              type="button"
              onClick={() => setStatus('')}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Send another message
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32" id="contact">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="lg:w-2/5"
        >
          <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">Contact</p>
          <h2 className="mb-6 text-4xl font-light leading-tight text-white md:text-5xl">
            Describe your site and what you need fixed or improved.
          </h2>
          <p className="leading-relaxed text-zinc-500">
            Include your URL, business type, and timeline. I work with Halifax Regional Municipality
            and Nova Scotia operators.
          </p>
          <div className="mt-10 space-y-2">
            <p className="text-xs text-zinc-700">Links</p>
            <a
              href="https://hudsonlatimer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-zinc-200"
            >
              hudsonlatimer.com
            </a>
            <a
              href="https://hudsonlatimer.com/#services"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-zinc-200"
            >
              Services
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1 rounded-lg border border-white/[0.08] bg-[#111] p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-10" aria-label="Contact form">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="border-b border-white/10 pb-3 focus-within:border-zinc-500">
                <label htmlFor="contact-name" className="mb-2 block text-xs text-zinc-600">
                  Name
                </label>
                <input
                  required
                  type="text"
                  id="contact-name"
                  name="name"
                  className="w-full bg-transparent py-2 text-white outline-none placeholder:text-zinc-600"
                  placeholder="Full name"
                />
              </div>
              <div className="border-b border-white/10 pb-3 focus-within:border-zinc-500">
                <label htmlFor="contact-business" className="mb-2 block text-xs text-zinc-600">
                  Business
                </label>
                <input
                  required
                  type="text"
                  id="contact-business"
                  name="business"
                  className="w-full bg-transparent py-2 text-white outline-none placeholder:text-zinc-600"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              <div className="border-b border-white/10 pb-3 focus-within:border-zinc-500">
                <label htmlFor="contact-website" className="mb-2 block text-xs text-zinc-600">
                  Website
                </label>
                <input
                  type="url"
                  id="contact-website"
                  name="website"
                  className="w-full bg-transparent py-2 text-white outline-none placeholder:text-zinc-600"
                  placeholder="https://"
                />
              </div>
              <div className="border-b border-white/10 pb-3 focus-within:border-zinc-500">
                <label htmlFor="contact-email" className="mb-2 block text-xs text-zinc-600">
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="contact-email"
                  name="email"
                  className="w-full bg-transparent py-2 text-white outline-none placeholder:text-zinc-600"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="border-b border-white/10 pb-3 focus-within:border-zinc-500">
              <label htmlFor="contact-message" className="mb-2 block text-xs text-zinc-600">
                Message
              </label>
              <textarea
                required
                id="contact-message"
                name="message"
                rows={4}
                className="w-full resize-y bg-transparent py-2 text-white outline-none placeholder:text-zinc-600"
                placeholder="Context, goals, and constraints"
              />
            </div>

            <button
              disabled={status === 'sending'}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-100 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white disabled:opacity-50 md:w-auto md:px-12 md:py-4"
            >
              {status === 'sending' ? (
                'Sending…'
              ) : (
                <>
                  Send
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-sm text-red-300/90" role="alert">
                Submission failed. Please try again shortly.
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
