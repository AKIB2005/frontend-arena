import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from 'framer-motion'
import { DATA } from '../data'
import { money, daysLeft } from '../match'
import { useApp, STATUSES, type Status } from '../store'
import { Due } from '../components/Due'
import { showToast } from '../components/Toast'
import { pageVariants } from '../lib/motion'

const LABEL: Record<Status, string> = {
  saved: 'Saved',
  applying: 'Applying',
  submitted: 'Submitted',
  result: 'Result',
}

/** Animated count-up for potential funding */
function CountUp({ target, duration = 800 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)
  const prefersReduced = useReducedMotion()
  const prevTarget = useRef(target)

  useEffect(() => {
    if (prefersReduced) {
      setValue(target)
      return
    }

    const start = prevTarget.current !== target ? prevTarget.current : 0
    prevTarget.current = target

    const startTime = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setValue(Math.round(start + (target - start) * eased))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, prefersReduced])

  return <>{money(value)}</>
}

export default function Tracker() {
  const { apps, move, remove, note, toggleDoc } = useApp()
  const prefersReduced = useReducedMotion()

  const items = useMemo(
    () => apps.map(a => ({ a, s: DATA.find(x => x.id === a.id)! })).filter(x => x.s),
    [apps]
  )
  const total = items.reduce((t, x) => t + x.s.amount, 0)
  const active = items.filter(x => x.a.status === 'applying').length
  const next = items
    .filter(x => x.a.status === 'saved' || x.a.status === 'applying')
    .sort((a, b) => a.s.deadline.localeCompare(b.s.deadline))
    .slice(0, 3)

  if (!items.length) {
    return (
      <motion.div
        className="rounded-xl border border-dashed border-line bg-white p-10 text-center"
        variants={prefersReduced ? undefined : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <h1 className="text-2xl font-bold">Your tracker is empty</h1>
        <p className="mt-1 text-soft">
          Save a scholarship and it will show up here with its documents and deadline.
        </p>
        <Link
          to="/discover"
          className="mt-4 inline-flex items-center rounded-full bg-ink px-5 py-2 font-medium text-white min-h-[44px]"
        >
          Find scholarships
        </Link>
      </motion.div>
    )
  }

  const handleMove = (id: string, name: string, status: Status) => {
    move(id, status)
    showToast(`Moved to ${LABEL[status]}`)
  }

  const handleRemove = (id: string, name: string) => {
    remove(id)
    showToast(`Removed ${name}`)
  }

  return (
    <motion.div
      variants={prefersReduced ? undefined : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1 className="text-3xl font-extrabold">My tracker</h1>

      <div className="my-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-ink p-5 text-white">
          <p className="text-sm text-white/70">Potential funding</p>
          <p className="font-head text-3xl font-bold">
            <CountUp target={total} />
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="text-sm text-soft">Applications in progress</p>
          <p className="font-head text-3xl font-bold">{active}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="text-sm text-soft">Closing next</p>
          {next.length ? (
            <ul className="mt-1 text-sm">
              {next.map(x => (
                <li key={x.s.id} className="flex justify-between gap-2">
                  <span className="truncate">{x.s.name}</span>
                  <Due d={x.s.deadline} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Nothing pending.</p>
          )}
        </div>
      </div>

      <LayoutGroup>
        <div className="grid gap-4 lg:grid-cols-4">
          {STATUSES.map((st, ci) => (
            <section
              key={st}
              aria-labelledby={`c-${st}`}
              className="rounded-xl bg-white/60 p-3"
            >
              <h2 id={`c-${st}`} className="mb-3 font-bold">
                {LABEL[st]}{' '}
                <span className="text-soft">
                  ({items.filter(x => x.a.status === st).length})
                </span>
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {items
                    .filter(x => x.a.status === st)
                    .map(({ a, s }) => (
                      <motion.div
                        key={s.id}
                        layout={!prefersReduced}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: prefersReduced ? 0 : 0.25 }}
                        className="rounded-lg border border-line bg-white p-3"
                      >
                        <Link
                          to={`/s/${s.id}`}
                          className="font-medium leading-snug hover:underline"
                        >
                          {s.name}
                        </Link>
                        <p className="text-sm">
                          <Due d={s.deadline} />
                        </p>
                        <fieldset className="mt-2">
                          <legend className="text-sm font-medium">Documents ready</legend>
                          {s.docs.map(d => (
                            <label
                              key={d}
                              className="flex items-center gap-2 text-sm min-h-[32px] cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="accent-teal h-4 w-4"
                                checked={a.docs.includes(d)}
                                onChange={() => toggleDoc(s.id, d)}
                              />
                              {d}
                            </label>
                          ))}
                        </fieldset>
                        <label
                          htmlFor={`n-${s.id}`}
                          className="mt-2 block text-sm font-medium"
                        >
                          Notes
                        </label>
                        <textarea
                          id={`n-${s.id}`}
                          rows={2}
                          className="field"
                          value={a.notes}
                          onChange={e => note(s.id, e.target.value)}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            disabled={ci === 0}
                            onClick={() => handleMove(s.id, s.name, STATUSES[ci - 1])}
                            aria-label={`Move ${s.name} to ${LABEL[STATUSES[ci - 1] ?? 'saved']}`}
                            className="rounded-full border border-line px-3 py-1.5 text-sm min-h-[36px] disabled:opacity-30 hover:bg-mist"
                          >
                            Back
                          </button>
                          <button
                            disabled={ci === 3}
                            onClick={() => handleMove(s.id, s.name, STATUSES[ci + 1])}
                            aria-label={`Move ${s.name} to ${LABEL[STATUSES[ci + 1] ?? 'result']}`}
                            className="rounded-full bg-ink px-3 py-1.5 text-sm text-white min-h-[36px] disabled:opacity-30 hover:bg-ink/90"
                          >
                            Next stage
                          </button>
                          <button
                            onClick={() => handleRemove(s.id, s.name)}
                            className="ml-auto text-sm text-rose underline min-h-[36px]"
                            aria-label={`Remove ${s.name}`}
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </section>
          ))}
        </div>
      </LayoutGroup>
    </motion.div>
  )
}
