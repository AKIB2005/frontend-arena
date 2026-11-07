import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { emptyProfile, type Profile } from './match'
export type Status = 'saved' | 'applying' | 'submitted' | 'result'
export const STATUSES: Status[] = ['saved', 'applying', 'submitted', 'result']
export type App = { id: string; status: Status; notes: string; docs: string[] }
type St = {
  profile: Profile
  setProfile: (p: Partial<Profile>) => void
  apps: App[]
  add: (id: string) => void
  remove: (id: string) => void
  restore: (a: App) => void
  move: (id: string, s: Status) => void
  note: (id: string, n: string) => void
  toggleDoc: (id: string, d: string) => void
}
const upd = (a: App[], id: string, f: (x: App) => App) =>
  a.map((x) => (x.id === id ? f(x) : x))
export const useApp = create<St>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      apps: [],
      add: (id) =>
        set((s) =>
          s.apps.some((a) => a.id === id)
            ? s
            : {
                apps: [...s.apps, { id, status: 'saved', notes: '', docs: [] }],
              },
        ),
      remove: (id) => set((s) => ({ apps: s.apps.filter((a) => a.id !== id) })),
      restore: (a) =>
        set((s) =>
          s.apps.some((x) => x.id === a.id) ? s : { apps: [...s.apps, a] },
        ),
      move: (id, status) =>
        set((s) => ({ apps: upd(s.apps, id, (a) => ({ ...a, status })) })),
      note: (id, notes) =>
        set((s) => ({ apps: upd(s.apps, id, (a) => ({ ...a, notes })) })),
      toggleDoc: (id, d) =>
        set((s) => ({
          apps: upd(s.apps, id, (a) => ({
            ...a,
            docs: a.docs.includes(d)
              ? a.docs.filter((x) => x !== d)
              : [...a.docs, d],
          })),
        })),
    }),
    { name: 'grantly-v1' },
  ),
)

export const DEMO_PROFILE: Profile = {
  name: 'Aarav Sharma',
  level: 'Undergraduate',
  field: 'Engineering',
  cat: 'Minority',
  gender: 'm',
  state: 'Maharashtra',
  income: 420000,
  pct: 82,
}
