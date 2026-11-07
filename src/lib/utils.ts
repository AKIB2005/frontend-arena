import {clsx, type ClassValue} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {classGroups: {shadow: [{shadow: ['hard', 'hard-lg', 'hard-sm']}]}},
})

/** Compose class names and resolve Tailwind conflicts. */
export const cn = (...v: ClassValue[]): string => twMerge(clsx(v))
