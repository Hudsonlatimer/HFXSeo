const faqs = [
  {
    q: 'Does site speed affect Google rankings in Halifax?',
    a: 'Core Web Vitals and page experience influence how Google evaluates quality, especially on mobile where most Halifax, Dartmouth, and HRM local searches happen.',
  },
  {
    q: 'I am on Google Maps. Do I still need website SEO in Nova Scotia?',
    a: 'Google Business Profile helps discovery, but your website still competes for service keywords and near me searches across Halifax Regional Municipality. On-page SEO connects those queries to your offers.',
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
    a: 'The tool uses Google PageSpeed Insights, which runs Lighthouse against your page for mobile and desktop strategies and returns performance, SEO, and best-practices category scores.',
  },
  {
    q: 'Is the Halifax SEO audit free for small businesses?',
    a: 'Yes. Running a URL audit on hfxseo.ca is free. Optional AI-generated summaries may use a configured Hugging Face token; core scores and issues do not require payment.',
  },
];

export default function BusinessFAQ() {
  return (
    <section className="py-24 md:py-32" id="faq">
      <div className="mx-auto max-w-6xl px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-label mb-4 text-zinc-500">FAQ</p>
            <h2 className="text-4xl font-light text-white md:text-5xl">Halifax SEO &amp; speed questions</h2>
          </div>
          <p className="max-w-md text-zinc-600">
            Answers for Nova Scotia business owners comparing local search and site performance.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq) => (
            <article key={faq.q} className="surface-panel flex flex-col p-8">
              <h3 className="mb-4 text-lg font-light leading-snug text-zinc-100">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{faq.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
