const DAY = 86_400_000

function localMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function daysUntil(deadline: string | null, now = new Date()): number {
  if (!deadline) return Number.POSITIVE_INFINITY
  const [year, month, day] = deadline.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  return Math.round((localMidnight(target) - localMidnight(now)) / DAY)
}

export function isClosed(deadline: string | null, now = new Date()): boolean {
  return daysUntil(deadline, now) < 0
}
