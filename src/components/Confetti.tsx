import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useUI } from '../lib/ui-store'
import { useMotion } from '../lib/motion'

const COLORS = ['var(--ink)', 'var(--surface)', 'var(--accent)']

/** One burst of small squares. Fires once per session, and never with reduced motion. */
export function Confetti() {
  const n = useUI((s) => s.confetti)
  const { reduce } = useMotion()
  const [on, setOn] = useState(false)
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.4
        const dist = 110 + Math.random() * 130
        return {
          i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 40,
          rot: Math.random() * 360 - 180,
          size: 8 + Math.round(Math.random() * 6),
          color: COLORS[i % COLORS.length],
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n],
  )
  useEffect(() => {
    if (!n || reduce) return
    setOn(true)
    const t = window.setTimeout(() => setOn(false), 400)
    return () => window.clearTimeout(t)
  }, [n, reduce])
  if (!on) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2">
        {pieces.map((p) => (
          <motion.span
            key={p.i}
            className="absolute block border border-ink"
            style={{ width: p.size, height: p.size, background: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  )
}
