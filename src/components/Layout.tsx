import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useUI } from '../lib/ui-store'
import { DUR, pageEnter, useMotion } from '../lib/motion'
import { Confetti } from './Confetti'
import { HelpDialog } from './HelpDialog'
import { Stepper } from './Stepper'
import { Toaster } from './Toaster'
import { CommandPalette } from './CommandPalette'
import { Dialog } from './Dialog'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const TITLES: Record<string, string> = {
  '/': 'Grantly: find scholarships you can actually win',
  '/dashboard': 'Dashboard | Grantly',
  '/discover': 'Discover scholarships | Grantly',
  '/tracker': 'My tracker | Grantly',
  '/compare': 'Compare scholarships | Grantly',
  '/profile': 'Your profile | Grantly',
  '/onboarding': 'Build your profile | Grantly',
}
const titleFor = (path: string) =>
  path.startsWith('/s/')
    ? 'Scholarship details | Grantly'
    : (TITLES[path] ?? 'Grantly')

function useShortcuts() {
  const navigate = useNavigate()
  const setHelp = useUI((s) => s.setHelp)
  useEffect(() => {
    let g = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (
        t instanceof HTMLElement &&
        t.closest('input,textarea,select,[contenteditable="true"]')
      )
        return
      if (e.key === '?') {
        e.preventDefault()
        setHelp(true)
        return
      }
      if (document.querySelector('[role="dialog"]')) return
      if (e.key === '/') {
        e.preventDefault()
        const el = document.getElementById('search')
        if (el) el.focus()
        else {
          navigate('/discover')
          window.setTimeout(
            () => document.getElementById('search')?.focus(),
            150,
          )
        }
      } else if (e.key === 'g') g = Date.now()
      else if (Date.now() - g < 1200 && e.key === 't') {
        g = 0
        navigate('/tracker')
      } else if (Date.now() - g < 1200 && e.key === 'd') {
        g = 0
        navigate('/discover')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, setHelp])
}

const REVEAL_SELECTOR = 'main > div > *, main .grid > *, main li > article'

/** Slides blocks up as they scroll into view. Movement only: opacity is never touched. */
function useScrollReveal(routeKey: string, off: boolean) {
  useEffect(() => {
    if (off || !('IntersectionObserver' in window)) return
    const seen = new WeakSet<Element>()
    let initial = 0
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          el.style.setProperty('--ri', String(Math.min(i++, 6)))
          el.dataset.reveal = 'in'
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
    )
    const scan = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        if (el.closest('[data-no-reveal],[role="dialog"]')) return
        const pos = getComputedStyle(el).position
        if (pos === 'fixed' || pos === 'sticky') return
        const r = el.getBoundingClientRect()
        // Very tall containers are skipped; the cards inside them reveal one by one.
        if (r.height > window.innerHeight * 1.2) return
        if (r.top > window.innerHeight * 0.92) {
          el.dataset.reveal = 'pending'
          io.observe(el)
        } else {
          el.style.setProperty('--ri', String(Math.min(initial++, 6)))
          el.dataset.reveal = 'in'
        }
      })
    }
    let raf = 0
    const queue = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(scan)
    }
    const main = document.getElementById('main')
    const mo = new MutationObserver(queue)
    if (main) mo.observe(main, { childList: true, subtree: true })
    queue()
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      io.disconnect()
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        delete el.dataset.reveal
        el.style.removeProperty('--ri')
      })
    }
  }, [routeKey, off])
}

const Icon = ({ dark }: { dark: boolean }) =>
  dark ? (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  )

const motionToggleClass =
  'min-h-[44px] rounded-xl border-2 border-edge bg-surface px-3 text-sm font-bold shadow-hard-sm aria-pressed:bg-[var(--fill-ink)] aria-pressed:text-[var(--on-ink)]'

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const {
    theme,
    toggleTheme,
    setHelp,
    reduceMotion: motionChoice,
    toggleReduceMotion,
    setCommandOpen,
    toast,
  } = useUI()
  const { reduce } = useMotion()
  const systemReduced = !!useReducedMotion()
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const [wipe, setWipe] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [dataDialog, setDataDialog] = useState(false)
  useShortcuts()
  useScrollReveal(pathname, reduce)

  useEffect(() => {
    try {
      if (localStorage.getItem('grantly-storage-reset') === '1') {
        localStorage.removeItem('grantly-storage-reset')
        toast('We reset your saved data because it was unreadable.')
      }
    } catch {
      // Storage may be blocked; the app can still use in-memory state.
    }
  }, [toast])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('reduce-motion', reduce)
    root.classList.toggle('motion-on', motionChoice === false)
  }, [reduce, motionChoice])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FFFFFF')
    document.title = titleFor(pathname)
  }, [pathname, theme])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
    if (!reduce) setWipe((w) => w + 1)
  }, [pathname, reduce])

  // Safety net: never leave the transition overlay on screen if its animation is interrupted.
  useEffect(() => {
    if (wipe === 0) return
    const id = window.setTimeout(
      () => setWipe(0),
      Math.min(DUR.slow * 1000 + 300, 1200),
    )
    return () => window.clearTimeout(id)
  }, [wipe])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      const bar = document.getElementById('scroll-progress')
      if (bar) bar.style.transform = `scaleX(${progress})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          main.current?.focus()
        }}
        className="sr-only z-[80] rounded-xl border-2 border-edge bg-accent px-4 py-2 font-bold text-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[75] h-1 origin-left scale-x-0 bg-accent"
        id="scroll-progress"
      />
      {systemReduced && motionChoice === null && (
        <div
          role="note"
          className="border-b-2 border-edge bg-accent px-4 py-2 text-center text-sm font-bold text-on-accent"
        >
          Animations are off because your device asks for reduced motion.{' '}
          <button
            type="button"
            onClick={toggleReduceMotion}
            className="min-h-[44px] rounded-lg border-2 border-edge bg-surface px-3 text-fg underline"
          >
            Turn animations on
          </button>
        </div>
      )}
      <header
        className={
          scrolled
            ? 'border-b-2 border-edge bg-surface shadow-hard-sm'
            : 'border-b-2 border-transparent bg-surface'
        }
      >
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center font-head text-3xl font-extrabold"
            >
              <span
                aria-hidden="true"
                className="logo-mark mr-2 inline-grid h-9 w-9 place-items-center rounded-lg border-2 border-edge bg-accent text-xl text-on-accent shadow-hard-sm"
              >
                G
              </span>
              Grantly<span className="text-accent">.</span>
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                aria-label="Open command palette"
                className="grid h-11 w-11 place-items-center rounded-xl border-2 border-edge bg-surface font-bold shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span aria-hidden="true">⌘</span>
              </button>
              <button
                type="button"
                onClick={() => setHelp(true)}
                aria-label="Keyboard shortcuts"
                className="grid h-11 w-11 place-items-center rounded-xl border-2 border-edge bg-surface font-bold shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span aria-hidden="true">?</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                aria-label="Dark mode"
                className="grid h-11 w-11 place-items-center rounded-xl border-2 border-edge bg-surface shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Icon dark={theme === 'dark'} />
              </button>
              <button
                type="button"
                onClick={toggleReduceMotion}
                aria-pressed={reduce}
                className={`hidden sm:block ${motionToggleClass}`}
              >
                Reduce motion
              </button>
            </div>
          </div>
          <Stepper />
        </div>
      </header>
      <TooltipPrimitive.Provider delayDuration={120}>
        <main
          id="main"
          ref={main}
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-8"
        >
          <motion.div
            key={pathname}
            variants={pageEnter}
            initial={reduce ? false : 'hidden'}
            animate="show"
          >
            {children}
          </motion.div>
        </main>
        <footer className="border-t-2 border-edge bg-surface px-4 py-6 text-center text-sm text-muted">
          <p>
            This list mixes records compiled from published listings and clearly
            labelled samples. Check the official site before applying.
          </p>
          <button
            type="button"
            onClick={() => setDataDialog(true)}
            className="mt-3 font-bold text-fg underline underline-offset-2"
          >
            How we check our data
          </button>
          <button
            type="button"
            onClick={toggleReduceMotion}
            aria-pressed={reduce}
            className={`mt-3 text-fg ${motionToggleClass}`}
          >
            Reduce motion
          </button>
        </footer>
        <AnimatePresence>
          {wipe > 0 && !reduce && (
            <motion.div
              key={wipe}
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[55] border-4 border-accent bg-surface"
              initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 1 }}
              animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 0 }}
              transition={{ duration: DUR.slow, ease: 'easeOut' }}
              onAnimationComplete={() => setWipe(0)}
            />
          )}
        </AnimatePresence>
        <Toaster />
        <Confetti />
        <HelpDialog />
        <CommandPalette />
        <Dialog
          open={dataDialog}
          onClose={() => setDataDialog(false)}
          labelledBy="data-dialog-title"
          variant="center"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id="data-dialog-title" className="text-2xl font-extrabold">
              How we check our data
            </h2>
            <button
              type="button"
              onClick={() => setDataDialog(false)}
              className="min-h-[44px] rounded-lg border-2 border-edge px-3 font-bold"
            >
              Close
            </button>
          </div>
          <p className="mt-4">
            Real records are added from official pages, with the source URL and
            date checked recorded in our data log. Missing facts stay unknown
            rather than being inferred. Samples are labelled separately.
          </p>
          <p className="mt-3 text-muted">
            Published information can change after a check, and this project
            does not guarantee eligibility or application outcomes. Confirm
            every detail on the official site before applying.
          </p>
        </Dialog>
      </TooltipPrimitive.Provider>
    </div>
  )
}
