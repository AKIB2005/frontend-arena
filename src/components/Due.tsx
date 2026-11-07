import { daysLeft } from '../match'

export const isUrgent = (d: string) => {
  const n = daysLeft(d)
  return n >= 0 && n <= 7
}

/** Deadline text. Within 7 days it becomes a ticket-stub badge with a slow stepped pulse. */
export function Due({ d }: { d: string }) {
  const n = daysLeft(d)
  const text =
    n < 0
      ? 'Closed'
      : n === 0
        ? 'Closes today'
        : `${n} day${n === 1 ? '' : 's'} left`
  if (n < 0) return <span className="text-muted">{text}</span>
  const exact = new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
  if (n <= 7)
    return (
      <span
        tabIndex={0}
        aria-label={`${text}; deadline ${exact}`}
        className="ticket group/due relative inline-block [perspective:400px]"
      >
        <span className="block rounded-lg border-2 border-edge bg-accent px-2 py-0.5 text-sm font-bold text-inverse-text transition-[transform,opacity] duration-200 can-hover:group-hover/due:[transform:rotateX(180deg)] focus:[transform:rotateX(180deg)]">
          ◷ {text}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg border-2 border-edge bg-accent px-2 py-0.5 text-center text-sm font-bold text-inverse-text opacity-0 transition-[transform,opacity] duration-200 can-hover:group-hover/due:opacity-100 group-focus/due:opacity-100"
        >
          {exact}
        </span>
      </span>
    )
  return (
    <span className={n <= 14 ? 'font-bold text-accent' : 'text-muted'}>
      {text}
    </span>
  )
}
