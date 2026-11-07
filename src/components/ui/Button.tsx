import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'sun'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  as?: 'button'
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  as: 'a'
}

const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-40 disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90',
  secondary: 'border border-line bg-white text-ink hover:bg-mist',
  ghost: 'text-ink hover:bg-white',
  sun: 'bg-sun text-ink font-bold hover:bg-sun/90',
}

export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'primary', className, ...rest } = props
  const cls = cn(base, variants[variant], className)

  if (props.as === 'a') {
    const { as: _, variant: _v, ...aProps } = props as LinkButtonProps
    return <a className={cls} {...aProps} />
  }

  const { as: _, variant: _v, ...bProps } = props as ButtonProps
  return <button className={cls} {...bProps} />
}
