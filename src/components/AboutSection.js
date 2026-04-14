export default function AboutSection() {
  const items = [
    {
      title: 'Core Web Vitals',
      detail:
        'LCP, CLS, and interactivity straight from Lighthouse—what Google uses when evaluating real-world experience in Halifax mobile search.',
    },
    {
      title: 'On-page SEO signals',
      detail:
        'Lighthouse SEO category checks: meta tags, crawlability, structured data hints, and other issues that affect Halifax and Nova Scotia organic visibility.',
    },
    {
      title: 'Built for HRM operators',
      detail:
        'Whether you serve downtown Halifax, the North End, Dartmouth Crossing, Bedford, or Sackville, the audit reflects the same public rules Google publishes.',
    },
    {
      title: 'Actionable issue list',
      detail:
        'Performance opportunities are sorted by estimated savings; any failing Lighthouse SEO audits appear separately when the SEO category is not already at 100.',
    },
  ];

  return (
    <section className="border-y border-white/[0.06] py-24 md:py-32" id="about">
      <div className="mx-auto max-w-6xl px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]">
        <div className="mb-16 max-w-3xl">
          <p className="mono-label mb-4 text-zinc-500">Halifax &amp; Nova Scotia SEO context</p>
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white md:text-5xl">
            Why local businesses run this check
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-zinc-500">
            Local competition in the Halifax Regional Municipality is tight: restaurants,
            contractors, clinics, and professional services all fight for the same map pack and
            organic slots. Slow mobile loads and missing on-page SEO quietly cap how many
            Dartmouth, Bedford, and peninsula leads you convert from search.
          </p>
          <p className="text-lg leading-relaxed text-zinc-500">
            This tool uses Google PageSpeed Insights (Lighthouse)—the same engine behind Chrome
            audits—so you see the same performance, SEO, and best-practices scores the ecosystem
            already trusts, without a black-box vendor score.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.title}
              className="surface-panel group p-8 transition-colors hover:border-white/[0.1]"
            >
              <h3 className="mb-3 text-xl font-light text-zinc-100">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
