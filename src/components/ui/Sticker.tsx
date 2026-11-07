import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'accent' | 'plain'
const tones: Record<Tone, string> = {
  accent: 'bg-accent text-inverse-text',
  plain: 'bg-surface text-fg',
}

/** Slightly rotated badge that straightens on hover. `rotate` is -2 to 2 degrees. */
export function Sticker({
  tone = 'accent',
  rotate = -2,
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; rotate?: number }) {
  const s: CSSProperties = { ...style, ['--r' as string]: `${rotate}deg` }
  return (
    <span
      style={s}
      className={cn(
        'sticker inline-block rounded-lg border-2 border-edge px-2.5 py-1 text-sm font-bold leading-tight shadow-hard-sm',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
