import { daysUntil } from '../lib/dates'

export const isUrgent = (d: string | null) => {
  const n = daysUntil(d)
  return n >= 0 && n <= 7
}

/**
 * Deadline text. Within 7 days it becomes a ticket-stub badge; on hover (mouse only)
 * it crossfades to the exact date. The exact date is always available to screen
 * readers through the visually hidden text, so no extra tab stop or aria-label is needed.
 */
export function Due({ d }: { d: string | null }) {
  const n = daysUntil(d)
  if (!d) return <span className="text-muted">Rolling or no deadline stated</span>
  const text =
    n < 0
      ? 'Closed'
      : n === 0
        ? 'Closes today'
        : `${n} day${n === 1 ? '' : 's'} left`
  if (n < 0)
    return (
      <span className="rounded-lg border-2 border-edge bg-paper px-2 py-0.5 text-sm font-bold text-fg">
        {text}
      </span>
    )
  const exact = new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
  if (n <= 7)
    return (
      <span className="ticket group/due relative inline-block">
        <span className="block rounded-lg border-2 border-edge bg-accent px-2 py-0.5 text-sm font-bold text-on-accent transition-opacity duration-200 can-hover:group-hover/due:opacity-0">
          <span aria-hidden="true">◷ </span>
          {text}
          <span className="sr-only">; deadline {exact}</span>
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-items-center rounded-lg border-2 border-edge bg-accent px-2 py-0.5 text-sm font-bold text-on-accent opacity-0 transition-opacity duration-200 can-hover:group-hover/due:opacity-100"
        >
          {exact}
        </span>
      </span>
    )
  return (
    <span
      className={
        n <= 14
          ? 'font-bold text-[color:var(--accent-text)]'
          : 'text-muted'
      }
    >
      {text}
    </span>
  )
}