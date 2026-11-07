import type { Check } from '../match'

export type CoachPlan = {
  summary: string
  missing: string[]
}

export function coachPlan(checks: Check[]): CoachPlan {
  const missing = checks
    .filter((check) => check.status !== 'met')
    .map((check) => check.label)
  if (!missing.length) {
    return {
      summary:
        'You meet every criterion we could check. You are ready to apply.',
      missing,
    }
  }
  const step = missing.length === 1 ? 'step' : 'steps'
  return {
    summary: `You are ${missing.length} ${step} away from meeting every check we can make.`,
    missing,
  }
}
