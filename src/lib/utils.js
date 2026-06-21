import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* Score → colour / tone helpers shared across the results UI. */

export function scoreHex(n) {
  if (n == null) return '#71717a';
  if (n >= 90) return '#22c55e';
  if (n >= 50) return '#f59e0b';
  return '#ef4444';
}

export function scoreTone(n) {
  if (n == null) return 'text-zinc-500';
  if (n >= 90) return 'text-emerald-400';
  if (n >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export function scoreLabel(n) {
  if (n == null) return 'No data';
  if (n >= 90) return 'Good';
  if (n >= 50) return 'Needs work';
  return 'Poor';
}

export function letterGrade(n) {
  if (n == null) return '—';
  if (n >= 90) return 'A';
  if (n >= 80) return 'B';
  if (n >= 70) return 'C';
  if (n >= 50) return 'D';
  return 'F';
}

export const ratingMeta = {
  good: { tone: 'text-emerald-400', dot: 'bg-emerald-400', ring: 'border-emerald-500/30 bg-emerald-500/5', label: 'Good' },
  'needs-improvement': { tone: 'text-amber-400', dot: 'bg-amber-400', ring: 'border-amber-500/30 bg-amber-500/5', label: 'Needs work' },
  poor: { tone: 'text-red-400', dot: 'bg-red-400', ring: 'border-red-500/30 bg-red-500/5', label: 'Poor' },
  unknown: { tone: 'text-zinc-500', dot: 'bg-zinc-600', ring: 'border-white/10 bg-white/[0.02]', label: '—' },
};
