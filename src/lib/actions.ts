import type { Sch } from '../data'
import { useApp, type Status } from '../store'
import { useUI } from './ui-store'

export const STATUS_LABEL: Record<Status, string> = {
  saved: 'Saved',
  applying: 'Applying',
  submitted: 'Submitted',
  result: 'Result',
}

/** Tracker actions that also confirm themselves with a toast, stamp or confetti. */
export function useActions() {
  const apps = useApp((s) => s.apps)
  const { add, move, remove, restore } = useApp.getState()
  const { toast, stamp, fireConfetti } = useUI.getState()
  return {
    save(s: Sch) {
      if (apps.some((a) => a.id === s.id)) return
      add(s.id)
      stamp(s.id, 'SAVED')
      toast(`Saved ${s.name} to your tracker`)
    },
    moveTo(s: Sch, st: Status) {
      const current = useApp.getState().apps.find((a) => a.id === s.id)?.status
      if (!current || current === st) return
      move(s.id, st)
      if (st === 'submitted' && current !== 'submitted') {
        stamp(s.id, 'SUBMITTED')
        fireConfetti()
      }
      toast(`Moved ${s.name} to ${STATUS_LABEL[st]}`)
    },
    removeWithUndo(s: Sch) {
      const a = apps.find((x) => x.id === s.id)
      if (!a) return
      remove(s.id)
      toast(`Removed ${s.name} from your tracker`, {
        label: 'Undo',
        run: () => {
          restore(a)
          useUI.getState().toast(`Restored ${s.name}`)
        },
      })
    },
  }
}
