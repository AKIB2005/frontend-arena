import {AnimatePresence, motion} from 'framer-motion'
import {useUI} from '../lib/ui-store'
import {useMotion} from '../lib/motion'
import {Button} from './ui/Button'

/** Polite live region. It stays mounted so screen readers pick up each new toast. */
export function Toaster() {
  const {toasts, dismiss} = useUI()
  const {tr} = useMotion()
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-3 top-3 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:right-4 sm:w-96">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{opacity: 0, x: 24}}
            animate={{opacity: 1, x: 0, transition: tr({duration: 0.15})}}
            exit={{opacity: 0, transition: tr({duration: 0.1})}}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-xl border-2 border-edge bg-surface p-3 text-fg shadow-hard"
          >
            <p className="min-w-0 flex-1 text-sm font-bold">{t.text}</p>
            {t.action && (
              <Button size="sm" variant="primary" onClick={() => { t.action?.run(); dismiss(t.id) }}>{t.action.label}</Button>
            )}
            <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(t.id)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-edge text-lg font-bold">
              <span aria-hidden="true">×</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
