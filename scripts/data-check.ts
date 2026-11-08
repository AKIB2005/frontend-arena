import { REAL, ALLOWED_CATEGORIES, ALLOWED_FIELDS, ALLOWED_LEVELS, ALLOWED_STATES } from '../src/data.real.ts'
import { SAMPLE } from '../src/data.sample.ts'
const DATA = [...REAL, ...SAMPLE]

const errors: string[] = []
const ids = new Set<string>()
const iso = /^\d{4}-\d{2}-\d{2}$/
const allowed = (values: string[], list: readonly string[], label: string, id: string) => {
  for (const value of values) if (!list.includes(value)) errors.push(`${id}: unknown ${label} "${value}"`)
}
for (const s of DATA) {
  if (ids.has(s.id)) errors.push(`duplicate id: ${s.id}`)
  ids.add(s.id)
  if (!s.name.trim() || !s.desc.trim()) errors.push(`${s.id}: empty name or description`)
  if (!Number.isFinite(s.amount) || s.amount <= 0 || s.amount > 100_000_000) errors.push(`${s.id}: invalid amount`)
  if (s.minPct !== undefined && (s.minPct < 0 || s.minPct > 100)) errors.push(`${s.id}: invalid percentage`)
  if (s.maxIncome !== undefined && s.maxIncome <= 0) errors.push(`${s.id}: invalid income`)
  if (s.deadline !== null && (!iso.test(s.deadline) || Number.isNaN(Date.parse(`${s.deadline}T00:00:00Z`)))) errors.push(`${s.id}: invalid ISO deadline`)
  allowed(s.levels, ALLOWED_LEVELS, 'level', s.id)
  allowed(s.fields, ALLOWED_FIELDS, 'field', s.id)
  allowed(s.cats, ALLOWED_CATEGORIES, 'category', s.id)
  allowed(s.states, ALLOWED_STATES.concat(['All']), 'state', s.id)
}
for (const s of REAL) {
  if (!s.sourceUrl || !s.sourceUrl.startsWith('https://')) errors.push(`${s.id}: real record requires an https sourceUrl`)
  if (!s.lastVerified || !iso.test(s.lastVerified) || Number.isNaN(Date.parse(`${s.lastVerified}T00:00:00Z`))) errors.push(`${s.id}: real record requires an ISO lastVerified date`)
  if (s.isSample) errors.push(`${s.id}: real record cannot be marked sample`)
}
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'))
  process.exitCode = 1
} else {
  console.log(`Data check passed: ${DATA.length} records (${REAL.length} real, ${DATA.length - REAL.length} sample).`)
}
