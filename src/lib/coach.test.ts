import { describe, expect, it } from 'vitest'
import { coachPlan } from './coach'

describe('coachPlan', () => {
  it('turns unmet and unknown checks into actionable missing items', () => {
    const plan = coachPlan([
      { label: 'Income', status: 'met' },
      { label: 'Certificate', status: 'unmet' },
      { label: 'State', status: 'unknown' },
    ])
    expect(plan.summary).toContain('2 steps')
    expect(plan.missing).toEqual(['Certificate', 'State'])
  })

  it('celebrates a complete match without missing items', () => {
    expect(coachPlan([{ label: 'Income', status: 'met' }])).toEqual({
      summary:
        'You meet every criterion we could check. You are ready to apply.',
      missing: [],
    })
  })
})
