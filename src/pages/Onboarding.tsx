import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useApp } from '../store'
import { type Profile, emptyProfile } from '../match'
import { DATA } from '../data'
import { match } from '../match'
import { SelectField, InputField } from '../components/ui/Field'
import { LV, FD, CT, ST } from '../components/ProfileForm'
import { pageVariants, fadeIn } from '../lib/motion'
import { cn } from '../lib/utils'

const STEP_LABELS = ['Study', 'You', 'Money and marks', 'Review'] as const
type StepIndex = 0 | 1 | 2 | 3

interface StepErrors {
  [key: string]: string
}

function validateStep(step: StepIndex, draft: Profile): StepErrors {
  const errors: StepErrors = {}
  if (step === 0) {
    if (!draft.level) errors.level = 'Choose your study level to continue.'
  }
  // Other steps are optional per task spec (Skip option)
  return errors
}

export default function Onboarding() {
  const { profile, setProfile } = useApp()
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  // Local draft so we can validate before saving
  const [draft, setDraft] = useState<Profile>(() => ({
    ...emptyProfile,
    ...profile,
  }))
  const [step, setStep] = useState<StepIndex>(0)
  const [errors, setErrors] = useState<StepErrors>({})
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Focus heading on step change for screen readers
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const update = (partial: Partial<Profile>) => {
    setDraft(prev => ({ ...prev, ...partial }))
    // Clear errors for changed fields
    const keys = Object.keys(partial)
    setErrors(prev => {
      const next = { ...prev }
      keys.forEach(k => delete next[k])
      return next
    })
  }

  const numChange = (k: 'income' | 'pct') => (e: React.ChangeEvent<HTMLInputElement>) =>
    update({ [k]: e.target.value === '' ? null : Number(e.target.value) })

  const goNext = () => {
    const errs = validateStep(step, draft)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setDirection(1)
    if (step < 3) {
      setStep((step + 1) as StepIndex)
    }
  }

  const goBack = () => {
    setDirection(-1)
    if (step > 0) {
      setStep((step - 1) as StepIndex)
    }
  }

  const skip = () => {
    setDirection(1)
    if (step < 3) {
      setStep((step + 1) as StepIndex)
    }
  }

  const finish = () => {
    setProfile(draft)
    navigate('/discover')
  }

  // Save draft to store whenever it changes
  useEffect(() => {
    setProfile(draft)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  // Count matching scholarships for review
  const matchCount = DATA.filter(s => match(s, draft).score >= 70).length

  // Progress
  const progress = ((step + 1) / 4) * 100

  const slideVariants = {
    initial: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25 } }),
  }

  return (
    <motion.div
      className="mx-auto max-w-xl"
      variants={prefersReduced ? undefined : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold outline-none">
        Build your profile
      </h1>
      <p className="mt-2 text-soft">
        Takes about 2 minutes. We use this to match you with scholarships. You can skip any step and come back later.
      </p>

      {/* Progress bar */}
      <div className="mt-6 mb-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={4} aria-label={`Step ${step + 1} of 4: ${STEP_LABELS[step]}`}>
        <div className="flex justify-between text-sm mb-1">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={cn(
                'font-medium',
                i <= step ? 'text-teal' : 'text-soft'
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-line overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-teal"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: prefersReduced ? 0 : 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="mt-8 min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={prefersReduced ? undefined : slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">What are you studying?</h2>
              <SelectField
                id="ob-level"
                label="Study level"
                value={draft.level}
                onChange={e => update({ level: e.target.value })}
                options={LV}
                error={errors.level}
              />
              <SelectField
                id="ob-field"
                label="Field of study"
                value={draft.field}
                onChange={e => update({ field: e.target.value })}
                options={FD}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={prefersReduced ? undefined : slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">A little about you</h2>
              <SelectField
                id="ob-cat"
                label="Category"
                value={draft.cat}
                onChange={e => update({ cat: e.target.value })}
                options={CT}
              />
              <div>
                <label htmlFor="ob-gender" className="mb-1 block text-sm font-medium">
                  Gender
                </label>
                <select
                  id="ob-gender"
                  className="field"
                  value={draft.gender}
                  onChange={e => update({ gender: e.target.value as Profile['gender'] })}
                >
                  <option value="">Prefer not to say</option>
                  <option value="f">Female</option>
                  <option value="m">Male</option>
                </select>
              </div>
              <SelectField
                id="ob-state"
                label="State"
                value={draft.state}
                onChange={e => update({ state: e.target.value })}
                options={ST}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={prefersReduced ? undefined : slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">Money and marks</h2>
              <p className="text-sm text-soft">
                These help us filter income-based and merit-based scholarships. Leave blank if you are not sure.
              </p>
              <InputField
                id="ob-income"
                label="Family income per year (₹)"
                type="number"
                min={0}
                value={draft.income ?? ''}
                onChange={numChange('income')}
                placeholder="e.g. 400000"
              />
              <InputField
                id="ob-pct"
                label="Last exam percentage"
                type="number"
                min={0}
                max={100}
                value={draft.pct ?? ''}
                onChange={numChange('pct')}
                placeholder="e.g. 78"
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={prefersReduced ? undefined : fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">You are all set</h2>

              <div className="rounded-xl border border-line bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReviewItem label="Study level" value={draft.level} />
                  <ReviewItem label="Field" value={draft.field} />
                  <ReviewItem label="Category" value={draft.cat} />
                  <ReviewItem label="Gender" value={draft.gender === 'f' ? 'Female' : draft.gender === 'm' ? 'Male' : ''} />
                  <ReviewItem label="State" value={draft.state} />
                  <ReviewItem label="Family income" value={draft.income ? `₹${draft.income.toLocaleString('en-IN')}` : ''} />
                  <ReviewItem label="Percentage" value={draft.pct ? `${draft.pct}%` : ''} />
                </div>
              </div>

              <div className="rounded-xl bg-teal/10 p-5 text-center">
                <p className="font-head text-3xl font-bold text-teal">{matchCount}</p>
                <p className="text-sm font-medium text-teal">
                  scholarship{matchCount === 1 ? '' : 's'} match your profile
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={goBack}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:bg-white min-h-[44px]"
          >
            Back
          </button>
        )}
        <div className="flex-1" />
        {step < 3 && step > 0 && (
          <button
            onClick={skip}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-soft hover:text-ink min-h-[44px]"
          >
            Skip
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={goNext}
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-teal/90 min-h-[44px]"
          >
            Next
          </button>
        ) : (
          <button
            onClick={finish}
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-teal/90 min-h-[44px]"
          >
            See my scholarships
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-soft">
        Already have a profile?{' '}
        <Link to="/discover" className="underline text-teal">
          Skip to discover
        </Link>
      </p>
    </motion.div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-soft">{label}</p>
      <p className="font-medium">{value || <span className="text-soft italic">Not set</span>}</p>
    </div>
  )
}
