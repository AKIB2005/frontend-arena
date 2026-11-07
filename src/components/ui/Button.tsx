import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'ink' | 'ghost' | 'danger'
type Size = 'md' | 'sm'

const base =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-edge font-bold leading-tight transition-[transform,opacity] duration-100 ' +
  'shadow-hard can-hover:hover:-translate-x-0.5 can-hover:hover:-translate-y-0.5 ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent',
  ink: 'bg-fill-ink text-on-ink',
  ghost: 'bg-surface text-fg',
  danger: 'bg-accent text-on-accent',
}
const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-5 py-2 text-base',
  sm: 'min-h-[44px] px-4 py-1.5 text-sm',
}

/** Class string for anything that should look like a Grantly button. */
export const btn = (
  variant: Variant = 'primary',
  size: Size = 'md',
  extra?: string,
) => cn(base, variants[variant], sizes[size], extra)

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={btn(variant, size, className)}
      {...rest}
    />
  )
})

type LinkBtnProps = LinkProps & { variant?: Variant; size?: Size }
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: LinkBtnProps) {
  return <Link className={btn(variant, size, className)} {...rest} />
}
