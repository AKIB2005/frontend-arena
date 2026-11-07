import { useReducedMotion } from 'framer-motion'
import type { Variants, Transition } from 'framer-motion'

/** Check prefers-reduced-motion. In components, call useReducedMotion() directly. */
export { useReducedMotion }

const quick: Transition = { duration: 0.3, ease: 'easeOut' }
const medium: Transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] }

/** Page enter/exit */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: medium },
  exit: { opacity: 0, y: -8, transition: quick },
}

/** Stagger container for card grids */
export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
}

/** Individual card entrance */
export const cardVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: quick },
}

/** Fade in only */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: quick },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

/** Slide up for drawers / panels */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: medium },
  exit: { opacity: 0, y: 24, transition: quick },
}

/** Scale from zero for ring fill */
export const scaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: medium },
}

/** Returns empty variants when reduced motion is preferred */
export function useMotionSafe<T extends Variants>(variants: T, prefersReduced?: boolean): T | undefined {
  if (prefersReduced) return undefined
  return variants
}

/** Duration helper – returns 0 when reduced motion is on */
export function dur(ms: number, prefersReduced?: boolean): number {
  return prefersReduced ? 0 : ms / 1000
}
