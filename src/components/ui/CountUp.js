'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts up to `value` once it scrolls into view. Falls back to the raw value
 * for users who prefer reduced motion. Never sets state synchronously inside
 * the effect body — all updates happen inside requestAnimationFrame.
 */
export default function CountUp({ value, duration = 1100, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value == null || !inView) return undefined;

    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf;
    const start = performance.now();
    const tick = (now) => {
      if (reduce) {
        setDisplay(value);
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, inView, duration]);

  return (
    <span ref={ref} className={className}>
      {value == null ? '—' : display}
    </span>
  );
}
