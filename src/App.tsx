import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Detail from './pages/Detail'
import Tracker from './pages/Tracker'
import Onboarding from './pages/Onboarding'
import ProfilePage from './pages/Profile'

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/s/:id" element={<Detail />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="*"
            element={
              <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
                <p className="font-bold">Page not found.</p>
                <p className="mt-1 text-soft">
                  <Link to="/" className="underline text-teal">
                    Go home
                  </Link>
                </p>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
