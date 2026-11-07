import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { DATA } from '../data'
import { match, money } from '../match'
import { emptyProfile, type Profile } from '../match'
import { Ring } from '../components/Ring'
import { Due } from '../components/Due'
import { staggerContainer, cardVariants, pageVariants } from '../lib/motion'

/** A sample scholarship to demonstrate the match ring on the hero. */
const DEMO_SCH = DATA[0]

export default function Home() {
  const prefersReduced = useReducedMotion()

  // Interactive profile demo
  const [income, setIncome] = useState(400000)
  const [pct, setPct] = useState(72)
  const [isFemale, setIsFemale] = useState(false)

  const demoProfile: Profile = useMemo(
    () => ({
      ...emptyProfile,
      level: 'Undergraduate',
      field: 'Engineering',
      cat: '',
      gender: isFemale ? 'f' : '',
      state: '',
      income,
      pct,
    }),
    [income, pct, isFemale]
  )

  const demoMatch = useMemo(() => match(DEMO_SCH, demoProfile), [demoProfile])

  return (
    <motion.div
      variants={prefersReduced ? undefined : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero */}
      <section className="py-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              See which scholarships you can actually win.
            </h1>
            <p className="mt-4 text-lg text-soft max-w-xl">
              Answer a few questions, and we'll show your match score on every scholarship — so you spend time on applications you can win.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/onboarding"
                className="rounded-full bg-teal px-6 py-3 text-sm font-bold text-white hover:bg-teal/90 min-h-[44px] inline-flex items-center"
              >
                Build my profile
              </Link>
              <Link
                to="/discover"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium hover:bg-white min-h-[44px] inline-flex items-center"
              >
                Browse scholarships
              </Link>
            </div>
          </div>

          {/* Right: interactive demo */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-soft mb-4">
              Try it — adjust the sliders and watch the match update
            </p>

            <div className="flex gap-5 items-start">
              <Ring v={demoMatch.score} size={80} animate />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold leading-snug">{DEMO_SCH.name}</h3>
                <p className="text-sm text-soft">{DEMO_SCH.provider}</p>
                <p className="mt-1 text-sm">
                  <span className="font-head text-xl font-bold">{money(DEMO_SCH.amount)}</span>
                  <span className="text-soft"> · </span>
                  <Due d={DEMO_SCH.deadline} />
                </p>
              </div>
            </div>

            {/* Eligibility checklist ticking in */}
            <motion.ul
              className="mt-4 space-y-1.5"
              variants={prefersReduced ? undefined : staggerContainer}
              initial="initial"
              animate="animate"
            >
              {demoMatch.checks.map(c => {
                const icon =
                  c.status === 'met' ? '✓' : c.status === 'unmet' ? '✕' : '?'
                const cls =
                  c.status === 'met'
                    ? 'bg-teal text-white'
                    : c.status === 'unmet'
                    ? 'bg-rose text-white'
                    : 'bg-sun text-ink'
                return (
                  <motion.li
                    key={c.label}
                    className="flex items-center gap-2 text-sm"
                    variants={prefersReduced ? undefined : cardVariants}
                  >
                    <span
                      aria-hidden
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${cls}`}
                    >
                      {icon}
                    </span>
                    <span>{c.label}</span>
                  </motion.li>
                )
              })}
            </motion.ul>

            {/* Interactive controls */}
            <div className="mt-5 space-y-3 border-t border-line pt-4">
              <div>
                <label htmlFor="demo-income" className="flex justify-between text-sm font-medium">
                  <span>Family income</span>
                  <span className="tabular-nums text-soft">₹{income.toLocaleString('en-IN')}/yr</span>
                </label>
                <input
                  id="demo-income"
                  type="range"
                  min={100000}
                  max={1000000}
                  step={50000}
                  value={income}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="mt-1 w-full accent-teal h-2"
                />
              </div>
              <div>
                <label htmlFor="demo-pct" className="flex justify-between text-sm font-medium">
                  <span>Last exam percentage</span>
                  <span className="tabular-nums text-soft">{pct}%</span>
                </label>
                <input
                  id="demo-pct"
                  type="range"
                  min={30}
                  max={100}
                  step={1}
                  value={pct}
                  onChange={e => setPct(Number(e.target.value))}
                  className="mt-1 w-full accent-teal h-2"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFemale}
                  onChange={e => setIsFemale(e.target.checked)}
                  className="h-4 w-4 accent-teal rounded"
                />
                I am a woman applicant
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-8 border-t border-line">
        <div className="grid gap-6 sm:grid-cols-3 text-center">
          <div>
            <p className="font-head text-3xl font-bold text-teal">{DATA.length}</p>
            <p className="text-sm text-soft mt-1">Scholarships in our database</p>
          </div>
          <div>
            <p className="font-head text-3xl font-bold text-teal">
              {money(DATA.reduce((t, s) => t + s.amount, 0))}
            </p>
            <p className="text-sm text-soft mt-1">Total funding available</p>
          </div>
          <div>
            <p className="font-head text-3xl font-bold text-teal">2 min</p>
            <p className="text-sm text-soft mt-1">To build your profile</p>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
