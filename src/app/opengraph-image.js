import { ImageResponse } from 'next/og';

export const alt = 'HFX SEO Audit — free Halifax website speed and SEO check';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0a0b',
          backgroundImage: 'linear-gradient(145deg, #0a0a0b 0%, #18181a 55%, #0a0a0b 100%)',
          padding: 72,
          color: '#fafafa',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          HFX SEO Audit
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#a1a1aa',
            maxWidth: 880,
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          Free Halifax website audit — Lighthouse scores, Core Web Vitals, and fixes for Nova
          Scotia businesses.
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 17,
            color: '#52525b',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            fontWeight: 600,
          }}
        >
          hfxseo.ca · Halifax Regional Municipality
        </div>
      </div>
    ),
    { ...size }
  );
}
