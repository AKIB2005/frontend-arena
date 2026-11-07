import {useApp} from '../store'
import {completeness, profileHints} from '../lib/hints'
import {ProfileForm} from '../components/ProfileForm'
import {SegmentedMeter} from '../components/SegmentedMeter'
import {ButtonLink} from '../components/ui/Button'
import {Card} from '../components/ui/Card'
import {TextInput} from '../components/ui/Field'

export default function Profile() {
  const {profile, setProfile} = useApp()
  const c = completeness(profile)
  const hints = profileHints(profile).slice(0, 4)
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <h1 className="text-4xl font-extrabold">Your profile</h1>
        <p className="mb-6 mt-2 text-muted">Changes save as you type and update every match score straight away.</p>
        <Card className="space-y-6">
          <TextInput label="Your name (optional)" value={profile.name} onChange={e => setProfile({name: e.target.value})} wrapClass="max-w-sm" />
          <ProfileForm fields={['level', 'field', 'cat', 'gender', 'state', 'income', 'pct']} />
        </Card>
      </div>
      <aside aria-label="Profile progress" className="space-y-5 lg:pt-[4.5rem]">
        <Card>
          <h2 className="text-xl font-extrabold">Profile completeness</h2>
          <SegmentedMeter className="my-3" value={c.filled} max={c.total} segments={c.total} label={`${c.filled} of ${c.total} details added`} />
          <p className="font-bold">{c.filled} of {c.total} details added</p>
          {hints.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">{hints.map(h => <li key={h.key} className="rounded-xl border-2 border-edge bg-accent p-2.5 font-medium text-inverse-text">{h.text}</li>)}</ul>
          ) : <p className="mt-2 text-sm text-muted">Every scholarship can be fully checked. Nice.</p>}
        </Card>
        <ButtonLink to="/discover" variant="primary" className="w-full">See my matches</ButtonLink>
        <ButtonLink to="/onboarding" variant="ghost" className="w-full">Use the guided setup</ButtonLink>
      </aside>
    </div>
  )
}
