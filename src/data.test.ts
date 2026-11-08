import { describe, expect, it } from 'vitest'
import { SAMPLE } from './data.sample'
import { match, type Profile } from './match'

const profile = (overrides: Partial<Profile> = {}): Profile => ({
  name: '',
  level: 'Undergraduate',
  field: 'Engineering',
  cat: 'General',
  gender: 'm',
  state: 'Maharashtra',
  income: 200000,
  pct: 85,
  ...overrides,
})

describe('current supplied scholarship records', () => {
  it('keeps the first five records eligible for a matching profile', () => {
    for (const scholarship of SAMPLE.slice(0, 5)) {
      const result = match(scholarship, profile())
      expect(result.checks.some((check) => check.status === 'met')).toBe(true)
    }
  })

  it('marks an income-only failure as unmet', () => {
    const result = match(SAMPLE[2], profile({ income: 400000 }))
    expect(result.checks).toContainEqual(
      expect.objectContaining({ status: 'unmet' }),
    )
  })

  it('marks a percentage failure as unmet', () => {
    const result = match(SAMPLE[0], profile({ pct: 50 }))
    expect(result.checks).toContainEqual(
      expect.objectContaining({ status: 'unmet' }),
    )
  })

  it('keeps a mostly unknown profile unknown', () => {
    const result = match(SAMPLE[0], profile({
      level: '',
      field: '',
      gender: '',
      state: '',
      income: null,
      pct: null,
    }))
    expect(result.checks.every((check) => check.status === 'unknown')).toBe(true)
    expect(result.score).toBe(0)
  })
})
