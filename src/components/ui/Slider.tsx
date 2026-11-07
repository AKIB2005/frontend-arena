import {useId} from 'react'

type Props = {label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string; hint?: string}

/** Native range input, 44px tall for touch, with a live value readout. */
export function Slider({label, value, min, max, step, onChange, display, hint}: Props) {
  const id = useId()
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold">{label}</label>
        <output htmlFor={id} className="rounded-lg border-2 border-edge bg-accent px-2 py-0.5 text-sm font-bold text-inverse-text">{display}</output>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className="h-11 w-full cursor-pointer accent-accent"
      />
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  )
}
