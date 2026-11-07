import { create } from 'zustand'

export type Toast = {
  id: number
  text: string
  action?: { label: string; run: () => void }
}
export type Theme = 'light' | 'dark'

const THEME_KEY = 'grantly-theme'
const CONFETTI_KEY = 'grantly-confetti'
const REDUCE_KEY = 'grantly-reduce-motion'

function initialTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'dark' || t === 'light') return t
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}
function initialReduceMotion(): boolean {
  try {
    return localStorage.getItem(REDUCE_KEY) === '1'
  } catch {
    return false
  }
}

type UI = {
  theme: Theme
  toggleTheme: () => void
  toasts: Toast[]
  toast: (text: string, action?: Toast['action']) => void
  dismiss: (id: number) => void
  stamps: Record<string, string>
  stamp: (id: string, label: string) => void
  compare: string[]
  toggleCompare: (id: string) => void
  setCompare: (ids: string[]) => void
  clearCompare: () => void
  confetti: number
  fireConfetti: () => void
  helpOpen: boolean
  setHelp: (v: boolean) => void
  commandOpen: boolean
  setCommandOpen: (v: boolean) => void
  reduceMotion: boolean
  toggleReduceMotion: () => void
}

let nextId = 1

export const useUI = create<UI>((set, get) => ({
  theme: initialTheme(),
  toggleTheme: () => {
    const theme: Theme = get().theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* storage may be blocked */
    }
    set({ theme })
  },
  toasts: [],
  toast: (text, action) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text, action }] }))
    window.setTimeout(() => get().dismiss(id), action ? 7000 : 4000)
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  stamps: {},
  stamp: (id, label) => {
    set((s) => ({ stamps: { ...s.stamps, [id]: label } }))
    window.setTimeout(
      () =>
        set((s) => {
          const { [id]: _gone, ...rest } = s.stamps
          return { stamps: rest }
        }),
      1500,
    )
  },
  compare: [],
  toggleCompare: (id) =>
    set((s) =>
      s.compare.includes(id)
        ? { compare: s.compare.filter((x) => x !== id) }
        : s.compare.length >= 3
          ? s
          : { compare: [...s.compare, id] },
    ),
  setCompare: (ids) => set({ compare: ids.slice(0, 3) }),
  clearCompare: () => set({ compare: [] }),
  confetti: 0,
  fireConfetti: () => {
    try {
      if (sessionStorage.getItem(CONFETTI_KEY)) return
      sessionStorage.setItem(CONFETTI_KEY, '1')
    } catch {
      /* if storage is blocked, still allow one burst per load */
    }
    set((s) => ({ confetti: s.confetti + 1 }))
  },
  helpOpen: false,
  setHelp: (v) => set({ helpOpen: v }),
  commandOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),
  reduceMotion: initialReduceMotion(),
  toggleReduceMotion: () => {
    const reduceMotion = !get().reduceMotion
    try {
      localStorage.setItem(REDUCE_KEY, reduceMotion ? '1' : '0')
    } catch {
      /* storage may be blocked */
    }
    set({ reduceMotion })
  },
}))
