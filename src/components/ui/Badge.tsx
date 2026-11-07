import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'accent' | 'plain'
const tones: Record<Tone, string> = {
  accent: 'bg-accent text-on-accent',
  plain: 'bg-surface text-fg',
}

export function Badge({
  tone = 'plain',
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border-2 border-edge px-2 py-0.5 text-xs font-bold leading-tight',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
