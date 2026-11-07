import {DATA} from '../data'
import {useUI} from '../lib/ui-store'
import {Button, ButtonLink} from './ui/Button'

/** Sticky bar shown while something is picked for comparison. */
export function CompareBar() {
  const {compare, clearCompare, toggleCompare} = useUI()
  if (!compare.length) return null
  const names = compare.map(id => DATA.find(s => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s)
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-edge bg-accent px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-inverse-text">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <p className="mr-auto text-sm font-bold">{compare.length} of 3 chosen to compare</p>
        <ul className="flex flex-wrap gap-2">
          {names.map(s => (
            <li key={s.id}>
              <button type="button" onClick={() => toggleCompare(s.id)} className="min-h-[44px] max-w-[10rem] truncate rounded-xl border-2 border-ink bg-white px-3 text-sm font-bold text-ink" aria-label={`Remove ${s.name} from comparison`}>
                {s.name} <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" onClick={clearCompare} className="border-ink !bg-white !text-ink">Clear</Button>
        {compare.length >= 2
          ? <ButtonLink to="/compare" variant="ink" size="sm" className="!border-ink !bg-ink !text-inverse-text">Compare {compare.length} scholarships</ButtonLink>
          : <p className="text-sm font-bold">Pick one more to compare.</p>}
      </div>
    </div>
  )
}
