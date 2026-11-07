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
import { useApp } from '../store'
import { CT, FD, LV } from '../lib/options'
import { useMotion } from '../lib/motion'
import { CompareBar } from '../components/CompareBar'
import { QuickView } from '../components/QuickView'
import { ScholarshipCard } from '../components/ScholarshipCard'
import { CardSkeleton } from '../components/Skeleton'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { controlClass } from '../components/ui/Field'
import { useMatches } from '../lib/matches'

// First-visit-only effects: skeletons and the staggered entrance run once per page load.
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
  const { reduce } = useMotion()
  const [q, setQ] = useState('')
  const [lvl, setLvl] = useState('')
  const [fld, setFld] = useState('')
  const [cat, setCat] = useState('')
  const [win, setWin] = useState('0')
  const [only, setOnly] = useState(false)
  const [sort, setSort] = useState('match')
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(!introDone)
  const [entering, setEntering] = useState(false)
  const [quick, setQuick] = useState<Sch | null>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const deferredQuery = useDeferredValue(q)

  useEffect(() => {
    if (introDone) return
    const t = window.setTimeout(() => {
      introDone = true
      setLoading(false)
      if (!reduce) {
        setEntering(true)
        window.setTimeout(() => setEntering(false), 800)
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [reduce])

  const rows = useMemo(() => {
    const w = Number(win)
    return DATA.map((s) => ({ s, m: matches.get(s.id)! }))
      .filter(
        ({ s, m }) =>
          (!deferredQuery ||
            (s.name + s.provider)
              .toLowerCase()
              .includes(deferredQuery.toLowerCase())) &&
          (!lvl || s.levels.includes(lvl)) &&
          (!fld ||
            fld === 'Any' ||
            s.fields.includes('Any') ||
            s.fields.includes(fld)) &&
          (!cat || !s.cats.length || s.cats.includes(cat)) &&
          (!w || daysLeft(s.deadline) <= w) &&
          (!only || m.score >= 70),
      )
      .sort((a, b) =>
        sort === 'match'
          ? b.m.score - a.m.score
          : sort === 'amount'
            ? b.s.amount - a.s.amount
            : a.s.deadline.localeCompare(b.s.deadline),
      )
  }, [matches, deferredQuery, lvl, fld, cat, win, only, sort])

  const clear = () => {
    setQ('')
    setLvl('')
    setFld('')
    setCat('')
    setWin('0')
    setOnly(false)
  }
  const activeFilters = [
    lvl,
    fld,
    cat,
    win !== '0' ? win : '',
    only ? 'strong' : '',
  ].filter(Boolean).length
  const strongCount = rows.filter(({ m }) => m.score >= 70).length

  return (
    <>
      <h1 className="text-4xl font-extrabold sm:text-5xl">
        Scholarships for you
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        Sorted by how well you match. Add more to your profile and the scores
        get sharper.
      </p>

      <Card
        as="section"
        aria-labelledby="filters"
        className="sticky top-2 z-20 mt-6 border-b-4"
      >
        <h2 id="filters" className="sr-only">
          Search and filters
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="search" className="mb-1 block text-sm font-bold">
              Search by name or provider{' '}
              <span className="font-normal text-muted">
                (press / to jump here)
              </span>
            </label>
            <input
              id="search"
              type="search"
              className={controlClass}
              placeholder="e.g. merit, women, law"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
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
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-edge pt-3 text-sm">
          <p role="status" aria-live="polite" className="font-bold">
            {rows.length} scholarships, {strongCount} strong matches
          </p>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clear}
              className="min-h-[44px] rounded-lg border-2 border-edge bg-surface px-3 font-bold transition-[transform,opacity] duration-200 can-hover:hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
            >
              Clear all ({activeFilters})
            </button>
          )}
        </div>
      </Card>

      <section
        aria-labelledby="results"
        className="mt-8 pb-28"
        aria-busy={isPending}
      >
        <h2 id="results" className="mb-4 text-2xl font-extrabold">
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
          <AnimatePresence mode="popLayout">
            <ul className="grid gap-5 md:grid-cols-2">
              {rows.map(({ s, m }, i) => (
                <motion.li
                  key={s.id}
                  initial={entering ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                    delay: entering ? Math.min(i, 8) * 0.05 : 0,
                  }}
                >
                  <ScholarshipCard
                    s={s}
                    score={m.score}
                    checks={m.checks}
                    onQuickView={(sch, el) => {
                      trigger.current = el
                      setQuick(sch)
                    }}
                  />
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        ) : (
          <Card className="text-center">
            <p className="text-lg font-extrabold">
              No scholarships match these filters.
            </p>
            <p className="mb-4 text-muted">
              Clear the filters or turn off “Strong matches only”.
            </p>
            <button
              type="button"
              onClick={clear}
              className="min-h-[44px] rounded-xl border-2 border-edge bg-accent px-5 font-bold text-inverse-text shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Clear filters
            </button>
          </Card>
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
