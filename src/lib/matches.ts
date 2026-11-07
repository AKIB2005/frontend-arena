import { useMemo } from 'react'
import { DATA, type Sch } from '../data'
import { match } from '../match'
import { useApp } from '../store'

export function useMatches(): Map<string, ReturnType<typeof match>> {
  const profile = useApp((s) => s.profile)
  return useMemo(
    () => new Map(DATA.map((s) => [s.id, match(s, profile)])),
    [profile],
  )
}

export function getMatch(
  map: Map<string, ReturnType<typeof match>>,
  scholarship: Sch,
) {
  return (
    map.get(scholarship.id) ??
    match(scholarship, {
      name: '',
      level: '',
      field: '',
      cat: '',
      gender: '',
      state: '',
      income: null,
      pct: null,
    })
  )
}
