import { describe, expect, it } from 'vitest'
import { daysUntil } from './dates'

describe('daysUntil', () => {
  it('uses local calendar days, including today and seven days away', () => {
    const now = new Date(2026, 10, 7, 23, 55)
    expect(daysUntil('2026-11-07', now)).toBe(0)
    expect(daysUntil('2026-11-08', now)).toBe(1)
    expect(daysUntil('2026-11-14', now)).toBe(7)
  })

  it('handles past deadlines without elapsed-time rounding surprises', () => {
    expect(daysUntil('2026-11-06', new Date(2026, 10, 7, 0, 1))).toBe(-1)
  })
})
