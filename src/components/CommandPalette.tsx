import { useEffect } from 'react'
import { Command } from 'cmdk'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp, DEMO_PROFILE } from '../store'
import { useUI } from '../lib/ui-store'
import { Button } from './ui/Button'

export function CommandPalette() {
  const open = useUI((s) => s.commandOpen)
  const setOpen = useUI((s) => s.setCommandOpen)
  const theme = useUI((s) => s.theme)
  const toggleTheme = useUI((s) => s.toggleTheme)
  const setProfile = useApp((s) => s.setProfile)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const run = (action: () => void) => {
    action()
    setOpen(false)
  }

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command palette">
      <Command.Input
        placeholder="Search Grantly actions..."
        aria-label="Search commands"
      />
      <Command.List>
        <Command.Empty>No command found.</Command.Empty>
        <Command.Group heading="Navigate">
          <Command.Item onSelect={() => run(() => navigate('/dashboard'))}>
            Open dashboard
          </Command.Item>
          <Command.Item onSelect={() => run(() => navigate('/discover'))}>
            Find scholarships
          </Command.Item>
          <Command.Item onSelect={() => run(() => navigate('/tracker'))}>
            Open my tracker
          </Command.Item>
          <Command.Item onSelect={() => run(() => navigate('/profile'))}>
            Edit profile
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Actions">
          <Command.Item
            onSelect={() =>
              run(() => {
                setProfile(DEMO_PROFILE)
                navigate('/discover')
              })
            }
          >
            Load demo profile
          </Command.Item>
          <Command.Item onSelect={() => run(toggleTheme)}>
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </Command.Item>
          <Command.Item
            onSelect={() =>
              run(() =>
                window.dispatchEvent(
                  new CustomEvent('grantly:download-calendar'),
                ),
              )
            }
          >
            Download calendar
          </Command.Item>
        </Command.Group>
      </Command.List>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
        className="m-3"
      >
        Close
      </Button>
      <span className="sr-only">Current page: {location.pathname}</span>
    </Command.Dialog>
  )
}
