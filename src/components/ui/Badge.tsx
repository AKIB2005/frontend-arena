import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sun' | 'teal' | 'rose'
  className?: string
}

const variants = {
  default: 'bg-mist text-ink',
  sun: 'bg-sun text-ink',
  teal: 'bg-teal text-white',
  rose: 'bg-rose text-white',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
