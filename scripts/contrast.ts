import { readFileSync, writeFileSync } from 'node:fs'

type Pair = [string, string, string, string, string]

const pairs: Pair[] = [
  ['ink on surface', '#0A0A0A', '#FFFFFF', '#FFFFFF', '#0A0A0A'],
  ['muted on surface', '#4A4A4A', '#FFFFFF', '#B8B8B8', '#0A0A0A'],
  ['accent text on surface', '#C2410C', '#FFFFFF', '#FF5A1F', '#0A0A0A'],
  ['on accent', '#0A0A0A', '#FF5A1F', '#0A0A0A', '#FF5A1F'],
]

function luminance(hex: string) {
  const rgb = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

function contrast(foreground: string, background: string) {
  const light = luminance(foreground)
  const dark = luminance(background)
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05)
}

const rows = pairs.map(
  ([
    name,
    lightForeground,
    lightBackground,
    darkForeground,
    darkBackground,
  ]) => ({
    name,
    light: contrast(lightForeground, lightBackground),
    dark: contrast(darkForeground, darkBackground),
  }),
)

if (rows.some((row) => row.light < 4.5 || row.dark < 4.5)) {
  console.table(rows)
  throw new Error('Contrast check failed: text pairs must be at least 4.5:1.')
}

const table = [
  '## Pass 5 contrast table',
  '',
  '| Pair | Light | Dark |',
  '| --- | ---: | ---: |',
  ...rows.map(
    (row) =>
      `| ${row.name} | ${row.light.toFixed(2)}:1 | ${row.dark.toFixed(2)}:1 |`,
  ),
  '',
].join('\n')
const notes = readFileSync('NOTES.md', 'utf8')
const marker = '## Pass 5 contrast table'
const next = notes.includes(marker)
  ? notes.slice(0, notes.indexOf(marker)) + table
  : `${notes.trimEnd()}\n\n${table}`
writeFileSync('NOTES.md', next)
console.table(rows)
