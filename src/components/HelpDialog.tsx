import {useUI} from '../lib/ui-store'
import {Dialog} from './Dialog'
import {Button} from './ui/Button'

const ROWS: {keys: string[]; text: string}[] = [
  {keys: ['/'], text: 'Jump to search'},
  {keys: ['?'], text: 'Show this help'},
  {keys: ['g', 't'], text: 'Go to my tracker (press g, then t)'},
  {keys: ['g', 'd'], text: 'Go to discover (press g, then d)'},
  {keys: ['Esc'], text: 'Close a drawer or dialog'},
]

export function HelpDialog() {
  const {helpOpen, setHelp} = useUI()
  const close = () => setHelp(false)
  return (
    <Dialog open={helpOpen} onClose={close} labelledBy="help-title" variant="center">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 id="help-title" className="text-2xl font-extrabold">Keyboard shortcuts</h2>
        <Button variant="ghost" size="sm" onClick={close} aria-label="Close shortcuts help" className="shrink-0 !px-3"><span aria-hidden="true">×</span></Button>
      </div>
      <p className="mb-3 text-sm text-muted">Shortcuts pause while you are typing in a field.</p>
      <dl className="space-y-2">
        {ROWS.map(r => (
          <div key={r.text} className="flex items-center justify-between gap-4 rounded-xl border-2 border-edge bg-surface p-3">
            <dt className="flex gap-1">{r.keys.map((k, i) => <kbd key={i} className="min-w-[2rem] rounded-lg border-2 border-edge bg-accent px-2 py-0.5 text-center font-bold text-inverse-text">{k}</kbd>)}</dt>
            <dd className="text-right text-sm">{r.text}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  )
}
