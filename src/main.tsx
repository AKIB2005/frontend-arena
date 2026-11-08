import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { useUI } from './lib/ui-store'
import './index.css'

/** Follows the device setting until the person picks one in the header. */
function MotionRoot({ children }: { children: React.ReactNode }) {
  const choice = useUI((s) => s.reduceMotion)
  const mode = choice === null ? 'user' : choice ? 'always' : 'never'
  return <MotionConfig reducedMotion={mode}>{children}</MotionConfig>
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionRoot>
  </React.StrictMode>,
)
