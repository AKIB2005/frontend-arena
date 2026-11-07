import {useEffect, useRef, type KeyboardEvent, type ReactNode} from 'react'
import {createPortal} from 'react-dom'
import {AnimatePresence, motion} from 'framer-motion'
import {cn} from '../lib/utils'
import {fade, slideRight, useMotion} from '../lib/motion'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

type Props = {open: boolean; onClose: () => void; labelledBy: string; variant?: 'drawer' | 'center'; children: ReactNode}

/** Accessible modal: focus trap, Escape closes, focus returns to the trigger, aria-modal and a labelled heading. */
export function Dialog({open, onClose, labelledBy, variant = 'drawer', children}: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const {reduce} = useMotion()

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({preventScroll: true})
    return () => {
      document.body.style.overflow = prev
      opener.current?.focus({preventScroll: true})
    }
  }, [open])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }
    if (e.key !== 'Tab' || !panel.current) return
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!items.length) { e.preventDefault(); return }
    const first = items[0], last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  const drawer = variant === 'drawer'
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" onKeyDown={onKeyDown}>
          <motion.div variants={fade} initial="hidden" animate="show" exit="exit" className="absolute inset-0 bg-ink/70" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            variants={drawer && !reduce ? slideRight : fade}
            initial="hidden" animate="show" exit="exit"
            className={cn(
              'absolute overflow-y-auto border-2 border-edge bg-surface text-fg shadow-hard-lg',
              drawer ? 'inset-y-0 right-0 w-full max-w-md rounded-l-xl p-5 sm:p-6' : 'left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl p-5 sm:p-6',
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
