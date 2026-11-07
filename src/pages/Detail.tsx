import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DATA } from '../data'
import { match, money } from '../match'
import { useApp } from '../store'
import { fixHint } from '../lib/hints'
import { useActions } from '../lib/actions'
import { CheckRow } from '../components/CheckRow'
import { Due } from '../components/Due'
import { RatchetRing } from '../components/RatchetRing'
import { Stamp } from '../components/Stamp'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Slider } from '../components/ui/Slider'
import { Sticker } from '../components/ui/Sticker'
import { coachPlan } from '../lib/coach'

const WORD = { met: 'Met', unmet: 'Not met', unknown: 'Not checked' } as const

export default function Detail() {
  const { id } = useParams()
  const s = DATA.find((x) => x.id === id)
  const { profile, apps } = useApp()
  const { save } = useActions()
  const [what, setWhat] = useState<{
    income: number | null
    pct: number | null
  }>({ income: profile.income, pct: profile.pct })
  if (!s)
    return (
      <Card>
        <h1 className="text-2xl font-extrabold">Scholarship not found</h1>
        <ButtonLink to="/discover" className="mt-4">
          Back to scholarships
        </ButtonLink>
      </Card>
    )

  const m = match(s, profile)
  const saved = apps.some((a) => a.id === s.id)
  const scenario = match(s, { ...profile, income: what.income, pct: what.pct })
  const delta = scenario.score - m.score
  const changed = scenario.checks.filter(
    (c, i) => c.status !== m.checks[i].status,
  )
  const incMax = Math.max(1500000, (s.maxIncome ?? 0) * 2)
  const hasLevers = !!s.maxIncome || !!s.minPct
  const dirty = what.income !== profile.income || what.pct !== profile.pct
  const coach = coachPlan(m.checks)

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/discover"
        className="inline-flex min-h-[44px] items-center font-bold underline underline-offset-2"
      >
        Back to all scholarships
      </Link>

      <Card className="relative mt-2">
        <Stamp id={s.id} />
        <div className="flex flex-wrap items-start gap-5">
          <RatchetRing value={m.score} size={104} />
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {s.name}
            </h1>
            <p className="text-muted">{s.provider}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-head text-2xl font-extrabold">
                {money(s.amount)}
              </span>
              <span className="text-muted">
                Closes{' '}
                {new Date(s.deadline).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <Due d={s.deadline} />
            </p>
          </div>
        </div>
        <p className="mt-4">{s.desc}</p>
        <div className="mt-5">
          {saved ? (
            <ButtonLink to="/tracker" variant="ghost">
              Open my tracker
            </ButtonLink>
          ) : (
            <Button onClick={() => save(s)}>Add to my tracker</Button>
          )}
        </div>
      </Card>

      <section className="mt-10" aria-labelledby="el">
        <h2 id="el" className="text-2xl font-extrabold">
          Do you qualify?
        </h2>
        <p className="mb-3 text-muted">
          {m.known
            ? `You meet ${m.met} of ${m.known} criteria we could check.`
            : 'Fill in your profile to see how you match.'}
        </p>
        <ul className="space-y-3">
          {m.checks.map((c) => (
            <CheckRow
              key={c.label}
              check={c}
              hint={
                c.status === 'unmet'
                  ? `How to fix: ${fixHint(s, c)}`
                  : c.status === 'unknown'
                    ? 'Add this to your profile to check it.'
                    : undefined
              }
            />
          ))}
        </ul>
        {m.checks.some((c) => c.status === 'unknown') && (
          <ButtonLink to="/profile" variant="ghost" size="sm" className="mt-3">
            Update my profile
          </ButtonLink>
        )}
      </section>

      <Card as="section" aria-labelledby="coach" className="fold-in mt-10">
        <Sticker tone="accent" rotate={-2} className="mb-3">
          Coach notes
        </Sticker>
        <h2 id="coach" className="text-2xl font-extrabold">
          Your next best move
        </h2>
        <p className="mt-2 max-w-[65ch]">{coach.summary}</p>
        {coach.missing.length > 0 && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            {coach.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {coach.missing.length > 0 && (
          <ButtonLink to="/profile" variant="ghost" size="sm" className="mt-4">
            Update my profile
          </ButtonLink>
        )}
      </Card>

      <Card as="section" aria-labelledby="what" className="mt-10">
        <Sticker tone="accent" rotate={2} className="mb-3">
          Just exploring
        </Sticker>
        <h2 id="what" className="text-2xl font-extrabold">
          What would change my score?
        </h2>
        <p className="mb-4 text-muted">
          Try different numbers. Your saved profile stays exactly as it is.
        </p>
        {hasLevers ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {s.maxIncome ? (
              <Slider
                label="Family income per year"
                value={what.income ?? s.maxIncome}
                min={0}
                max={incMax}
                step={10000}
                onChange={(v) => setWhat((w) => ({ ...w, income: v }))}
                display={what.income === null ? 'Not set' : money(what.income)}
                hint={`Limit is ${money(s.maxIncome)}`}
              />
            ) : null}
            {s.minPct ? (
              <Slider
                label="Last exam percentage"
                value={what.pct ?? s.minPct}
                min={0}
                max={100}
                step={1}
                onChange={(v) => setWhat((w) => ({ ...w, pct: v }))}
                display={what.pct === null ? 'Not set' : `${what.pct}%`}
                hint={`Minimum is ${s.minPct}%`}
              />
            ) : null}
          </div>
        ) : (
          <p>
            This scholarship does not depend on income or marks, so there is
            nothing to slide here.
          </p>
        )}
        {hasLevers && (
          <div
            className="mt-4 flex flex-wrap items-center gap-4 border-t-2 border-dashed border-edge pt-4"
            role="status"
          >
            <RatchetRing value={scenario.score} size={72} />
            <div className="min-w-0 flex-1">
              <p className="font-bold">
                With these numbers: {scenario.score}% match
                {dirty && delta !== 0
                  ? ` (${delta > 0 ? '+' : ''}${delta} from now)`
                  : ''}
              </p>
              {changed.length > 0 ? (
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {changed.map((c) => (
                    <li key={c.label}>
                      {c.label}:{' '}
                      {WORD[m.checks[scenario.checks.indexOf(c)].status]} to{' '}
                      {WORD[c.status]}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">
                  No checks change yet. Try moving a slider.
                </p>
              )}
            </div>
            {dirty && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setWhat({ income: profile.income, pct: profile.pct })
                }
              >
                Reset to my profile
              </Button>
            )}
          </div>
        )}
      </Card>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="dc">
          <h2 id="dc" className="text-2xl font-extrabold">
            Documents to keep ready
          </h2>
          <ul className="mt-3 space-y-2">
            {s.docs.map((d) => (
              <li
                key={d}
                className="rounded-xl border-2 border-edge bg-surface p-3 font-medium"
              >
                {d}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sp">
          <h2 id="sp" className="text-2xl font-extrabold">
            How to apply
          </h2>
          <ol className="relative mt-3 ml-4 space-y-4 border-l-2 border-edge pl-8">
            {s.steps.map((st, i) => (
              <li key={st} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[3.15rem] top-0 grid h-9 w-9 place-items-center rounded-lg border-2 border-edge bg-accent font-head font-extrabold text-on-accent"
                >
                  {i + 1}
                </span>
                <span className="block pt-1">{st}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}
