import {DATA, type Sch} from '../data'
import {match, money, type Check, type Profile} from '../match'

export type FieldKey = 'level' | 'field' | 'cat' | 'gender' | 'state' | 'income' | 'pct'
export const FIELD_KEYS: FieldKey[] = ['level', 'field', 'cat', 'state', 'gender', 'income', 'pct']

const ADD: Record<FieldKey, string> = {
  level: 'your study level',
  field: 'your field of study',
  cat: 'your category',
  gender: 'your gender',
  state: 'your state',
  income: 'your family income',
  pct: 'your percentage',
}

/** Maps a check label from match() back to the profile field it depends on. */
export function checkKey(label: string): FieldKey {
  if (label.startsWith('Study level')) return 'level'
  if (label.startsWith('Field')) return 'field'
  if (label.startsWith('Category')) return 'cat'
  if (label.startsWith('Open to women')) return 'gender'
  if (label.startsWith('Family income')) return 'income'
  if (label.startsWith('At least')) return 'pct'
  return 'state'
}

export function isFilled(p: Profile, k: FieldKey): boolean {
  const v = p[k]
  return v !== '' && v !== null
}

/** Profile completeness: gender counts as filled once chosen, "prefer not to say" stays open. */
export function completeness(p: Profile) {
  const missing = FIELD_KEYS.filter(k => !isFilled(p, k))
  return {filled: FIELD_KEYS.length - missing.length, total: FIELD_KEYS.length, missing}
}

/** For each profile field, how many scholarships have a check we cannot run without it. */
export function unknownCounts(p: Profile): Record<FieldKey, number> {
  const out: Record<FieldKey, number> = {level: 0, field: 0, cat: 0, gender: 0, state: 0, income: 0, pct: 0}
  for (const s of DATA) for (const c of match(s, p).checks) if (c.status === 'unknown') out[checkKey(c.label)]++
  return out
}

export function profileHints(p: Profile) {
  const counts = unknownCounts(p)
  return FIELD_KEYS.filter(k => counts[k] > 0)
    .map(k => ({key: k, count: counts[k], text: `Add ${ADD[k]} to check ${counts[k]} more scholarship${counts[k] === 1 ? '' : 's'}`}))
    .sort((a, b) => b.count - a.count)
}

/** Plain-language "how to fix" for an unmet check. */
export function fixHint(s: Sch, c: Check): string {
  switch (checkKey(c.label)) {
    case 'income':
      return `Get an income certificate. If your family income is above ${money(s.maxIncome ?? 0)}, look at scholarships with a higher limit.`
    case 'pct':
      return `You need ${s.minPct}% or more. Ask about re-evaluation, or look at scholarships with a lower cut-off.`
    case 'cat':
      return `This needs a ${s.cats.join(' or ')} category certificate. If you hold one, update your profile.`
    case 'state':
      return `This is for residents of ${s.states.join(', ')}. A domicile certificate is usually required.`
    case 'level':
      return `This is for ${s.levels.join(' or ')} students. Look at scholarships for your level.`
    case 'field':
      return `This is for ${s.fields.join(' or ')} students. Look at scholarships in your field.`
    default:
      return 'This scholarship is only open to women applicants.'
  }
}
