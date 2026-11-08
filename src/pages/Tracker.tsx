import { LayoutGroup, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DATA, type Sch } from '../data'
import { daysLeft, money } from '../match'
import { STATUSES, useApp, type App as Tracked } from '../store'
import { useActions, STATUS_LABEL } from '../lib/actions'
import { useCountUp } from '../lib/hooks'
import { downloadIcs } from '../lib/ics'
import { useMotion } from '../lib/motion'
import { useUI } from '../lib/ui-store'
import { Due } from '../components/Due'
import { SegmentedMeter } from '../components/SegmentedMeter'
import { Stamp } from '../components/Stamp'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { controlClass } from '../components/ui/Field'
import { isClosed } from '../lib/dates'

type Item = { a: Tracked; s: Sch }
const TOTAL_AVAILABLE = DATA.reduce((t, s) => t + s.amount, 0)

function TrackerCard({ item, col }: { item: Item; col: number }) {
  const { a, s } = item
  const { note, toggleDoc } = useApp()
  const { moveTo, removeWithUndo } = useActions()
  const { tr } = useMotion()
  const prev = STATUSES[col - 1],
    next = STATUSES[col + 1]
  return (
    <motion.li
      layout
      layoutId={`t-${s.id}`}
      transition={tr({ duration: 0.25, ease: 'easeOut' })}
      className="group/tracker relative list-none rounded-xl border-2 border-edge bg-surface p-3 pl-5 text-fg shadow-hard-sm transition-[transform,opacity] duration-200 can-hover:hover:-translate-y-0.5 focus-within:-translate-y-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute left-1 top-4 grid h-8 w-3 translate-x-[-6px] gap-0.5 opacity-60 transition-[transform,opacity] duration-200 can-hover:group-hover/tracker:translate-x-0 can-hover:group-hover/tracker:opacity-100 focus-within:translate-x-0"
      >
        <i className="h-1 w-1 rounded-full bg-ink" />
        <i className="h-1 w-1 rounded-full bg-ink" />
        <i className="h-1 w-1 rounded-full bg-ink" />
        <i className="h-1 w-1 rounded-full bg-ink" />
      </span>
      <Stamp id={s.id} />
      <Link
        to={`/s/${s.id}`}
        className="font-bold leading-snug underline-offset-2 can-hover:hover:underline focus-visible:underline"
      >
        {s.name}
      </Link>
      <p className="mt-1 text-sm">
        <span className="font-bold">{money(s.amount)}</span>{' '}
        <Due d={s.deadline} />
      </p>
      <fieldset className="mt-2">
        <legend className="text-sm font-bold">Documents ready</legend>
        {s.docs.map((d) => (
          <label
            key={d}
            className="group/doc relative flex min-h-[44px] items-center gap-3 text-sm"
          >
            <input
              type="checkbox"
              className="peer h-6 w-6 shrink-0 accent-accent"
              checked={a.docs.includes(d)}
              onChange={() => toggleDoc(s.id, d)}
            />
            <span>{d}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-9 right-0 top-1/2 origin-left scale-x-0 border-t-2 border-ink transition-transform duration-200 peer-checked:scale-x-100"
            />
          </label>
        ))}
      </fieldset>
      <label htmlFor={`n-${s.id}`} className="mt-1 block text-sm font-bold">
        Notes
      </label>
      <textarea
        id={`n-${s.id}`}
        rows={2}
        className={controlClass}
        value={a.notes}
        onChange={(e) => note(s.id, e.target.value)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {prev && (
          <Button size="sm" variant="ghost" onClick={() => moveTo(s, prev)}>
            Move back
            <span className="sr-only">
              {' '}
              to {STATUS_LABEL[prev]}: {s.name}
            </span>
          </Button>
        )}
        {next && (
          <Button size="sm" variant="primary" onClick={() => moveTo(s, next)}>
            Move to {STATUS_LABEL[next]}
            <span className="sr-only">: {s.name}</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => removeWithUndo(s)}
          className="text-accent"
        >
          Remove<span className="sr-only"> {s.name}</span>
        </Button>
      </div>
    </motion.li>
  )
}

export default function Tracker() {
  const apps = useApp((s) => s.apps)
  const toast = useUI((s) => s.toast)
  const items: Item[] = apps
    .map((a) => ({ a, s: DATA.find((x) => x.id === a.id) }))
    .filter((x): x is Item => !!x.s)
  const total = items.reduce((t, x) => t + x.s.amount, 0)
  const shown = useCountUp(total)
  const open = items.filter(
    (x) => x.a.status === 'saved' || x.a.status === 'applying',
  )
  const inProgress = items.filter(
    (x) => x.a.status === 'applying' || x.a.status === 'submitted',
  ).length
  const closing = [...open]
    .filter((x) => !!x.s.deadline && !isClosed(x.s.deadline))
    .sort((a, b) =>
      (a.s.deadline ?? '9999-12-31').localeCompare(b.s.deadline ?? '9999-12-31'),
    )
    .slice(0, 3)

  const docNeeds = new Map<string, { need: number; ready: number }>()
  for (const { a, s } of open)
    for (const d of s.docs) {
      const e = docNeeds.get(d) ?? { need: 0, ready: 0 }
      e.need++
      if (a.docs.includes(d)) e.ready++
      docNeeds.set(d, e)
    }
  const docRank = [...docNeeds.entries()].sort(
    (a, b) =>
      b[1].need - a[1].need ||
      a[1].ready - b[1].ready ||
      a[0].localeCompare(b[0]),
  )

  const strip = Array.from({ length: 30 }, (_, i) =>
    open.filter((x) => daysLeft(x.s.deadline) === i),
  )
  const within30 = open
    .filter((x) => {
      const n = daysLeft(x.s.deadline)
      return n >= 0 && n < 30
    })
    .sort((a, b) =>
      (a.s.deadline ?? '9999-12-31').localeCompare(b.s.deadline ?? '9999-12-31'),
    )

  if (!items.length)
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-extrabold">Your tracker is empty</h1>
        <p className="mb-5 mt-2 text-muted">
          Add a scholarship and it will show up here with its documents and
          deadline.
        </p>
        <ButtonLink to="/discover">Find scholarships</ButtonLink>
      </Card>
    )

  const exportIcs = () => {
    const list = open.map((x) => x.s)
    if (!list.length) {
      toast(
        'Nothing to export yet. Saved and applying scholarships go in the calendar.',
      )
      return
    }
    downloadIcs(list)
    toast(
      `Calendar downloaded with ${list.length} deadline${list.length === 1 ? '' : 's'}`,
    )
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl font-extrabold">My tracker</h1>
        <Button variant="ghost" onClick={exportIcs}>
          Download calendar (.ics)
        </Button>
      </div>

      <section aria-label="Summary" className="my-6 grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Potential funding</p>
          <p
            className="odometer font-head text-4xl font-extrabold"
            aria-label={money(total)}
          >
            {money(shown)}
          </p>
          <SegmentedMeter
            className="mt-3"
            value={total}
            max={TOTAL_AVAILABLE}
            segments={10}
            fillClass="bg-accent"
            label={`${money(total)} of ${money(TOTAL_AVAILABLE)} available across all scholarships`}
          />
          <p className="mt-2 text-sm text-muted">
            of {money(TOTAL_AVAILABLE)} available
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Applications in progress</p>
          <p className="font-head text-4xl font-extrabold">{inProgress}</p>
          <p className="mt-2 text-sm text-muted">Applying or submitted</p>
        </Card>
        <Card>
          <p className="mb-1 text-sm text-muted">Closing next</p>
          {closing.length ? (
            <ul className="space-y-2 text-sm">
              {closing.map((x) => (
                <li
                  key={x.s.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate font-bold">{x.s.name}</span>
                  <Due d={x.s.deadline} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Nothing pending.</p>
          )}
        </Card>
      </section>

      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        <Card as="section" aria-labelledby="docs">
          <h2 id="docs" className="text-xl font-extrabold">
            Gather these documents first
          </h2>
          <p className="mb-3 text-sm text-muted">
            Ranked by how many of your open scholarships need them.
          </p>
          {docRank.length ? (
            <ol className="space-y-3">
              {docRank.slice(0, 6).map(([d, v]) => (
                <li key={d}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold">{d}</span>
                    <span className="text-sm text-muted">
                      {v.ready} of {v.need} ready
                    </span>
                  </div>
                  <SegmentedMeter
                    className="mt-1"
                    value={v.ready}
                    max={v.need}
                    segments={Math.min(v.need, 8)}
                    tall={false}
                    label={`${v.ready} of ${v.need} scholarships have ${d} ready`}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <p>Every scholarship here is already submitted. Nice work.</p>
          )}
        </Card>
        <Card as="section" aria-labelledby="strip">
          <h2 id="strip" className="text-xl font-extrabold">
            Next 30 days
          </h2>
          <div aria-hidden="true" className="mb-1 mt-3 flex gap-0.5">
            {strip.map((d, i) => (
              <span
                key={i}
                className={`h-9 flex-1 rounded-sm border-2 border-edge ${d.length ? (i <= 7 ? 'bg-accent' : 'bg-accent') : 'bg-surface'}`}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="mb-3 flex justify-between text-xs text-muted"
          >
            <span>Today</span>
            <span>30 days</span>
          </div>
          {within30.length ? (
            <ul className="space-y-2 text-sm">
              {within30.map((x) => (
                <li
                  key={x.s.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate">
                    {x.s.deadline
                      ? new Date(x.s.deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : 'Rolling or no deadline stated'}
                    : <span className="font-bold">{x.s.name}</span>
                  </span>
                  <Due d={x.s.deadline} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">
              Nothing you are tracking closes in the next 30 days.
            </p>
          )}
        </Card>
      </div>

      <LayoutGroup>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STATUSES.map((st, col) => {
            const here = items.filter((x) => x.a.status === st)
            return (
              <section
                key={st}
                aria-labelledby={`c-${st}`}
                className="rounded-xl border-2 border-edge bg-paper/60 p-3 bg-paper/60"
              >
                <h2 id={`c-${st}`} className="mb-3 text-lg font-extrabold">
                  {STATUS_LABEL[st]}{' '}
                  <span className="text-muted">({here.length})</span>
                </h2>
                {here.length ? (
                  <ul className="space-y-3">
                    {here.map((it) => (
                      <TrackerCard key={it.s.id} item={it} col={col} />
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl border-2 border-dashed border-edge p-3 text-sm text-muted">
                    Nothing here yet.
                  </p>
                )}
              </section>
            )
          })}
        </div>
      </LayoutGroup>
    </>
  )
}
