import { Link, useLocation } from 'react-router-dom'
import { DATA } from '../data'
import { useApp } from '../store'
import { cn } from '../lib/utils'

/** Which journey stage the person is in, from the route and how far the profile is filled in. */
export function useStage(): number {
  const { pathname } = useLocation()
  const started = useApp((s) => s.profile.level !== '')
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/profile'))
    return 0
  if (pathname.startsWith('/s/')) return 2
  if (pathname.startsWith('/tracker')) return 3
  if (pathname === '/') return started ? 1 : 0
  return 1
}

export function Stepper() {
  const stage = useStage()
  const { apps, profile } = useApp()
  const next = apps
    .filter((a) => a.status === 'saved' || a.status === 'applying')
    .map((a) => DATA.find((s) => s.id === a.id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0]
  const steps = [
    { label: 'Profile', to: profile.level ? '/profile' : '/onboarding' },
    { label: 'Discover', to: '/discover' },
    { label: 'Apply', to: next ? `/s/${next.id}` : '/discover' },
    { label: 'Track', to: '/tracker' },
  ]
  return (
    <nav aria-label="Your journey">
      <ol className="flex gap-2">
        {steps.map((st, i) => {
          const current = i === stage
          const done = i < stage
          return (
            <li
              key={st.label}
              className={cn(
                'min-w-0',
                current ? 'flex-[2] sm:flex-1' : 'flex-1',
              )}
            >
              <Link
                to={st.to}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'relative flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-edge px-2 text-sm font-bold',
                  current
                    ? 'bg-accent text-inverse-text shadow-hard-sm after:absolute after:bottom-[-6px] after:left-1/4 after:right-1/4 after:h-1 after:bg-accent'
                    : 'bg-surface text-fg',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 border-edge text-xs',
                    done
                      ? 'bg-accent text-inverse-text'
                      : current
                        ? 'bg-ink text-inverse-text'
                        : 'bg-surface',
                  )}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className={cn(
                    'truncate',
                    !current && 'sr-only sm:not-sr-only',
                  )}
                >
                  {st.label}
                </span>
                {st.label === 'Track' && apps.length > 0 && (
                  <span className="rounded-md border-2 border-edge bg-accent px-1.5 text-xs text-inverse-text">
                    {apps.length}
                    <span className="sr-only"> saved</span>
                  </span>
                )}
                {done && <span className="sr-only">, done</span>}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
