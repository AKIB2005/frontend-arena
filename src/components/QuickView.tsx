import type { Sch } from '../data'
import { match, money } from '../match'
import { useApp } from '../store'
import { useActions } from '../lib/actions'
import { CheckRow } from './CheckRow'
import { Dialog } from './Dialog'
import { Due } from './Due'
import { RatchetRing } from './RatchetRing'
import { Button, ButtonLink } from './ui/Button'

type Props = { s: Sch | null; onClose: () => void }

export function QuickView({ s, onClose }: Props) {
  const profile = useApp((st) => st.profile)
  const saved = useApp((st) => (s ? st.apps.some((a) => a.id === s.id) : false))
  const { save } = useActions()
  const m = s ? match(s, profile) : null
  return (
    <Dialog open={!!s} onClose={onClose} labelledBy="drawer-title">
      {s && m && (
        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2
              id="drawer-title"
              data-testid="quick-view-title"
              title={s.name}
              className="line-clamp-2 text-2xl font-extrabold leading-tight"
            >
              {s.name}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close quick view"
              className="shrink-0 !px-3"
            >
              <span aria-hidden="true">×</span>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <RatchetRing value={m.score} size={88} />
            <div>
              <p
                data-testid="quick-view-provider"
                className="text-sm text-muted"
              >
                {s.provider}
              </p>
              <p
                data-testid="quick-view-amount"
                className="font-head text-2xl font-extrabold"
              >
                {money(s.amount)}
              </p>
              <span data-testid="quick-view-deadline">
                <Due d={s.deadline} />
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            {m.known
              ? `You meet ${m.met} of ${m.known} criteria we could check.`
              : 'Fill in your profile to see how you match.'}
          </p>
          <h3 className="mb-2 mt-4 text-lg font-extrabold">Eligibility</h3>
          <ul className="space-y-2">
            {m.checks.map((c) => (
              <CheckRow key={c.label} check={c} compact />
            ))}
          </ul>
          <h3 className="mb-2 mt-5 text-lg font-extrabold">
            Documents to keep ready
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            {s.docs.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button disabled={saved} onClick={() => save(s)}>
              {saved ? 'In my tracker' : 'Add to my tracker'}
            </Button>
            <ButtonLink to={`/s/${s.id}`} variant="ghost" onClick={onClose}>
              Open full details
            </ButtonLink>
          </div>
        </div>
      )}
    </Dialog>
  )
}
