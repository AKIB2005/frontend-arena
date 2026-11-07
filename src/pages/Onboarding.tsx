import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DATA } from '../data'
import { match } from '../match'
import { useApp } from '../store'
import type { FieldKey } from '../lib/hints'
import { stepSlide, useMotion } from '../lib/motion'
import { ProfileForm } from '../components/ProfileForm'
import { SegmentedMeter } from '../components/SegmentedMeter'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

type Step = { title: string; blurb: string; fields: FieldKey[] }
const STEPS: Step[] = [
  {
    title: 'Study',
    blurb: 'What are you studying, or planning to study?',
    fields: ['level', 'field'],
  },
  {
    title: 'You',
    blurb:
      'Some scholarships are for specific groups. Share what you are comfortable with.',
    fields: ['cat', 'gender', 'state'],
  },
  {
    title: 'Money and marks',
    blurb: 'These two decide a lot of eligibility. Estimates are fine.',
    fields: ['income', 'pct'],
  },
  {
    title: 'Review',
    blurb: 'Here is what we will use to match you.',
    fields: [],
  },
]
const LABELS: [string, FieldKey][] = [
  ['Study level', 'level'],
  ['Field', 'field'],
  ['Category', 'cat'],
  ['Gender', 'gender'],
  ['State', 'state'],
  ['Family income', 'income'],
  ['Last exam percentage', 'pct'],
]

export default function Onboarding() {
  const profile = useApp((s) => s.profile)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const heading = useRef<HTMLHeadingElement>(null)
  const firstLevel = useRef<HTMLInputElement | null>(null)
  const mounted = useRef(false)
  const { reduce } = useMotion()

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    heading.current?.focus()
  }, [step])

  const validate = (): boolean => {
    const e: Partial<Record<FieldKey, string>> = {}
    if (step === 0 && !profile.level)
      e.level = 'Choose your study level to continue.'
    if (step === 2) {
      if (profile.income !== null && profile.income < 0)
        e.income = 'Income cannot be negative.'
      if (profile.pct !== null && (profile.pct < 0 || profile.pct > 100))
        e.pct = 'Enter a percentage between 0 and 100.'
    }
    setErrors(e)
    if (e.level) firstLevel.current?.focus()
    return Object.keys(e).length === 0
  }
  const go = (to: number) => {
    setDir(to > step ? 1 : -1)
    setErrors({})
    setStep(to)
  }
  const next = () => {
    if (validate()) go(step + 1)
  }

  const matches = DATA.filter((s) => {
    const m = match(s, profile)
    return m.known > 0 && m.score >= 70
  }).length
  const cur = STEPS[step]
  const canSkip = step === 1 || step === 2

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="sr-only">Build your profile</h1>
      <div
        role="progressbar"
        aria-label="Profile setup progress"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={step + 1}
        aria-valuetext={`Step ${step + 1} of 4: ${cur.title}`}
        className="mb-6"
      >
        <p className="mb-2 text-sm font-bold" aria-hidden="true">
          Step {step + 1} of 4: {cur.title}
        </p>
        <SegmentedMeter
          value={step + 1}
          max={4}
          segments={4}
          fillClass="bg-accent"
        />
      </div>
      <Card className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={reduce ? undefined : stepSlide}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 ref={heading} tabIndex={-1} className="text-3xl font-extrabold">
              {cur.title}
            </h2>
            <p className="mb-6 mt-1 text-muted">{cur.blurb}</p>
            {step < 3 ? (
              <ProfileForm
                fields={cur.fields}
                errors={errors}
                levelRef={(el) => {
                  firstLevel.current = el
                }}
              />
            ) : (
              <div>
                <p
                  className="mb-4 rounded-xl border-2 border-edge bg-accent p-4 font-head text-2xl font-extrabold text-on-accent"
                  role="status"
                >
                  {matches === 1
                    ? '1 scholarship matches you'
                    : `${matches} scholarships match you`}
                </p>
                <dl className="divide-y-2 divide-edge rounded-xl border-2 border-edge">
                  {LABELS.map(([label, key]) => {
                    const v = profile[key]
                    const shown =
                      key === 'gender'
                        ? v === 'f'
                          ? 'Female'
                          : v === 'm'
                            ? 'Male'
                            : 'Not shared'
                        : v === '' || v === null
                          ? 'Not added'
                          : key === 'pct'
                            ? `${v}%`
                            : key === 'income'
                              ? `₹${Number(v).toLocaleString('en-IN')}`
                              : String(v)
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3 p-3"
                      >
                        <dt className="text-sm text-muted">{label}</dt>
                        <dd className="font-bold">{shown}</dd>
                      </div>
                    )
                  })}
                </dl>
                <p className="mt-3 text-sm text-muted">
                  A match means you meet 70% or more of the criteria we could
                  check. You can edit your profile any time.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => go(step - 1)}>
              Back
            </Button>
          )}
          {canSkip && (
            <Button variant="ghost" onClick={() => go(step + 1)}>
              Skip this step
            </Button>
          )}
          <div className="ml-auto flex gap-3">
            {step === 3 && (
              <Button variant="ghost" onClick={() => go(0)}>
                Edit answers
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={next}>
                {step === 2 ? 'Review my profile' : 'Continue'}
              </Button>
            ) : (
              <ButtonLink to="/discover">See my matches</ButtonLink>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
