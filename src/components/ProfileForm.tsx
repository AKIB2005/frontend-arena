import {useApp} from '../store'
import type {FieldKey} from '../lib/hints'
import {CT, FD, GENDERS, LV, ST} from '../lib/options'
import {ChoiceGroup, Select, TextInput} from './ui/Field'

type Props = {fields: FieldKey[]; errors?: Partial<Record<FieldKey, string>>; levelRef?: (el: HTMLInputElement | null) => void}

const asOpts = (a: string[]) => a.map(v => ({value: v, label: v}))

/** Renders any subset of the profile fields. Each field saves to the store as you type. */
export function ProfileForm({fields, errors = {}, levelRef}: Props) {
  const {profile: p, setProfile} = useApp()
  const num = (k: 'income' | 'pct') => (v: string) => setProfile({[k]: v === '' ? null : Number(v)})
  const show = (k: FieldKey) => fields.includes(k)
  const pctError = errors.pct ?? (p.pct !== null && (p.pct < 0 || p.pct > 100) ? 'Enter a percentage between 0 and 100.' : undefined)
  const incError = errors.income ?? (p.income !== null && p.income < 0 ? 'Income cannot be negative.' : undefined)
  return (
    <div className="space-y-6">
      {show('level') && <ChoiceGroup legend="Study level" name="level" options={asOpts(LV)} value={p.level} onChange={v => setProfile({level: v})} error={errors.level} firstRef={levelRef} />}
      {show('field') && <ChoiceGroup legend="Field of study" name="field" options={asOpts(FD)} value={p.field} onChange={v => setProfile({field: v})} error={errors.field} />}
      {show('cat') && <ChoiceGroup legend="Category" name="cat" options={asOpts(CT)} value={p.cat} onChange={v => setProfile({cat: v})} hint="Used only for scholarships with category rules." />}
      {show('gender') && <ChoiceGroup legend="Gender" name="gender" options={GENDERS} value={p.gender} onChange={v => setProfile({gender: v as typeof p.gender})} hint="Some scholarships are open to women applicants only." />}
      {show('state') && <Select label="State" options={ST} value={p.state} onChange={e => setProfile({state: e.target.value})} placeholder="Select your state" wrapClass="max-w-sm" />}
      {show('income') && <TextInput label="Family income per year (₹)" type="number" inputMode="numeric" min={0} value={p.income ?? ''} onChange={e => num('income')(e.target.value)} placeholder="e.g. 400000" error={incError} hint="Leave blank if you are not sure. We will not count it against you." wrapClass="max-w-sm" />}
      {show('pct') && <TextInput label="Last exam percentage" type="number" inputMode="decimal" min={0} max={100} value={p.pct ?? ''} onChange={e => num('pct')(e.target.value)} placeholder="e.g. 78" error={pctError} wrapClass="max-w-sm" />}
    </div>
  )
}
