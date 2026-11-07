import type { Check } from '../match'

export function criteriaDots(checks: Check[]) {
  return checks.map((check) => check.status)
}
