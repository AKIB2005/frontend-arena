import { motion, useReducedMotion } from 'framer-motion'
import { useApp } from '../store'
import { type Profile } from '../match'
import { ProfileForm } from '../components/ProfileForm'
import { pageVariants } from '../lib/motion'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const { profile, setProfile } = useApp()
  const prefersReduced = useReducedMotion()
  const hasProfile = !!(profile.level || profile.field)

  const clearProfile = () => {
    setProfile({
      name: '',
      level: '',
      field: '',
      cat: '',
      gender: '' as Profile['gender'],
      state: '',
      income: null,
      pct: null,
    })
  }

  return (
    <motion.div
      className="mx-auto max-w-3xl"
      variants={prefersReduced ? undefined : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1 className="text-3xl font-extrabold">Your profile</h1>
      <p className="mt-2 text-soft">
        Update your details to keep your match scores accurate. Changes apply instantly.
      </p>

      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <ProfileForm />
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/discover"
          className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-teal/90 min-h-[44px] inline-flex items-center"
        >
          See my scholarships
        </Link>
        {hasProfile && (
          <button
            onClick={clearProfile}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-rose hover:bg-rose/5 min-h-[44px]"
          >
            Clear profile
          </button>
        )}
      </div>
    </motion.div>
  )
}
