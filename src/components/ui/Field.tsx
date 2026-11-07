import { cn } from '../../lib/utils'

interface FieldProps {
  id: string
  label: string
  srOnly?: boolean
  error?: string
  className?: string
  children?: React.ReactNode
}

interface InputFieldProps extends FieldProps {
  type?: 'text' | 'number' | 'email'
  value: string | number | ''
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: number
  max?: number
}

interface SelectFieldProps extends FieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  placeholder?: string
}

export function InputField({ id, label, srOnly, error, className, type = 'text', value, onChange, placeholder, min, max }: InputFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cn('mb-1 block text-sm font-medium', srOnly && 'sr-only')}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={cn('field', error && 'border-rose')}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm text-rose" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function SelectField({ id, label, srOnly, error, className, value, onChange, options, placeholder = 'Select' }: SelectFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cn('mb-1 block text-sm font-medium', srOnly && 'sr-only')}>
        {label}
      </label>
      <select
        id={id}
        className={cn('field', error && 'border-rose')}
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm text-rose" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
