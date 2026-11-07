import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { DATA } from '../data'
import { match, money } from '../match'
import { useApp } from '../store'
import { Ring } from '../components/Ring'
import { Due } from '../components/Due'
import { showToast } from '../components/Toast'
import { pageVariants } from '../lib/motion'

const ICON = {
  met: ['✓', 'bg-teal text-white', 'Met'],
  unmet: ['✕', 'bg-rose text-white', 'Not met'],
  unknown: ['?', 'bg-sun text-ink', 'Add to your profile'],
} as const

export default function Detail() {
  const { id } = useParams()
  const s = DATA.find(x => x.id === id)
  const { profile, apps, add } = useApp()
  const prefersReduced = useReducedMotion()

  if (!s) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
        <p className="font-bold">Scholarship not found.</p>
        <p className="mt-1 text-soft">
          It may have been removed.{' '}
          <Link to="/discover" className="underline text-teal">
            Back to discover
          </Link>
        </p>
      </div>
    )
  }

  const m = match(s, profile)
  const saved = apps.some(a => a.id === s.id)

  const handleAdd = () => {
    add(s.id)
    showToast('Saved to your tracker')
  }

  return (
    <motion.article
      className="max-w-3xl"
      variants={prefersReduced ? undefined : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Link to="/discover" className="text-sm font-medium underline">
        Back to all scholarships
      </Link>

      <div className="mt-4 flex flex-col sm:flex-row items-start gap-5">
        <Ring v={m.score} size={96} animate />
        <div>
          <h1 className="text-3xl font-extrabold">{s.name}</h1>
          <p className="text-soft">{s.provider}</p>
          <p className="mt-2">
            <span className="font-head text-2xl font-bold">{money(s.amount)}</span>
            <span className="text-soft">
              {' '}
              · Deadline{' '}
              {new Date(s.deadline).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              ·{' '}
            </span>
            <Due d={s.deadline} />
          </p>
        </div>
      </div>

      <p className="mt-5">{s.desc}</p>

      <section className="mt-8" aria-labelledby="el">
        <h2 id="el" className="text-xl font-bold">
          Do you qualify?
        </h2>
        <p className="text-soft">
          {m.known
            ? `You meet ${m.met} of ${m.known} criteria we could check.`
            : 'Fill in your profile to see how you match.'}
        </p>
        <ul className="mt-3 space-y-2">
          {m.checks.map(c => {
            const [i, cls, t] = ICON[c.status]
            return (
              <li
                key={c.label}
                className="flex items-center gap-3 rounded-lg border border-line bg-white p-3"
              >
                <span
                  aria-hidden
                  className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${cls}`}
                >
                  {i}
                </span>
                <span className="flex-1">{c.label}</span>
                <span className="text-sm text-soft">{t}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="dc">
          <h2 id="dc" className="text-xl font-bold">
            Documents to keep ready
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {s.docs.map(d => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sp">
          <h2 id="sp" className="text-xl font-bold">
            How to apply
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {s.steps.map(d => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-8">
        {saved ? (
          <Link
            to="/tracker"
            className="inline-flex items-center rounded-full bg-sun px-6 py-3 font-bold min-h-[44px]"
          >
            Saved. Open my tracker
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            className="rounded-full bg-ink px-6 py-3 font-bold text-white min-h-[44px]"
          >
            Add to my tracker
          </button>
        )}
      </div>
    </motion.article>
  )
}
