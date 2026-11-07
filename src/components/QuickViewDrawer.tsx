import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DATA, type Sch } from '../data'
import { match, money } from '../match'
import { useApp } from '../store'
import { Ring } from './Ring'
import { Due } from './Due'
import { slideUp, fadeIn } from '../lib/motion'

interface DrawerProps {
  schId: string | null
  onClose: () => void
}

const ICON = {
  met: ['✓', 'bg-teal text-white', 'Met'],
  unmet: ['✕', 'bg-rose text-white', 'Not met'],
  unknown: ['?', 'bg-sun text-ink', 'Add to your profile'],
} as const

export function QuickViewDrawer({ schId, onClose }: DrawerProps) {
  const { profile, apps, add } = useApp()
  const prefersReduced = useReducedMotion()
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])

  // Remember which element opened the drawer
  useEffect(() => {
    if (schId) {
      triggerRef.current = document.activeElement as HTMLElement
    }
  }, [schId])

  // Focus trap
  useEffect(() => {
    if (!schId) return

    const drawer = drawerRef.current
    if (!drawer) return

    // Focus first focusable element
    const focusables = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    first?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      triggerRef.current?.focus()
    }
  }, [schId, onClose])

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }, [])

  const s = schId ? DATA.find(x => x.id === schId) : null

  // Gather comparison scholarships
  const compareScholarships = compareIds
    .map(id => DATA.find(x => x.id === id))
    .filter((x): x is Sch => !!x)

  const allToShow = s ? [s, ...compareScholarships.filter(c => c.id !== s.id)] : []

  return createPortal(
    <AnimatePresence>
      {schId && s && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40"
            variants={prefersReduced ? undefined : fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-xl overflow-y-auto"
            variants={prefersReduced ? undefined : slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center justify-between border-b border-line p-4">
              <h2 id="drawer-title" className="text-lg font-bold">
                Quick view
              </h2>
              <button
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist"
                aria-label="Close quick view"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {allToShow.map(sch => {
                const m = match(sch, profile)
                const saved = apps.some(a => a.id === sch.id)

                return (
                  <div key={sch.id} className={allToShow.length > 1 ? 'rounded-xl border border-line p-4' : ''}>
                    <div className="flex items-start gap-4">
                      <Ring v={m.score} size={80} animate />
                      <div>
                        <h3 className="text-xl font-bold">{sch.name}</h3>
                        <p className="text-sm text-soft">{sch.provider}</p>
                        <p className="mt-1">
                          <span className="font-head text-lg font-bold">{money(sch.amount)}</span>
                          <span className="text-soft"> · </span>
                          <Due d={sch.deadline} />
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-soft">{sch.desc}</p>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold">Eligibility</h4>
                      <ul className="mt-2 space-y-1.5">
                        {m.checks.map(c => {
                          const [icon, cls, label] = ICON[c.status]
                          return (
                            <li key={c.label} className="flex items-center gap-2 text-sm">
                              <span
                                aria-hidden
                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${cls}`}
                              >
                                {icon}
                              </span>
                              <span className="flex-1">{c.label}</span>
                              <span className="text-xs text-soft">{label}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/s/${sch.id}`}
                        onClick={onClose}
                        className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 min-h-[40px] inline-flex items-center"
                      >
                        Full details
                      </Link>
                      <button
                        onClick={() => add(sch.id)}
                        disabled={saved}
                        className="rounded-full border border-line px-4 py-2 text-sm font-medium min-h-[40px] disabled:bg-sun disabled:border-sun hover:bg-mist"
                      >
                        {saved ? 'Saved' : 'Add to my tracker'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Compare section */}
            <div className="border-t border-line p-4">
              <p className="text-sm font-medium mb-2">
                Compare with (up to 3 total)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DATA.filter(x => x.id !== schId).slice(0, 8).map(sch => {
                  const isComparing = compareIds.includes(sch.id)
                  return (
                    <button
                      key={sch.id}
                      onClick={() => toggleCompare(sch.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border min-h-[32px] ${
                        isComparing
                          ? 'bg-teal text-white border-teal'
                          : 'border-line hover:bg-mist'
                      } ${compareIds.length >= 2 && !isComparing ? 'opacity-40' : ''}`}
                      disabled={compareIds.length >= 2 && !isComparing}
                    >
                      {sch.name.length > 20 ? sch.name.slice(0, 20) + '…' : sch.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
