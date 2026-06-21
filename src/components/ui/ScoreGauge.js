'use client';
import { motion } from 'framer-motion';
import { scoreHex } from '@/lib/utils';
import CountUp from './CountUp';

/**
 * Animated circular score gauge (SVG stroke). Used for the five Lighthouse
 * category scores. Size-configurable so the same component renders the big
 * overall score and the smaller category dials.
 */
export default function ScoreGauge({ value, size = 112, stroke = 8, label, icon: Icon, delay = 0 }) {
  const n = typeof value === 'number' ? value : null;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = n == null ? 0 : Math.min(100, Math.max(0, n));
  const color = scoreHex(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-card/70 p-5 text-center transition-colors hover:border-white/[0.14]"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (pct / 100) * circumference }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center" style={{ color }}>
          <CountUp value={n} className="text-2xl font-semibold tabular-nums" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-zinc-400">
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
        <p className="text-xs font-medium">{label}</p>
      </div>
    </motion.div>
  );
}
