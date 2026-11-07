import {
  Component,
  lazy,
  Suspense,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ButtonLink } from './components/ui/Button'
import { Card } from './components/ui/Card'
import { useApp } from './store'
const Compare = lazy(() => import('./pages/Compare'))
const Detail = lazy(() => import('./pages/Detail'))
const Discover = lazy(() => import('./pages/Discover'))
const Home = lazy(() => import('./pages/Home'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Profile = lazy(() => import('./pages/Profile'))
const Tracker = lazy(() => import('./pages/Tracker'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Grantly route error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-extrabold">Something went sideways</h1>
        <p className="mb-5 mt-2 text-muted">
          Your profile is safe. Try loading this page again.
        </p>
        <ButtonLink to="/" onClick={() => this.setState({ hasError: false })}>
          Reset Grantly
        </ButtonLink>
      </Card>
    )
  }
}

function HomeGate() {
  const hasProfile = useApp((s) => Boolean(s.profile.level))
  return hasProfile ? <Navigate to="/dashboard" replace /> : <Home />
}

const NotFound = () => (
  <Card className="mx-auto max-w-xl text-center">
    <h1 className="text-3xl font-extrabold">That page does not exist</h1>
    <p className="mb-5 mt-2 text-muted">
      The link may be old. Let us get you back on track.
    </p>
    <ButtonLink to="/">Go to the home page</ButtonLink>
  </Card>
)

export default function App() {
  return (
    <Layout>
      <AppErrorBoundary>
        <Suspense
          fallback={
            <Card className="mx-auto max-w-xl">
              <p role="status" className="font-bold">
                Loading Grantly...
              </p>
            </Card>
          }
        >
          <Routes>
            <Route path="/" element={<HomeGate />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/s/:id" element={<Detail />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </Layout>
  )
}
