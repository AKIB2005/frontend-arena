import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../store'
import { cn } from '../lib/utils'
import { ToastContainer } from './Toast'

const STEPS = [
  { label: 'Profile', path: '/onboarding', match: ['/onboarding', '/profile'] },
  { label: 'Discover', path: '/discover', match: ['/discover', '/s/'] },
  { label: 'Apply', path: '/discover', match: [] },
  { label: 'Track', path: '/tracker', match: ['/tracker'] },
] as const

function getActiveStep(pathname: string, hasProfile: boolean): number {
  if (pathname === '/tracker') return 3
  if (pathname.startsWith('/s/')) return 1
  if (pathname === '/discover') return 1
  if (pathname === '/profile') return 0
  if (pathname === '/onboarding') return 0
  if (hasProfile) return 1
  return 0
}

export function Layout({ children }: { children: React.ReactNode }) {
  const n = useApp(s => s.apps.length)
  const profile = useApp(s => s.profile)
  const hasProfile = !!(profile.level || profile.field || profile.cat)
  const location = useLocation()
  const activeStep = getActiveStep(location.pathname, hasProfile)
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="border-b border-line bg-white sticky top-0 z-30">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-head text-2xl font-extrabold">
            Grantly<span className="text-teal">.</span>
          </Link>

          {/* Desktop nav with journey stepper */}
          <div className="hidden md:flex items-center gap-1">
            {!isHome && (
              <ol className="flex items-center gap-0 mr-4" aria-label="Journey steps">
                {STEPS.map((step, i) => {
                  const isCurrent = i === activeStep
                  const isCompleted = i < activeStep
                  return (
                    <li key={step.label} className="flex items-center">
                      {i > 0 && (
                        <div
                          className={cn(
                            'h-px w-6 mx-1',
                            isCompleted ? 'bg-teal' : 'bg-line'
                          )}
                          aria-hidden
                        />
                      )}
                      <NavLink
                        to={step.path}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={cn(
                          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                          isCurrent && 'bg-teal/10 text-teal',
                          isCompleted && 'text-teal',
                          !isCurrent && !isCompleted && 'text-soft hover:text-ink'
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-5 w-5 place-items-center rounded-full text-xs font-bold',
                            isCurrent && 'bg-teal text-white',
                            isCompleted && 'bg-teal text-white',
                            !isCurrent && !isCompleted && 'bg-line text-soft'
                          )}
                          aria-hidden
                        >
                          {isCompleted ? '✓' : i + 1}
                        </span>
                        {step.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ol>
            )}

            <NavLink
              to="/discover"
              end
              className={({ isActive }) =>
                cn('rounded-full px-4 py-2 text-sm font-medium min-h-[40px] inline-flex items-center', isActive ? 'bg-ink text-white' : 'hover:bg-mist')
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/tracker"
              className={({ isActive }) =>
                cn('rounded-full px-4 py-2 text-sm font-medium min-h-[40px] inline-flex items-center', isActive ? 'bg-ink text-white' : 'hover:bg-mist')
              }
            >
              My tracker
              {n > 0 && (
                <span className="ml-2 rounded-full bg-sun px-2 text-xs text-ink">{n}</span>
              )}
            </NavLink>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            {!isHome && (
              <div className="flex items-center gap-0.5 mr-2" aria-label="Journey steps" role="list">
                {STEPS.map((step, i) => {
                  const isCurrent = i === activeStep
                  const isCompleted = i < activeStep
                  return (
                    <NavLink
                      key={step.label}
                      to={step.path}
                      role="listitem"
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={step.label}
                      className={cn(
                        'grid h-7 w-7 place-items-center rounded-full text-xs font-bold',
                        isCurrent && 'bg-teal text-white',
                        isCompleted && 'bg-teal/20 text-teal',
                        !isCurrent && !isCompleted && 'bg-line text-soft'
                      )}
                    >
                      {isCompleted ? '✓' : i + 1}
                    </NavLink>
                  )
                })}
              </div>
            )}
            <NavLink
              to="/tracker"
              className={({ isActive }) =>
                cn('rounded-full px-3 py-2 text-sm font-medium min-h-[40px] inline-flex items-center', isActive ? 'bg-ink text-white' : 'hover:bg-mist')
              }
              aria-label={`My tracker${n > 0 ? `, ${n} items` : ''}`}
            >
              Track
              {n > 0 && (
                <span className="ml-1.5 rounded-full bg-sun px-1.5 text-xs text-ink">{n}</span>
              )}
            </NavLink>
          </div>
        </nav>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-soft">
        Sample data: all scholarships are fictional and for demonstration.
      </footer>

      <ToastContainer />
    </div>
  )
}
