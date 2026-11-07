import { useApp } from '../store'
import { type Profile } from '../match'
import { SelectField, InputField } from './ui/Field'

export const LV = ['Class 10-12', 'Undergraduate', 'Postgraduate', 'PhD']
export const FD = ['Engineering', 'Medicine', 'Science', 'Commerce', 'Arts', 'Law', 'Any']
export const CT = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority']
export const ST = ['Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh']

export function ProfileForm() {
  const { profile: p, setProfile } = useApp()
  const num = (k: 'income' | 'pct') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile({ [k]: e.target.value === '' ? null : Number(e.target.value) })

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SelectField id="lv" label="Study level" value={p.level} onChange={e => setProfile({ level: e.target.value })} options={LV} />
      <SelectField id="fd" label="Field of study" value={p.field} onChange={e => setProfile({ field: e.target.value })} options={FD} />
      <SelectField id="ct" label="Category" value={p.cat} onChange={e => setProfile({ cat: e.target.value })} options={CT} />
      <SelectField id="st" label="State" value={p.state} onChange={e => setProfile({ state: e.target.value })} options={ST} />
      <div>
        <label htmlFor="gn" className="mb-1 block text-sm font-medium">Gender</label>
        <select
          id="gn"
          className="field"
          value={p.gender}
          onChange={e => setProfile({ gender: e.target.value as Profile['gender'] })}
        >
          <option value="">Prefer not to say</option>
          <option value="f">Female</option>
          <option value="m">Male</option>
        </select>
      </div>
      <InputField
        id="inc"
        label="Family income per year (₹)"
        type="number"
        min={0}
        value={p.income ?? ''}
        onChange={num('income')}
        placeholder="e.g. 400000"
      />
      <InputField
        id="pc"
        label="Last exam percentage"
        type="number"
        min={0}
        max={100}
        value={p.pct ?? ''}
        onChange={num('pct')}
        placeholder="e.g. 78"
      />
    </div>
  )
}
