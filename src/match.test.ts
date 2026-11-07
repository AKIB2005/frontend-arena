import { describe, expect, it } from 'vitest'
import { match, type Profile } from './match'
import { DATA } from './data'

const base: Profile = {
  name: '',
  level: 'Undergraduate',
  field: 'Science',
  cat: 'General',
  gender: 'm',
  state: 'Delhi',
  income: 300000,
  pct: 75,
}

describe('match', () => {
  it('skips unspecified criteria and excludes unknown values from the denominator', () => {
    const result = match(DATA[0], { ...base, pct: null })
    expect(result.known).toBe(2)
    expect(result.score).toBe(100)
  })
  it('handles income and percentage boundaries inclusively', () => {
    const result = match(DATA[0], { ...base, income: null, pct: 75 })
    expect(result.score).toBe(100)
    expect(match(DATA[0], { ...base, pct: 74 }).score).toBeLessThan(100)
  })
  it('checks women-only scholarships', () => {
    expect(
      match(DATA[1], { ...base, gender: 'f' }).checks.some(
        (c) => c.status === 'met',
      ),
    ).toBe(true)
    expect(
      match(DATA[1], { ...base, gender: 'm' }).checks.some(
        (c) => c.status === 'unmet',
      ),
    ).toBe(true)
  })
  it('marks a state mismatch as unmet', () => {
    const result = match(DATA[5], { ...base, cat: 'EWS', state: 'Delhi' })
    expect(
      result.checks.some(
        (c) => c.label.startsWith('State:') && c.status === 'unmet',
      ),
    ).toBe(true)
  })
})
