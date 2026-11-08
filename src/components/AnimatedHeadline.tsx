import { motion } from 'framer-motion'
import { staggerParent, useMotion, wordIn } from '../lib/motion'

/** Headline that pops in word by word. Screen readers get the plain text once. */
export function AnimatedHeadline({ text }: { text: string }) {
  const { reduce } = useMotion()
  if (reduce) return <>{text}</>
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="inline"
      >
        {text.split(' ').map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordIn}
            className="inline-block"
          >
            {word}
            {'\u00A0'}
          </motion.span>
        ))}
      </motion.span>
    </>
  )
}
