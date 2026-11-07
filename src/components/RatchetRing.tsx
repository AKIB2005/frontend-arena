import { useTicks } from '../lib/hooks'

const colorFor = (v: number) => (v >= 70 ? 'var(--accent)' : 'var(--ink)')

/** Match ring: thick 10px stroke with ink outline that fills in discrete ticks while the number counts up. */
export function RatchetRing({
  value,
  size = 72,
}: {
  value: number
  size?: number
}) {
  const shown = useTicks(value)
  const stroke = 10
  const r = size / 2 - stroke / 2 - 3
  const c = 2 * Math.PI * r
  const mid = size / 2
  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={`${value}% match`}
      className="shrink-0"
    >
      <circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        className="stroke-paper"
        strokeWidth={stroke}
      />
      <circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        stroke={colorFor(value)}
        strokeWidth={stroke}
        strokeDasharray={value < 40 ? '4 5' : c}
        strokeDashoffset={c * (1 - shown / 100)}
        transform={`rotate(-90 ${mid} ${mid})`}
      />
      <circle
        cx={mid}
        cy={mid}
        r={r + stroke / 2}
        fill="none"
        className="stroke-edge"
        strokeWidth={2}
      />
      <circle
        cx={mid}
        cy={mid}
        r={r - stroke / 2}
        fill="none"
        className="stroke-edge"
        strokeWidth={2}
      />
      <text
        x="50%"
        y="50%"
        dy=".35em"
        textAnchor="middle"
        className="fill-fg font-head font-extrabold"
        fontSize={shown >= 100 ? size / 4.6 : size / 3.4}
        aria-hidden="true"
      >
        {shown}%
      </text>
    </svg>
  )
}
