import {useEffect, useRef, useState} from 'react'
import {useMotion} from './motion'

/** Steps toward `target` in discrete ticks of 5 (ratchet feel). Total time stays under 380ms. */
export function useTicks(target: number): number {
  const {reduce} = useMotion()
  const [v, setV] = useState(reduce ? target : 0)
  const cur = useRef(v)
  useEffect(() => {
    if (reduce) { cur.current = target; setV(target); return }
    const from = cur.current
    if (from === target) return
    const dir = target > from ? 1 : -1
    const n = Math.max(1, Math.ceil(Math.abs(target - from) / 5))
    const gap = Math.min(60, 380 / n)
    let i = 0
    const id = window.setInterval(() => {
      i++
      const next = i >= n ? target : from + dir * 5 * i
      cur.current = next
      setV(next)
      if (i >= n) window.clearInterval(id)
    }, gap)
    return () => window.clearInterval(id)
  }, [target, reduce])
  return v
}

/** Smooth count-up (odometer). Instant when reduced motion is on. */
export function useCountUp(target: number, ms = 380): number {
  const {reduce} = useMotion()
  const [v, setV] = useState(reduce ? target : 0)
  const cur = useRef(v)
  useEffect(() => {
    if (reduce) { cur.current = target; setV(target); return }
    const from = cur.current
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      const eased = 1 - (1 - p) * (1 - p)
      const next = Math.round(from + (target - from) * eased)
      cur.current = next
      setV(next)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms, reduce])
  return v
}
