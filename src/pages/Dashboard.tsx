import { Link } from 'react-router-dom'
import { DATA } from '../data'
import { daysLeft, money } from '../match'
import { useMatches } from '../lib/matches'
import { useApp } from '../store'
import { SegmentedMeter } from '../components/SegmentedMeter'
import { Due } from '../components/Due'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function Dashboard() {
  const profile = useApp((s) => s.profile)
  const apps = useApp((s) => s.apps)
  const matches = useMatches()
  const recommended = DATA.map((s) => ({ s, m: matches.get(s.id)! }))
    .sort((a, b) => b.m.score - a.m.score)
    .slice(0, 4)
  const tracked = new Set(apps.map((a) => a.id))
  const closing = DATA.filter(
    (s) => !tracked.has(s.id) && daysLeft(s.deadline) >= 0,
  )
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3)
  const profileFields = [
    profile.level,
    profile.field,
    profile.cat,
    profile.gender,
    profile.state,
    profile.income,
    profile.pct,
  ]
  const filled = profileFields.filter(
    (value) => value !== '' && value !== null,
  ).length
  const actions = [
    closing[0] ? `Review ${closing[0].name}` : 'Browse new scholarships',
    apps.length
      ? 'Check your missing documents'
      : 'Save your first scholarship',
    recommended[0]
      ? `Explore ${recommended[0].s.name}`
      : 'Complete your profile',
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
            Your command centre
          </p>
          <h1 className="text-4xl font-extrabold">
            Good to see you
            {profile.name ? `, ${profile.name.split(' ')[0]}` : ''}.
          </h1>
        </div>
        <ButtonLink to="/discover" variant="primary">
          Find more matches
        </ButtonLink>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        <Card
          as="section"
          aria-labelledby="today"
          className="lg:col-span-7 bg-ink text-inverse-text"
        >
          <h2 id="today" className="text-2xl font-extrabold">
            Today
          </h2>
          <ol className="mt-4 grid gap-3">
            {actions.map((action, index) => (
              <li
                key={action}
                className="flex items-center gap-3 border-b-2 border-inverse-text/30 pb-3 last:border-0 last:pb-0"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-inverse-text font-head font-extrabold">
                  {index + 1}
                </span>
                <span className="font-bold">{action}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card as="section" aria-labelledby="profile" className="lg:col-span-5">
          <h2 id="profile" className="text-xl font-extrabold">
            Profile completeness
          </h2>
          <SegmentedMeter
            value={filled}
            max={profileFields.length}
            segments={7}
            className="my-4"
            label={`${filled} of 7 profile details added`}
          />
          <p className="font-bold">{filled} of 7 details added</p>
          <p className="mt-2 text-sm text-muted">
            {Math.max(0, 7 - filled)} more details unlock sharper matches.
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-flex min-h-[44px] items-center font-bold underline underline-offset-2"
          >
            Update profile
          </Link>
        </Card>
        <Card as="section" aria-labelledby="pipeline" className="lg:col-span-4">
          <h2 id="pipeline" className="text-xl font-extrabold">
            Pipeline
          </h2>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {(['saved', 'applying', 'submitted', 'result'] as const).map(
              (status) => (
                <div key={status} className="text-center">
                  <div className="grid h-16 place-items-center rounded-lg border-2 border-edge bg-paper font-head text-2xl font-extrabold">
                    {apps.filter((a) => a.status === status).length}
                  </div>
                  <p className="mt-1 text-xs font-bold capitalize">{status}</p>
                </div>
              ),
            )}
          </div>
        </Card>
        <Card as="section" aria-labelledby="deadline" className="lg:col-span-8">
          <h2 id="deadline" className="text-xl font-extrabold">
            Next 30 days
          </h2>
          <div className="mt-4 flex h-10 gap-1" aria-hidden="true">
            {Array.from({ length: 30 }, (_, index) => (
              <span
                key={index}
                className={`flex-1 border-2 border-edge ${DATA.some((s) => daysLeft(s.deadline) === index) ? 'bg-accent' : 'bg-paper'}`}
              />
            ))}
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {closing.map((s) => (
              <li key={s.id} className="text-sm">
                <Link
                  to={`/s/${s.id}`}
                  className="font-bold underline underline-offset-2"
                >
                  {s.name}
                </Link>
                <span className="ml-2">
                  <Due d={s.deadline} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card
          as="section"
          aria-labelledby="recommended"
          className="lg:col-span-8"
        >
          <h2 id="recommended" className="text-xl font-extrabold">
            Recommended for you
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommended.map(({ s, m }) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border-2 border-edge bg-paper p-3"
              >
                <div className="min-w-0">
                  <Link
                    to={`/s/${s.id}`}
                    className="font-bold underline-offset-2 can-hover:hover:underline focus-visible:underline"
                  >
                    {s.name}
                  </Link>
                  <p className="text-sm text-muted">{money(s.amount)}</p>
                </div>
                <span className="shrink-0 rounded-lg border-2 border-edge bg-accent px-2 py-1 font-head font-extrabold text-on-accent">
                  {m.score}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card as="section" aria-labelledby="funding" className="lg:col-span-4">
          <h2 id="funding" className="text-xl font-extrabold">
            Funding in play
          </h2>
          <p className="mt-3 font-head text-4xl font-extrabold">
            {money(
              apps.reduce(
                (sum, app) =>
                  sum + (DATA.find((s) => s.id === app.id)?.amount ?? 0),
                0,
              ),
            )}
          </p>
          <p className="mt-1 text-sm text-muted">
            Across {apps.length} tracked scholarship
            {apps.length === 1 ? '' : 's'}.
          </p>
        </Card>
      </div>
    </div>
  )
}
