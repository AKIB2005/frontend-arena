import { REAL } from '../src/data.real.ts'

for (const s of REAL) {
  if (!s.sourceUrl) {
    console.log(`${s.id}: no source URL`)
    continue
  }
  try {
    const response = await fetch(s.sourceUrl, { method: 'HEAD', redirect: 'follow' })
    console.log(`${s.id}: ${response.status} ${s.sourceUrl}`)
  } catch (error) {
    console.log(`${s.id}: request failed (${error instanceof Error ? error.message : String(error)}) ${s.sourceUrl}`)
  }
}
