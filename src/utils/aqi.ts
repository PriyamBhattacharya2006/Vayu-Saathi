import type { AQILevelId } from '../types/cleanAir.ts';

export function getAQILevelId(aqi: number): AQILevelId {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
}

export interface AQIVisualMeta {
  levelId: AQILevelId;
  range: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  barColor: string;
  patternHint: string;
}

export function getAQIVisualMeta(aqi: number): AQIVisualMeta {
  const levelId = getAQILevelId(aqi);
  switch (levelId) {
    case 'good':
      return {
        levelId,
        range: '0–50',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
        textClass: 'text-emerald-800 dark:text-emerald-200',
        borderClass: 'border-emerald-300 dark:border-emerald-800',
        barColor: '#15803D',
        patternHint: 'Low risk',
      };
    case 'moderate':
      return {
        levelId,
        range: '51–100',
        bgClass: 'bg-amber-50 dark:bg-amber-950/50',
        textClass: 'text-amber-900 dark:text-amber-200',
        borderClass: 'border-amber-300 dark:border-amber-800',
        barColor: '#CA8A04',
        patternHint: 'Moderate',
      };
    case 'sensitive':
      return {
        levelId,
        range: '101–150',
        bgClass: 'bg-orange-50 dark:bg-orange-950/50',
        textClass: 'text-orange-900 dark:text-orange-200',
        borderClass: 'border-orange-300 dark:border-orange-800',
        barColor: '#EA580C',
        patternHint: 'Sensitive alert',
      };
    case 'unhealthy':
      return {
        levelId,
        range: '151–200',
        bgClass: 'bg-red-50 dark:bg-red-950/50',
        textClass: 'text-red-900 dark:text-red-200',
        borderClass: 'border-red-300 dark:border-red-800',
        barColor: '#DC2626',
        patternHint: 'Unhealthy',
      };
    case 'very-unhealthy':
      return {
        levelId,
        range: '201–300',
        bgClass: 'bg-purple-50 dark:bg-purple-950/50',
        textClass: 'text-purple-900 dark:text-purple-200',
        borderClass: 'border-purple-300 dark:border-purple-800',
        barColor: '#7E22CE',
        patternHint: 'Very unhealthy',
      };
    case 'hazardous':
      return {
        levelId,
        range: '301+',
        bgClass: 'bg-rose-100 dark:bg-rose-950/70',
        textClass: 'text-rose-950 dark:text-rose-100',
        borderClass: 'border-rose-400 dark:border-rose-700',
        barColor: '#881337',
        patternHint: 'Hazardous smog',
      };
  }
}

export function pm25ToUsAqi(pm25: number): number {
  const c = Math.max(0, Math.round(pm25 * 10) / 10);
  const bps: [number, number, number, number][] = [
    [0.0, 9.0, 0, 50],
    [9.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 125.4, 151, 200],
    [125.5, 225.4, 201, 300],
    [225.5, 500.4, 301, 500],
  ];
  for (const [cl, ch, il, ih] of bps) {
    if (c <= ch) {
      return Math.round(((ih - il) / (ch - cl)) * (c - cl) + il);
    }
  }
  return 500;
}
