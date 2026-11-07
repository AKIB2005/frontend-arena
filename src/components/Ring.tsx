import { motion, useReducedMotion } from 'framer-motion'
import { dur } from '../lib/motion'

interface RingProps {
  v: number
  size?: number
  animate?: boolean
  delay?: number
}

export function Ring({ v, size = 64, animate = false, delay = 0 }: RingProps) {
  const prefersReduced = useReducedMotion()
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const col = v >= 70 ? '#0E7C66' : v >= 40 ? '#B7791F' : '#C73E5A'
  const offset = c * (1 - v / 100)

  return (
    <svg width={size} height={size} role="img" aria-label={`${v}% match`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#D5E2DC" strokeWidth="6" />
      {animate && !prefersReduced ? (
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: dur(600), delay: dur(delay * 1000), ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      ) : (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s' }}
        />
      )}
      <text x="50%" y="50%" dy=".35em" textAnchor="middle" className="font-head font-bold" fontSize={size / 3.4} fill="#0F2A2E">
        {v}%
      </text>
    </svg>
  )
}
