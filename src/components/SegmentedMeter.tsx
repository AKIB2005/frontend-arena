import {useEffect, useState} from 'react'
import {cn} from '../lib/utils'

type Props = {value: number; max: number; segments?: number; label?: string; fillClass?: string; className?: string; tall?: boolean}

/** Chunky blocks that fill one by one. Used for funding, onboarding progress and profile completeness. */
export function SegmentedMeter({value, max, segments = 12, label, fillClass = 'bg-accent', className, tall = true}: Props) {
  const target = max > 0 ? Math.min(segments, Math.max(value > 0 ? 1 : 0, Math.round((value / max) * segments))) : 0
  const [filled, setFilled] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(target))
    return () => cancelAnimationFrame(id)
  }, [target])
  return (
    <div {...(label ? {role: 'img', 'aria-label': label} : {'aria-hidden': true})} className={cn('flex gap-1', className)}>
      {Array.from({length: segments}, (_, i) => (
        <span
          key={i}
          style={{transitionDelay: `${i * 20}ms`}}
          className={cn('flex-1 rounded-md border-2 border-edge transition-colors duration-100', tall ? 'h-6' : 'h-4', i < filled ? fillClass : 'bg-surface')}
        />
      ))}
    </div>
  )
}
