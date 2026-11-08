import { DATA } from '../data'
import { match, money } from '../match'
import { useApp } from '../store'
import { useUI } from '../lib/ui-store'
import { CheckRow } from '../components/CheckRow'
import { Due } from '../components/Due'
import { RatchetRing } from '../components/RatchetRing'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Sticker } from '../components/ui/Sticker'

export default function Compare() {
  const profile = useApp((s) => s.profile)
  const { compare, toggleCompare, clearCompare } = useUI()
  const cols = compare
    .map((id) => DATA.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map((s) => ({ s, m: match(s, profile) }))

  if (cols.length < 2)
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-extrabold">
          Pick at least two to compare
        </h1>
        <p className="mb-5 mt-2 text-muted">
          Tick “Compare” on up to three scholarships in Discover and they will
          line up here.
        </p>
        <ButtonLink to="/discover">Back to scholarships</ButtonLink>
      </Card>
    )

  const bestAmount = Math.max(...cols.map((c) => c.s.amount))
  const bestDate = cols.map((c) => c.s.deadline).sort()[0]
  const bestScore = Math.max(...cols.map((c) => c.m.score))

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold">Compare scholarships</h1>
          <p className="text-muted">
            Stickers mark the best value in each row.
          </p>
        </div>
        <div className="flex gap-3">
          <ButtonLink to="/discover" variant="ghost" size="sm">
            Add or change
          </ButtonLink>
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Clear all
          </Button>
        </div>
      </div>
      <ul
        className={
          cols.length === 3
            ? 'grid gap-5 lg:grid-cols-3'
            : 'grid gap-5 md:grid-cols-2'
        }
      >
        {cols.map(({ s, m }) => (
          <li key={s.id}>
            <Card as="article" className="flex h-full flex-col gap-5">
              <div>
                <h2 className="text-xl font-extrabold leading-snug">
                  {s.name}
                </h2>
                <p className="text-sm text-muted">{s.provider}</p>
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted">Amount</dt>
                  <dd className="flex flex-wrap items-center gap-2 font-head text-2xl font-extrabold">
                    {money(s.amount)}
                    {s.amount === bestAmount && (
                      <Sticker tone="accent" rotate={-2}>
                        Highest
                      </Sticker>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Deadline</dt>
                  <dd className="flex flex-wrap items-center gap-2 font-bold">
                    {new Date(s.deadline).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    <Due d={s.deadline} />
                    {s.deadline === bestDate && (
                      <Sticker tone="accent" rotate={2}>
                        Most time
                      </Sticker>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-sm text-muted">Your match</dt>
                  <dd className="flex flex-wrap items-center gap-3">
                    <RatchetRing value={m.score} size={72} />
                    {m.score === bestScore && m.score > 0 && (
                      <Sticker tone="accent" rotate={1}>
                        Best match
                      </Sticker>
                    )}
                  </dd>
                </div>
              </dl>
              <section aria-label={`Criteria for ${s.name}`}>
                <h3 className="mb-2 font-extrabold">Criteria</h3>
                <ul className="space-y-2">
                  {m.checks.map((c) => (
                    <CheckRow key={c.label} check={c} compact />
                  ))}
                </ul>
              </section>
              <section aria-label={`Documents for ${s.name}`}>
                <h3 className="mb-2 font-extrabold">Documents</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {s.docs.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </section>
              <div className="mt-auto flex flex-wrap gap-2">
                <ButtonLink to={`/s/${s.id}`} size="sm" variant="ghost">
                  Open details<span className="sr-only">: {s.name}</span>
                </ButtonLink>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleCompare(s.id)}
                >
                  Remove
                  <span className="sr-only"> {s.name} from comparison</span>
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
