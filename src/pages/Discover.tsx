import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DATA, type Sch } from '../data'
import { daysLeft } from '../match'
import { isClosed } from '../lib/dates'
import { useApp } from '../store'
import { CT, FD, LV } from '../lib/options'
import { CompareBar } from '../components/CompareBar'
import { QuickView } from '../components/QuickView'
import { ScholarshipCard } from '../components/ScholarshipCard'
import { CardSkeleton } from '../components/Skeleton'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { controlClass } from '../components/ui/Field'
import { Sticker } from '../components/ui/Sticker'
import { AnimatedHeadline } from '../components/AnimatedHeadline'
import { useCountUp } from '../lib/hooks'
import { useMotion } from '../lib/motion'
import { useMatches } from '../lib/matches'

// First-visit-only loading keeps the initial page from flashing incomplete data.
let introDone = false

function Pick({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">
        {label}
      </label>
      <select
        id={id}
        className={controlClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  )
}

export default function Discover() {
  const profile = useApp((s) => s.profile)
  const matches = useMatches()
  const [q, setQ] = useState('')
  const [lvl, setLvl] = useState('')
  const [fld, setFld] = useState('')
  const [cat, setCat] = useState('')
  const [win, setWin] = useState('0')
  const [only, setOnly] = useState(false)
  const [origin, setOrigin] = useState('all')
  const [sort, setSort] = useState('match')
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(!introDone)
  const [quick, setQuick] = useState<Sch | null>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const deferredQuery = useDeferredValue(q)
  const { tr } = useMotion()
  const [showFilters, setShowFilters] = useState(() => {
    try {
      return window.matchMedia('(min-width: 1024px)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (introDone) return
    const t = window.setTimeout(() => {
      introDone = true
      setLoading(false)
    }, 400)
    return () => window.clearTimeout(t)
  }, [])

  const filterRows = (includeClosed: boolean) => {
    const w = Number(win)
    return DATA.map((s) => ({ s, m: matches.get(s.id)! }))
      .filter(
        ({ s, m }) =>
          (!deferredQuery ||
            (s.name + s.provider + (s.tags ?? []).join(' '))
              .toLowerCase()
              .includes(deferredQuery.toLowerCase())) &&
          (origin === 'all' ||
            (origin === 'real' && !s.isSample) ||
            (origin === 'sample' && s.isSample)) &&
          (!lvl || s.levels.includes(lvl)) &&
          (!fld ||
            fld === 'Any' ||
            s.fields.includes('Any') ||
            s.fields.includes(fld)) &&
          (!cat || !s.cats.length || s.cats.includes(cat)) &&
          (includeClosed ? isClosed(s.deadline) : !isClosed(s.deadline)) &&
          (!w || (daysLeft(s.deadline) <= w && daysLeft(s.deadline) >= 0)) &&
          (!only || m.score >= 70),
      )
      .sort((a, b) =>
        sort === 'match'
          ? b.m.score - a.m.score ||
            (daysLeft(a.s.deadline) - daysLeft(b.s.deadline))
          : sort === 'amount'
            ? b.s.amount - a.s.amount
            : (a.s.deadline ?? '9999-12-31').localeCompare(
                b.s.deadline ?? '9999-12-31',
              ),
      )
  }
  const rows = useMemo(() => filterRows(false), [
    matches,
    deferredQuery,
    lvl,
    fld,
    cat,
    win,
    only,
    origin,
    sort,
  ])
  const closedRows = useMemo(() => filterRows(true), [
    matches,
    deferredQuery,
    lvl,
    fld,
    cat,
    win,
    only,
    origin,
    sort,
  ])

  const clear = () => {
    setQ('')
    setLvl('')
    setFld('')
    setCat('')
    setWin('0')
    setOnly(false)
    setOrigin('all')
  }
  const activeFilters = [
    lvl,
    fld,
    cat,
    win !== '0' ? win : '',
    only ? 'strong' : '',
    origin !== 'all' ? origin : '',
  ].filter(Boolean).length
  const strongCount = rows.filter(({ m }) => m.score >= 70).length

  const open = DATA.filter((s) => !isClosed(s.deadline))
  const openStrong = open.filter((s) => (matches.get(s.id)?.score ?? 0) >= 70)
  const closing = open.filter((s) => daysLeft(s.deadline) <= 14)
  const nOpen = useCountUp(open.length, 700)
  const nStrong = useCountUp(openStrong.length, 700)
  const nClosing = useCountUp(closing.length, 700)
  const stats = [
    { label: 'Open now', value: nOpen, final: open.length },
    { label: 'Strong matches', value: nStrong, final: openStrong.length },
    { label: 'Closing in 14 days', value: nClosing, final: closing.length },
  ]

  return (
    <>
      <section
        aria-labelledby="discover-title"
        className="relative overflow-hidden rounded-xl border-2 border-edge bg-accent p-6 text-on-accent shadow-hard sm:p-8"
      >
        <Sticker
          rotate={3}
          tone="plain"
          className="float-slow absolute right-4 top-4 hidden sm:inline-block"
        >
          Updated daily
        </Sticker>
        <h1
          id="discover-title"
          className="max-w-2xl text-4xl font-extrabold leading-[1.05] sm:text-6xl"
        >
          <AnimatedHeadline text="Scholarships for you" />
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-medium">
          Sorted by how well you match. Add more to your profile and the scores
          get sharper.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map((st, i) => (
            <li
              key={st.label}
              className="rounded-xl border-2 border-edge bg-surface p-3 text-fg shadow-hard-sm"
            >
              <p className="odometer font-head text-4xl font-extrabold">
                <span aria-hidden="true">{st.value}</span>
                <span className="sr-only">{st.final}</span>
              </p>
              <p className="text-sm font-bold">{st.label}</p>
              <span
                aria-hidden="true"
                className="bar-grow mt-2 block h-1.5 rounded-full bg-accent"
                style={{ animationDelay: `${0.3 + i * 0.12}s` }}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Slim sticky toolbar: always reachable, never tall enough to cover results. */}
      <div
        data-no-reveal
        className="sticky top-0 z-30 -mx-4 mt-6 border-b-2 border-edge bg-surface px-4 py-2"
      >
        <section
          aria-labelledby="filters"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-2"
        >
          <h2 id="filters" className="sr-only">
            Search and filters
          </h2>
          <div className="min-w-0 flex-1 basis-48">
            <label htmlFor="search" className="sr-only">
              Search by name or provider (press / to jump here)
            </label>
            <input
              id="search"
              type="search"
              className={controlClass}
              placeholder="Search scholarships  ( / )"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button
            type="button"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            onClick={() => setShowFilters((v) => !v)}
            className="min-h-[44px] rounded-xl border-2 border-edge bg-surface px-4 font-bold shadow-hard-sm transition-[transform,box-shadow] duration-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none can-hover:hover:-translate-y-0.5"
          >
            Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
            <span aria-hidden="true" className="ml-2 inline-block">
              {showFilters ? '−' : '+'}
            </span>
          </button>
          <p
            role="status"
            aria-live="polite"
            className="w-full text-sm font-bold sm:w-auto"
          >
            {rows.length} scholarship{rows.length === 1 ? '' : 's'},{' '}
            {strongCount} strong match{strongCount === 1 ? '' : 'es'}
          </p>
        </section>
      </div>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            key="panel"
            id="filter-panel"
            data-no-reveal
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={tr({ duration: 0.4, ease: [0.16, 1, 0.3, 1] })}
            className="overflow-hidden"
          >
            <Card className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Pick
                  id="f-lvl"
                  label="Study level"
                  value={lvl}
                  onChange={(v) => startTransition(() => setLvl(v))}
                >
                  <option value="">All levels</option>
                  {LV.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Pick>
                <Pick
                  id="f-origin"
                  label="Show"
                  value={origin}
                  onChange={(v) => startTransition(() => setOrigin(v))}
                >
                  <option value="all">All</option>
                  <option value="real">Real only</option>
                  <option value="sample">Sample only</option>
                </Pick>
                <Pick
                  id="f-fld"
                  label="Field"
                  value={fld}
                  onChange={(v) => startTransition(() => setFld(v))}
                >
                  <option value="">All fields</option>
                  {FD.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Pick>
                <Pick
                  id="f-cat"
                  label="Category"
                  value={cat}
                  onChange={(v) => startTransition(() => setCat(v))}
                >
                  <option value="">All categories</option>
                  {CT.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Pick>
                <Pick
                  id="f-win"
                  label="Deadline"
                  value={win}
                  onChange={(v) => startTransition(() => setWin(v))}
                >
                  <option value="0">Any deadline</option>
                  <option value="14">Within 14 days</option>
                  <option value="30">Within 30 days</option>
                  <option value="90">Within 90 days</option>
                </Pick>
                <Pick
                  id="f-sort"
                  label="Sort by"
                  value={sort}
                  onChange={(v) => startTransition(() => setSort(v))}
                >
                  <option value="match">Best match</option>
                  <option value="deadline">Soonest deadline</option>
                  <option value="amount">Highest amount</option>
                </Pick>
                <label className="flex min-h-[44px] items-center gap-3 self-end font-bold">
                  <input
                    type="checkbox"
                    checked={only}
                    onChange={(e) => setOnly(e.target.checked)}
                    className="h-6 w-6 accent-accent"
                  />
                  Strong matches only
                </label>
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="min-h-[44px] self-end rounded-lg border-2 border-edge bg-surface px-3 font-bold transition-[transform,opacity] duration-200 can-hover:hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
                  >
                    Clear all ({activeFilters})
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        aria-labelledby="results"
        className="mt-8 scroll-mt-24 pb-28 pt-2"
        aria-busy={isPending}
      >
        <h2 id="results" className="section-title mb-5 text-2xl font-extrabold">
          {rows.length} scholarship{rows.length === 1 ? '' : 's'}
        </h2>
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2" aria-busy="true">
            <p className="sr-only" role="status">
              Loading scholarships
            </p>
            {[0, 1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : rows.length ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {rows.map(({ s, m }) => (
              <li key={s.id}>
                <ScholarshipCard
                  s={s}
                  score={m.score}
                  checks={m.checks}
                  onQuickView={(sch, el) => {
                    trigger.current = el
                    setQuick(sch)
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <Card className="text-center">
            <p className="text-lg font-extrabold">
              {origin === 'real'
                ? 'No real records match. Try All.'
                : 'No scholarships match these filters.'}
            </p>
            <p className="mb-4 text-muted">
              Clear the filters or turn off “Strong matches only”.
            </p>
            <button
              type="button"
              onClick={clear}
              className="min-h-[44px] rounded-xl border-2 border-edge bg-accent px-5 font-bold text-on-accent shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Clear filters
            </button>
          </Card>
        )}
        {closedRows.length > 0 && (
          <details className="mt-8">
            <summary className="cursor-pointer rounded-xl border-2 border-edge bg-surface p-4 font-extrabold">
              Closed ({closedRows.length})
            </summary>
            <ul className="mt-4 grid gap-5 md:grid-cols-2">
              {closedRows.map(({ s, m }) => (
                <li key={s.id} className="opacity-75">
                  <ScholarshipCard
                    s={s}
                    score={m.score}
                    checks={m.checks}
                    onQuickView={(sch, el) => {
                      trigger.current = el
                      setQuick(sch)
                    }}
                  />
                </li>
              ))}
            </ul>
          </details>
        )}
        {!profile.level && !loading && (
          <p className="mt-6 text-muted">
            Scores are rough until you add details.{' '}
            <ButtonLink
              to="/onboarding"
              variant="ghost"
              size="sm"
              className="ml-1"
            >
              Build my profile
            </ButtonLink>
          </p>
        )}
      </section>

      <QuickView s={quick} onClose={() => setQuick(null)} />
      <CompareBar />
    </>
  )
}
