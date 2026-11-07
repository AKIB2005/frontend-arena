import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { DATA } from '../data'
import { match, daysLeft } from '../match'
import { useApp } from '../store'
import { Card } from '../components/Card'
import { QuickViewDrawer } from '../components/QuickViewDrawer'
import { CardSkeleton } from '../components/Skeleton'
import { SelectField } from '../components/ui/Field'
import { staggerContainer, pageVariants } from '../lib/motion'
import { LV } from '../components/ProfileForm'

export default function Discover() {
  const { profile } = useApp()
  const prefersReduced = useReducedMotion()
  const [q, setQ] = useState('')
  const [lvl, setLvl] = useState('')
  const [win, setWin] = useState(0)
  const [only, setOnly] = useState(false)
  const [sort, setSort] = useState('match')
  const [drawerId, setDrawerId] = useState<string | null>(null)

  // Skeleton loader on first render
  const [loaded, setLoaded] = useState(false)
  const loadedRef = useRef(false)
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true
      const t = setTimeout(() => setLoaded(true), 400)
      return () => clearTimeout(t)
    }
  }, [])

  // Track whether this is the initial render for stagger (only once)
  const [hasStaggered, setHasStaggered] = useState(false)
  useEffect(() => {
    if (loaded && !hasStaggered) {
      setHasStaggered(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  const rows = useMemo(
    () =>
      DATA.map(s => ({ s, m: match(s, profile) }))
        .filter(
          ({ s, m }) =>
            (!q || (s.name + s.provider).toLowerCase().includes(q.toLowerCase())) &&
            (!lvl || s.levels.includes(lvl)) &&
            (!win || daysLeft(s.deadline) <= win) &&
            (!only || m.score >= 70)
        )
        .sort((a, b) =>
          sort === 'match'
            ? b.m.score - a.m.score
            : sort === 'amount'
            ? b.s.amount - a.s.amount
            : a.s.deadline.localeCompare(b.s.deadline)
        ),
    [profile, q, lvl, win, only, sort]
  )

  return (
    <motion.div
      variants={prefersReduced ? undefined : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Discover scholarships
        </h1>
        <p className="mt-3 text-lg text-soft">
          Every scholarship shows how well you match and exactly what is missing.{' '}
          {!profile.level && (
            <a href="/onboarding" className="underline text-teal font-medium">
              Build your profile
            </a>
          )}
          {!profile.level && ' to see personalised scores.'}
        </p>
      </section>

      <section aria-labelledby="ls">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <h2 id="ls" className="mr-auto text-2xl font-bold">
            {rows.length} scholarship{rows.length === 1 ? '' : 's'}
          </h2>
          <div>
            <label htmlFor="q" className="sr-only">
              Search
            </label>
            <input
              id="q"
              className="field min-h-[40px]"
              placeholder="Search name or provider"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <SelectField
            id="fl"
            label="Level"
            srOnly
            value={lvl}
            onChange={e => setLvl(e.target.value)}
            options={LV}
            placeholder="All levels"
          />
          <div>
            <label htmlFor="fw" className="sr-only">
              Deadline
            </label>
            <select
              id="fw"
              className="field min-h-[40px]"
              value={win}
              onChange={e => setWin(Number(e.target.value))}
            >
              <option value={0}>Any deadline</option>
              <option value={14}>Within 14 days</option>
              <option value={30}>Within 30 days</option>
              <option value={90}>Within 90 days</option>
            </select>
          </div>
          <div>
            <label htmlFor="so" className="sr-only">
              Sort
            </label>
            <select
              id="so"
              className="field min-h-[40px]"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="match">Best match</option>
              <option value="deadline">Soonest deadline</option>
              <option value="amount">Highest amount</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium min-h-[40px] cursor-pointer">
            <input
              type="checkbox"
              checked={only}
              onChange={e => setOnly(e.target.checked)}
              className="h-4 w-4 accent-teal"
            />
            Strong matches only
          </label>
        </div>

        {!loaded ? (
          <div className="grid gap-4 md:grid-cols-2" aria-label="Loading scholarships">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : rows.length ? (
          <motion.div
            className="grid gap-4 md:grid-cols-2"
            variants={!hasStaggered && !prefersReduced ? staggerContainer : undefined}
            initial={!hasStaggered ? 'initial' : false}
            animate="animate"
          >
            {rows.map(({ s, m }) => (
              <Card
                key={s.id}
                s={s}
                score={m.score}
                onQuickView={setDrawerId}
                motionEnabled={!hasStaggered}
              />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-bold">No scholarships match these filters.</p>
            <p className="text-soft">
              Clear the search or turn off "Strong matches only".
            </p>
          </div>
        )}
      </section>

      <QuickViewDrawer schId={drawerId} onClose={() => setDrawerId(null)} />
    </motion.div>
  )
}
