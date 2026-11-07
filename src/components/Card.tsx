import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { type Sch } from '../data'
import { money, daysLeft } from '../match'
import { useApp } from '../store'
import { Ring } from './Ring'
import { Due } from './Due'
import { Button } from './ui/Button'
import { cardVariants } from '../lib/motion'

interface CardProps {
  s: Sch
  score: number
  onQuickView?: (id: string) => void
  motionEnabled?: boolean
}

export function Card({ s, score, onQuickView, motionEnabled }: CardProps) {
  const { apps, add } = useApp()
  const saved = apps.some(a => a.id === s.id)
  const prefersReduced = useReducedMotion()
  const closed = daysLeft(s.deadline) < 0

  const content = (
    <>
      <Ring v={score} />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-lg font-bold leading-snug">
          <Link to={`/s/${s.id}`} className="hover:underline">
            {s.name}
          </Link>
        </h3>
        <p className="text-sm text-soft">{s.provider}</p>
        <p className="mt-2 text-sm">
          <span className="font-head text-xl font-bold">{money(s.amount)}</span>
          <span className="text-soft"> · </span>
          <Due d={s.deadline} />
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {onQuickView ? (
            <button
              onClick={() => onQuickView(s.id)}
              className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-white hover:bg-ink/90 min-h-[40px]"
            >
              Quick view
            </button>
          ) : (
            <Link to={`/s/${s.id}`} className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-white hover:bg-ink/90 min-h-[40px] inline-flex items-center">
              Check eligibility
            </Link>
          )}
          <button
            onClick={() => add(s.id)}
            disabled={saved || closed}
            aria-label={saved ? `${s.name} is saved` : `Save ${s.name}`}
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium min-h-[40px] disabled:bg-sun disabled:border-sun hover:bg-mist"
          >
            {saved ? 'Saved' : closed ? 'Closed' : 'Add to my tracker'}
          </button>
        </div>
      </div>
    </>
  )

  if (motionEnabled && !prefersReduced) {
    return (
      <motion.article
        variants={cardVariants}
        className="flex gap-4 rounded-xl border border-line bg-white p-5"
      >
        {content}
      </motion.article>
    )
  }

  return (
    <article className="flex gap-4 rounded-xl border border-line bg-white p-5">
      {content}
    </article>
  )
}
