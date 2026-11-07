import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li'
  flat?: boolean
}

export function Card({ as: Tag = 'div', flat, className, ...rest }: Props) {
  return (
    <Tag
      className={cn(
        'relative isolate rounded-xl border-2 border-edge bg-surface p-5 text-fg',
        !flat && 'shadow-hard',
        className,
      )}
      {...rest}
    />
  )
}
