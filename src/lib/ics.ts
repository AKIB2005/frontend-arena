import type {Sch} from '../data'

const pad = (n: number) => String(n).padStart(2, '0')
const ymd = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

/** RFC 5545 asks for lines of at most 75 octets; fold longer ones. */
function fold(line: string): string {
  const out: string[] = []
  let rest = line
  while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = ' ' + rest.slice(74) }
  out.push(rest)
  return out.join('\r\n')
}

export function buildIcs(items: Sch[], now = new Date()): string {
  const stamp = `${ymd(now)}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Grantly//Scholarship deadlines//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH']
  for (const s of items.filter((item) => item.deadline)) {
    const start = new Date(`${s.deadline}T00:00:00Z`)
    const end = new Date(start.getTime() + 864e5)
    lines.push(
      'BEGIN:VEVENT',
      `UID:grantly-${s.id}-${s.deadline}@grantly.app`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(start)}`,
      `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${esc(`Deadline: ${s.name}`)}`,
      `DESCRIPTION:${esc(`${s.provider}. Documents: ${s.docs.join(', ')}.`)}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`${s.name} closes in 3 days`)}`, 'TRIGGER:-P3D', 'END:VALARM',
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}

export function downloadIcs(items: Sch[]): void {
  const blob = new Blob([buildIcs(items)], {type: 'text/calendar;charset=utf-8'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'grantly-deadlines.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
