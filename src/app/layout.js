import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const siteUrl = "https://hfxseo.ca";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const keywords = [
  "Halifax SEO",
  "Halifax SEO audit",
  "free SEO audit Halifax",
  "Halifax website speed test",
  "Core Web Vitals Halifax",
  "PageSpeed Halifax",
  "Lighthouse audit Nova Scotia",
  "local SEO Halifax",
  "Dartmouth SEO",
  "Bedford NS website performance",
  "Halifax Regional Municipality SEO",
  "Nova Scotia small business SEO",
  "HRM website audit",
  "Halifax Google ranking",
  "mobile site speed Halifax",
  "Hudson Latimer",
];

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Free Halifax SEO Audit & Website Speed Test | HFX SEO — Nova Scotia",
    template: "%s | HFX SEO",
  },
  description:
    "Free instant SEO and PageSpeed audit for Halifax, Dartmouth, Bedford, and HRM businesses. Lighthouse mobile + desktop scores, Core Web Vitals, screenshots, and prioritized fixes. Built for Nova Scotia operators.",
  keywords,
  authors: [{ name: "Hudson Latimer", url: "https://huddydev.ca" }],
  creator: "Hudson Latimer",
  publisher: "HFX SEO Audit",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_CA",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "HFX SEO Audit",
    title: "Free Halifax SEO Audit & Website Speed Test | HFX SEO",
    description:
      "Lighthouse-powered audit for Halifax Regional Municipality: mobile and desktop performance, SEO category, Core Web Vitals, render screenshots, and actionable issues.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Halifax SEO Audit & Website Speed Test | HFX SEO",
    description:
      "Instant Lighthouse audit for Halifax-area sites — Core Web Vitals, SEO checks, prioritized fixes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-CA": siteUrl,
      en: siteUrl,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: false,
    title: "HFX SEO Audit",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

const structuredDataGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "HFX SEO Audit",
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      description:
        "Free Halifax and Nova Scotia website SEO and PageSpeed audit tool powered by Google Lighthouse.",
      sameAs: ["https://huddydev.ca", "https://services.huddydev.ca"],
      areaServed: [
        {
          "@type": "City",
          name: "Halifax",
          containedInPlace: { "@type": "AdministrativeArea", name: "Nova Scotia", containedInPlace: { "@type": "Country", name: "Canada" } },
        },
        { "@type": "City", name: "Dartmouth", containedInPlace: { "@type": "AdministrativeArea", name: "Nova Scotia" } },
        { "@type": "City", name: "Bedford", containedInPlace: { "@type": "AdministrativeArea", name: "Nova Scotia" } },
        { "@type": "AdministrativeArea", name: "Halifax Regional Municipality" },
      ],
      knowsAbout: [
        "Local SEO Halifax",
        "Core Web Vitals",
        "Google PageSpeed Insights",
        "Lighthouse performance audit",
        "Nova Scotia small business websites",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "HFX SEO Audit",
      description:
        "Free website speed and SEO audit for Halifax, Dartmouth, Bedford, and surrounding Nova Scotia communities.",
      inLanguage: "en-CA",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "ReadAction",
        target: siteUrl,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "HFX SEO Audit — Website performance consulting",
      image: `${siteUrl}/halifax-skyline.svg`,
      url: siteUrl,
      description:
        "Professional SEO audit, PageSpeed optimization guidance, and local search strategy for Halifax Regional Municipality businesses.",
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Halifax",
        addressRegion: "NS",
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 44.6488,
        longitude: -63.5752,
      },
      founder: {
        "@type": "Person",
        name: "Hudson Latimer",
        url: "https://huddydev.ca",
      },
      areaServed: [
        { "@type": "City", name: "Halifax" },
        { "@type": "City", name: "Dartmouth" },
        { "@type": "City", name: "Bedford" },
        { "@type": "AdministrativeArea", name: "Nova Scotia" },
      ],
      serviceType: [
        "SEO audit Halifax",
        "Website performance optimization",
        "Local SEO Nova Scotia",
        "Core Web Vitals consulting",
      ],
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "HFX SEO Audit Tool",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Modern evergreen browser recommended.",
      isAccessibleForFree: true,
      inLanguage: "en-CA",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
      },
      description:
        "Free instant Lighthouse SEO and PageSpeed audit for Halifax-area business websites.",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does site speed affect Google rankings in Halifax?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Core Web Vitals and overall page experience influence how Google evaluates quality, especially on mobile where most Halifax, Dartmouth, and HRM local searches happen.",
          },
        },
        {
          "@type": "Question",
          name: "I am on Google Maps. Do I still need website SEO in Nova Scotia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Google Business Profile helps discovery, but your website still competes for service keywords and near me searches across Halifax Regional Municipality. On-page SEO connects those queries to your offers.",
          },
        },
        {
          "@type": "Question",
          name: "How soon will rankings change after technical fixes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lab metrics improve as soon as changes deploy. Organic rankings typically shift over several weeks as Google re-crawls and re-evaluates Halifax and Nova Scotia search results.",
          },
        },
        {
          "@type": "Question",
          name: "Does this free audit work for Dartmouth and Bedford businesses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Enter any public URL. The same Lighthouse rules apply across HRM; local rankings still depend on your content, citations, and competition in each neighbourhood.",
          },
        },
        {
          "@type": "Question",
          name: "What data powers the HFX SEO audit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool uses Google's PageSpeed Insights API, which runs Lighthouse against your page for mobile and desktop strategies and returns performance, SEO, and best-practices category scores.",
          },
        },
        {
          "@type": "Question",
          name: "Is the Halifax SEO audit free for small businesses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Running a URL audit on hfxseo.ca is free. Optional AI-generated summaries may use a configured Hugging Face token; core scores and issues do not require payment.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${ebGaramond.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
