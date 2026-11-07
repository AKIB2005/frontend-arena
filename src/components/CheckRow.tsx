import { motion } from 'framer-motion'
import type { Check } from '../match'
import { cn } from '../lib/utils'
import { punchIn, useMotion } from '../lib/motion'

const META = {
  met: { glyph: '✓', cls: 'bg-fill-ink text-on-ink', text: 'Met' },
  unmet: { glyph: '✕', cls: 'bg-surface text-ink', text: 'Not met' },
  unknown: {
    glyph: '?',
    cls: 'border-dotted bg-surface text-ink',
    text: 'Add to your profile',
  },
} as const

/** One eligibility line: icon + label + status in words + optional hint. Never colour alone. */
export function CheckRow({
  check,
  hint,
  compact,
  punch,
  index = 0,
}: {
  check: Check
  hint?: string
  compact?: boolean
  punch?: boolean
  index?: number
}) {
  const m = META[check.status]
  const { reduce } = useMotion()
  return (
    <motion.li
      variants={punchIn}
      custom={index}
      initial={punch && !reduce ? 'hidden' : false}
      animate="show"
      className={cn(
        'group/check relative flex items-start gap-3 rounded-xl border-2 border-edge bg-surface text-fg transition-[transform,opacity] duration-200 can-hover:hover:-translate-x-0.5 focus-within:-translate-x-0.5',
        check.status === 'unmet' &&
          'bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,var(--paper)_8px,var(--paper)_10px)]',
        compact ? 'p-2.5' : 'p-3',
      )}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-0 top-2 w-1 origin-left scale-x-0 rounded-r bg-accent transition-transform duration-200 can-hover:group-hover/check:scale-x-100 group-focus-within/check:scale-x-100"
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-edge text-sm font-extrabold',
          m.cls,
        )}
      >
        {m.glyph}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{check.label}</p>
        <p className="text-sm text-muted">
          <span className="font-bold text-fg">{m.text}.</span>
          {hint ? ` ${hint}` : ''}
        </p>
      </div>
    </motion.li>
  )
}
