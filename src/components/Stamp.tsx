import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../lib/ui-store'
import { useMotion } from '../lib/motion'

/** Rotated stamp that slams onto its (relative) parent. Announced by the toast, so it is aria-hidden. */
export function Stamp({ id }: { id: string }) {
  const label = useUI((s) => s.stamps[id])
  const { reduce, tr } = useMotion()
  return (
    <AnimatePresence>
      {label && (
        <motion.div
          key={label}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
          exit={{ opacity: 0, transition: tr({ duration: 0.12 }) }}
        >
          <motion.span
            style={{ rotate: -8 }}
            className="rounded-lg border-4 border-edge bg-accent px-4 py-1 font-head text-2xl font-extrabold text-on-accent"
            initial={
              reduce
                ? false
                : {
                    scale: 1.4,
                    opacity: 0,
                    boxShadow: '0px 0px 0 var(--shadow)',
                  }
            }
            animate={{
              scale: 1,
              opacity: 1,
              x: reduce ? 0 : [0, -4, 4, 0],
              boxShadow: '6px 6px 0 var(--shadow)',
            }}
            transition={tr({
              scale: { duration: 0.12, ease: 'easeIn' },
              opacity: { duration: 0.04 },
              boxShadow: { duration: 0.12 },
              x: { delay: 0.12, duration: 0.12, times: [0, 0.33, 0.66, 1] },
            })}
          >
            {label}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
