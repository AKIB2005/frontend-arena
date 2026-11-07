import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fadeIn } from '../lib/motion'

interface ToastProps {
  message: string
  onDone: () => void
}

function ToastItem({ message, onDone }: ToastProps) {
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg"
      variants={prefersReduced ? undefined : fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {message}
    </motion.div>
  )
}

let toastListener: ((msg: string) => void) | null = null

export function showToast(message: string) {
  toastListener?.(message)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])

  useEffect(() => {
    let nextId = 0
    toastListener = (message: string) => {
      setToasts(prev => [...prev, { id: nextId++, message }])
    }
    return () => { toastListener = null }
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <ToastItem key={t.id} message={t.message} onDone={() => remove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}
