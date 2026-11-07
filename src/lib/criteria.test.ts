import { describe, expect, it } from 'vitest'
import { criteriaDots } from './criteria'

describe('criteriaDots', () => {
  it('preserves met, unmet, and unknown states for visual fallbacks', () => {
    expect(
      criteriaDots([
        { label: 'one', status: 'met' },
        { label: 'two', status: 'unmet' },
        { label: 'three', status: 'unknown' },
      ]),
    ).toEqual(['met', 'unmet', 'unknown'])
  })
})
