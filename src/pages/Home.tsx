import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { DATA } from '../data'
import { emptyProfile, match, money } from '../match'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Slider } from '../components/ui/Slider'
import { Sticker } from '../components/ui/Sticker'
import { RatchetRing } from '../components/RatchetRing'
import { DEMO_PROFILE, useApp } from '../store'
import { SPRING, useMotion } from '../lib/motion'

const DEMO_SAMPLES = DATA.slice(0, 5)
const STEPS = [
  {
    n: '1',
    title: 'Tell us about you',
    text: 'Four short steps. Skip anything you are not sure about.',
    r: -2,
  },
  {
    n: '2',
    title: 'See your match',
    text: 'Every scholarship shows what you meet, what you miss and what to do about it.',
    r: 1,
  },
  {
    n: '3',
    title: 'Track what is next',
    text: 'Documents, notes and deadlines in one place, with a calendar file.',
    r: -1,
  },
]

export default function Home() {
  const navigate = useNavigate()
  const setProfile = useApp((s) => s.setProfile)
  const [income, setIncome] = useState(350000)
  const [pct, setPct] = useState(72)
  const [minority, setMinority] = useState(true)
  const [woman, setWoman] = useState(false)
  const [touched, setTouched] = useState(false)
  const [paused, setPaused] = useState(false)
  const [deltas, setDeltas] = useState<Record<string, number>>({})
  const previous = useRef(new Map<string, number>())
  const { reduce } = useMotion()
  const profile = useMemo(
    () => ({
      ...emptyProfile,
      level: 'Undergraduate',
      field: 'Science',
      cat: minority ? 'Minority' : 'General',
      gender: woman ? ('f' as const) : ('' as const),
      income,
      pct,
    }),
    [income, pct, minority, woman],
  )
  const ranked = useMemo(
    () =>
      DEMO_SAMPLES.map((s) => ({ s, m: match(s, profile) })).sort(
        (a, b) => b.m.score - a.m.score,
      ),
    [profile],
  )
  const top = ranked[0]

  useEffect(() => {
    const next = Object.fromEntries(
      ranked.flatMap(({ s, m }) => {
        const old = previous.current.get(s.id)
        return old === undefined || old === m.score
          ? []
          : [[s.id, m.score - old]]
      }),
    )
    previous.current = new Map(ranked.map(({ s, m }) => [s.id, m.score]))
    if (Object.keys(next).length) {
      setDeltas(next)
      const timer = window.setTimeout(() => setDeltas({}), 700)
      return () => window.clearTimeout(timer)
    }
  }, [ranked])

  useEffect(() => {
    if (reduce || touched || paused) return
    const timer = window.setInterval(() => {
      setIncome((value) => (value >= 750000 ? 250000 : value + 100000))
    }, 2500)
    return () => window.clearInterval(timer)
  }, [reduce, touched, paused])

  const touch = () => setTouched(true)

  return (
    <>
      <section
        className="hero-grid grid items-start gap-10 border-y-2 border-edge px-1 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        aria-labelledby="hero"
      >
        <div>
          <Sticker tone="accent" rotate={-2} className="mb-5">
            Live match lab
          </Sticker>
          <h1
            id="hero"
            className="text-5xl font-extrabold leading-[1.05] sm:text-6xl"
          >
            See which scholarships you can actually win.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Tell us a little about you. Every scholarship shows how well you
            match and exactly what is missing, so you spend your time on the
            ones worth applying for.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink to="/onboarding" variant="primary">
              Build my profile
            </ButtonLink>
            <ButtonLink to="/discover" variant="ghost">
              Browse scholarships
            </ButtonLink>
            <button
              type="button"
              className="min-h-[44px] rounded-xl border-2 border-edge bg-accent px-5 font-bold text-inverse-text shadow-hard transition-[transform,opacity] can-hover:hover:-translate-x-0.5 can-hover:hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
              onClick={() => {
                setProfile(DEMO_PROFILE)
                navigate('/discover')
              }}
            >
              Try demo profile
            </button>
          </div>
        </div>

        <Card
          as="section"
          aria-labelledby="sample"
          className="relative overflow-hidden bg-paper"
        >
          <Sticker tone="accent" rotate={2} className="absolute right-4 top-4">
            Try it live
          </Sticker>
          <div className="max-w-xl">
            <h2 id="sample" className="text-2xl font-extrabold">
              Watch your shortlist re-rank
            </h2>
            <p className="mt-1 text-muted">
              Move one lever. Grantly recalculates the real eligibility checks
              instantly.
            </p>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.2fr)]">
            <div
              className="grid content-start gap-3"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <Slider
                label="Family income per year"
                value={income}
                min={100000}
                max={900000}
                step={10000}
                onChange={(v) => {
                  touch()
                  setIncome(v)
                }}
                display={money(income)}
              />
              <Slider
                label="Last exam percentage"
                value={pct}
                min={30}
                max={100}
                step={1}
                onChange={(v) => {
                  touch()
                  setPct(v)
                }}
                display={`${pct}%`}
              />
              <div className="flex flex-wrap gap-2" aria-label="Category">
                {['Minority', 'General'].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      touch()
                      setMinority(category === 'Minority')
                    }}
                    aria-pressed={minority === (category === 'Minority')}
                    className="min-h-[44px] rounded-xl border-2 border-edge bg-surface px-3 font-bold shadow-hard-sm aria-pressed:bg-accent aria-pressed:text-inverse-text"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="flex min-h-[44px] items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  className="h-6 w-6 shrink-0 accent-accent"
                  checked={woman}
                  onChange={(e) => {
                    touch()
                    setWoman(e.target.checked)
                  }}
                />
                Woman applicant
              </label>
              <p className="text-xs text-muted">
                {touched
                  ? 'Autoplay paused — you are in control.'
                  : 'Autoplay gently nudges income until you touch a control.'}
              </p>
            </div>
            <div>
              <p className="sr-only" aria-live="polite">
                {top.s.name} is now your best match at {top.m.score} percent.
              </p>
              <ul className="grid gap-3" aria-label="Live ranked scholarships">
                <AnimatePresence initial={false}>
                  {ranked.map(({ s, m }, index) => (
                    <motion.li
                      key={s.id}
                      layout
                      layoutId={`home-${s.id}`}
                      transition={reduce ? { duration: 0 } : SPRING.soft}
                      className="relative flex items-center gap-3 rounded-xl border-2 border-edge bg-surface p-3 shadow-hard-sm"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-edge bg-ink font-head font-extrabold text-inverse-text">
                        #{index + 1}
                      </span>
                      <RatchetRing value={m.score} size={58} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{s.name}</p>
                        <p className="text-sm text-muted">
                          {money(s.amount)} ·{' '}
                          {m.score >= 70
                            ? 'Strong'
                            : m.score >= 40
                              ? 'Partial'
                              : 'Weak'}{' '}
                          match
                        </p>
                      </div>
                      {index === 0 && (
                        <Sticker
                          tone="accent"
                          rotate={1}
                          className="hidden sm:inline-block"
                        >
                          Best match
                        </Sticker>
                      )}
                      {deltas[s.id] !== undefined && (
                        <motion.span
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-3 top-1 text-sm font-extrabold text-accent"
                        >
                          {deltas[s.id] > 0 ? '+' : ''}
                          {deltas[s.id]}
                        </motion.span>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section aria-labelledby="how" className="mt-20">
        <h2 id="how" className="mb-6 text-3xl font-extrabold">
          How Grantly helps
        </h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n}>
              <Card className="h-full">
                <Sticker tone="accent" rotate={s.r} className="mb-3">
                  Step {s.n}
                </Sticker>
                <h3 className="text-xl font-extrabold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
