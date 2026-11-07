import { Link } from 'react-router-dom'
import type { Sch } from '../data'
import { money } from '../match'
import { useApp } from '../store'
import { useUI } from '../lib/ui-store'
import { useActions } from '../lib/actions'
import { cn } from '../lib/utils'
import { Due, isUrgent } from './Due'
import { RatchetRing } from './RatchetRing'
import { Stamp } from './Stamp'
import { Button, ButtonLink } from './ui/Button'
import { Card } from './ui/Card'
import { Tooltip } from './ui/Tooltip'
import type { Check } from '../match'

type Props = {
  s: Sch
  score: number
  checks: Check[]
  onQuickView: (s: Sch, trigger: HTMLElement) => void
}

export function ScholarshipCard({ s, score, checks, onQuickView }: Props) {
  const saved = useApp((st) => st.apps.some((a) => a.id === s.id))
  const { compare, toggleCompare } = useUI()
  const { save } = useActions()
  const picked = compare.includes(s.id)
  const full = compare.length >= 3 && !picked
  return (
    <Card
      as="article"
      tabIndex={0}
      data-testid="scholarship-card"
      className={cn(
        'group/card relative isolate flex h-full flex-col gap-4 bg-surface text-fg transition-[transform,opacity] duration-200 can-hover:hover:-translate-y-0.5 focus-within:-translate-y-0.5',
        isUrgent(s.deadline) && 'ticket',
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-xl bg-edge transition-transform duration-200 group-hover/card:translate-x-2 group-hover/card:translate-y-2"
      />
      <Stamp id={s.id} />
      <div className="relative z-10 flex min-h-[12rem] gap-4">
        <Tooltip
          label={`Why this match? ${checks.filter((c) => c.status === 'met').length} met, ${checks.filter((c) => c.status === 'unmet').length} not met, ${checks.filter((c) => c.status === 'unknown').length} to check.`}
        >
          <span className="inline-flex text-fg">
            <RatchetRing value={score} />
          </span>
        </Tooltip>
        <div className="min-w-0 flex-1">
          <h3
            data-testid="scholarship-title"
            title={s.name}
            className="line-clamp-2 text-lg font-extrabold leading-snug text-fg"
          >
            <Link
              to={`/s/${s.id}`}
              className="underline-offset-2 can-hover:hover:underline focus-visible:underline"
            >
              {s.name}
            </Link>
          </h3>
          <p data-testid="scholarship-provider" className="text-sm text-muted">
            {s.provider}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              data-testid="scholarship-amount"
              className="font-head text-xl font-extrabold text-fg"
            >
              {money(s.amount)}
            </span>
            <span data-testid="scholarship-deadline">
              <Due d={s.deadline} />
            </span>
          </p>
        </div>
      </div>
      <div className="relative z-10 grid min-h-[4.25rem] content-center gap-2 rounded-lg border-2 border-edge bg-surface p-2 text-sm text-fg transition-[transform,opacity] duration-200 sm:opacity-0 sm:translate-y-2 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100 sm:group-focus-within/card:translate-y-0 sm:group-focus-within/card:opacity-100">
        <p className="font-bold">
          You meet {checks.filter((c) => c.status === 'met').length} of{' '}
          {checks.length} criteria
        </p>
        <div
          className="flex gap-1"
          aria-label={`${checks.filter((c) => c.status === 'met').length} met, ${checks.filter((c) => c.status === 'unmet').length} not met, ${checks.filter((c) => c.status === 'unknown').length} unknown`}
        >
          {checks.map((check) => (
            <span
              key={check.label}
              className={cn(
                'h-3 w-3 rounded-full border-2 border-edge',
                check.status === 'met' && 'bg-ink',
                check.status === 'unknown' && 'border-dashed',
              )}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 mt-auto flex flex-wrap gap-2">
        <ButtonLink to={`/s/${s.id}`} variant="ghost" size="sm">
          Check eligibility<span className="sr-only">: {s.name}</span>
        </ButtonLink>
        <Button
          size="sm"
          variant="primary"
          disabled={saved}
          onClick={() => save(s)}
        >
          {saved ? 'In my tracker' : 'Add to my tracker'}
          <span className="sr-only">: {s.name}</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => onQuickView(s, e.currentTarget)}
        >
          Quick view<span className="sr-only">: {s.name}</span>
        </Button>
      </div>
      <label
        data-testid="scholarship-compare"
        className={cn(
          'relative z-10 flex min-h-[44px] items-center gap-3 text-sm font-bold',
          full && 'opacity-60',
        )}
      >
        <input
          type="checkbox"
          className="h-6 w-6 shrink-0 accent-accent"
          checked={picked}
          disabled={full}
          onChange={() => toggleCompare(s.id)}
        />
        <span>
          Compare{full ? ' (3 already chosen)' : ''}
          <span className="sr-only">: {s.name}</span>
        </span>
      </label>
    </Card>
  )
}
