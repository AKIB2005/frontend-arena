import { daysLeft } from '../match'

export function Due({ d }: { d: string }) {
  const n = daysLeft(d)
  return (
    <span className={n <= 14 ? 'font-medium text-rose' : 'text-soft'}>
      {n < 0 ? 'Closed' : n === 0 ? 'Closes today' : `${n} day${n === 1 ? '' : 's'} left`}
    </span>
  )
}
