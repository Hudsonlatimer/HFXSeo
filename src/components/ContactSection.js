'use client';
import { useState } from 'react';
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
        <div className="mx-auto max-w-lg px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] text-center">
          <div className="glass-card p-12">
            <h2 className="mb-4 text-3xl font-light text-white">Message received</h2>
            <p className="mb-8 text-zinc-500">
              Thank you. You will receive a reply as soon as possible.
            </p>
            <button
              type="button"
              onClick={() => setStatus('')}
              className="mono-label text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32" id="contact">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] lg:flex-row lg:gap-20">
        <div className="lg:w-2/5">
          <p className="mono-label mb-4 text-zinc-500">Contact</p>
          <h2 className="mb-6 text-4xl font-light leading-tight text-white md:text-5xl">
            Describe your site and what you need fixed or improved.
          </h2>
          <p className="leading-relaxed text-zinc-500">
            Include your URL, business type, and timeline. I work with Halifax Regional Municipality
            and Nova Scotia operators; messages are read in order.
          </p>
          <div className="mt-10 space-y-2">
            <p className="mono-label text-[10px] text-zinc-700">Links</p>
            <a
              href="https://huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-zinc-200"
            >
              huddydev.ca
            </a>
            <a
              href="https://services.huddydev.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-zinc-400 hover:text-zinc-200"
            >
              services.huddydev.ca
            </a>
          </div>
        </div>

        <div className="glass-card flex-1 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10" aria-label="Contact form">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="border-b border-white/10 pb-3 focus-within:border-zinc-500">
                <label htmlFor="contact-name" className="mono-label mb-2 block text-[10px] text-zinc-600">
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
                <label
                  htmlFor="contact-business"
                  className="mono-label mb-2 block text-[10px] text-zinc-600"
                >
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
                <label
                  htmlFor="contact-website"
                  className="mono-label mb-2 block text-[10px] text-zinc-600"
                >
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
                <label
                  htmlFor="contact-email"
                  className="mono-label mb-2 block text-[10px] text-zinc-600"
                >
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
              <label htmlFor="contact-message" className="mono-label mb-2 block text-[10px] text-zinc-600">
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
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-100 py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-white disabled:opacity-50 md:w-auto md:px-12 md:py-4"
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
        </div>
      </div>
    </section>
  );
}
