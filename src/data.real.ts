export type Sch = {
  id: string
  name: string
  provider: string
  desc: string
  amount: number
  amountCovers?: string
  deadline: string | null
  levels: string[]
  fields: string[]
  cats: string[]
  female?: boolean
  maxIncome?: number
  minPct?: number
  states: string[]
  docs: string[]
  steps: string[]
  sourceUrl?: string
  lastVerified?: string
  isSample?: boolean
  tags?: string[]
}

export const ALLOWED_LEVELS = ['Class 10-12', 'Undergraduate', 'Postgraduate', 'PhD'] as const
export const ALLOWED_FIELDS = ['Engineering', 'Medicine', 'Science', 'Commerce', 'Arts', 'Law', 'Any'] as const
export const ALLOWED_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'] as const
export const ALLOWED_STATES = ['Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh'] as const

// Real records are added only from docs/DATA_INBOX.md after official-page checking.
export const REAL: Sch[] = []
