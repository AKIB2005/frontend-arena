import {
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { cn } from '../../lib/utils'

export const controlClass =
  'w-full min-h-[44px] rounded-xl border-2 border-edge bg-surface px-3 py-2 text-base text-fg placeholder:text-muted aria-[invalid=true]:border-accent'

type FieldProps = {
  label: string
  hint?: string
  error?: string
  children: (a: {
    id: string
    describedBy?: string
    invalid: boolean
  }) => ReactNode
  srOnly?: boolean
  className?: string
}

/** Label + control + hint + inline error, wired with aria-describedby. */
export function Field({
  label,
  hint,
  error,
  children,
  srOnly,
  className,
}: FieldProps) {
  const id = useId()
  const hid = `${id}-h`,
    eid = `${id}-e`
  const describedBy =
    [hint && hid, error && eid].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={cn('mb-1 block text-sm font-bold', srOnly && 'sr-only')}
      >
        {label}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && (
        <p id={hid} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={eid} role="alert" className="mt-1 text-sm font-bold text-accent">
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  srOnly?: boolean
  wrapClass?: string
}
export function TextInput({
  label,
  hint,
  error,
  srOnly,
  wrapClass,
  className,
  ...rest
}: InputProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      srOnly={srOnly}
      className={wrapClass}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(controlClass, className)}
          {...rest}
        />
      )}
    </Field>
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: string[]
  placeholder?: string
  hint?: string
  error?: string
  srOnly?: boolean
  wrapClass?: string
}
export function Select({
  label,
  options,
  placeholder = 'Select',
  hint,
  error,
  srOnly,
  wrapClass,
  className,
  ...rest
}: SelectProps) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      srOnly={srOnly}
      className={wrapClass}
    >
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(controlClass, className)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}

type ChoiceProps = {
  legend: string
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  firstRef?: (el: HTMLInputElement | null) => void
}
/** Chunky radio chips. Real radios underneath so arrow keys and screen readers just work. */
export function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  hint,
  firstRef,
}: ChoiceProps) {
  const id = useId()
  const describedBy =
    [hint && `${id}-h`, error && `${id}-e`].filter(Boolean).join(' ') ||
    undefined
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="mb-2 text-sm font-bold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.value} className="relative">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              aria-invalid={!!error}
              ref={i === 0 ? firstRef : undefined}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-edge bg-surface px-4 py-2 text-base font-bold text-fg shadow-hard-sm transition-[transform,box-shadow] duration-100 peer-checked:bg-accent peer-checked:text-inverse-text peer-checked:shadow-none peer-checked:translate-x-0.5 peer-checked:translate-y-0.5 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {hint && (
        <p id={`${id}-h`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-e`}
          role="alert"
          className="mt-2 text-sm font-bold text-accent"
        >
          {error}
        </p>
      )}
    </fieldset>
  )
}
