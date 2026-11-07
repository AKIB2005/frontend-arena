import { useReducedMotion, type Transition, type Variants } from 'framer-motion'
import { useUI } from './ui-store'

/** Every animation in Grantly stays under this many seconds. */
export const MAX = 0.4
export const DUR = { fast: 0.12, base: 0.2, slow: 0.3 } as const
export const EASE = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  enter: [0.16, 1, 0.3, 1] as const,
  exit: [0.7, 0, 0.84, 0] as const,
}
export const SPRING = {
  snappy: { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.7 },
  soft: { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.8 },
}

const instant: Transition = { duration: 0 }

/** Returns reduced-motion flag plus a helper that zeroes transitions when motion is off. */
export function useMotion() {
  const reduce = !!useReducedMotion() || useUI((s) => s.reduceMotion)
  const tr = (t: Transition): Transition => (reduce ? instant : t)
  return { reduce, tr }
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base } },
  exit: { opacity: 0, transition: { duration: DUR.fast } },
}

export const slideRight: Variants = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { duration: DUR.base, ease: 'easeOut' } },
  exit: { x: '100%', transition: { duration: DUR.fast } },
}

export const stepSlide: Variants = {
  hidden: (dir: number) => ({ opacity: 0, x: 24 * dir }),
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DUR.base, ease: 'easeOut' },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: -24 * dir,
    transition: { duration: DUR.fast },
  }),
}

/** Punch-in used by the checklist: drops in with a hard stop. */
export const punchIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { delay: i * 0.09, duration: DUR.fast, ease: 'easeOut' },
  }),
}

/** Wipe panel keyframes: left edge to right edge in 300ms. */
export const WIPE = {
  x: ['-100%', '0%', '100%'],
  times: [0, 0.5, 1],
  duration: DUR.slow,
}
