'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function TextReveal({
  text,
  delay = 0,
  splitType = 'letter',
  className = '',
}: {
  text: string
  delay?: number
  splitType?: 'letter' | 'word'
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, margin: '-10%' })

  return (
    <span ref={ref} className={`mk-text-reveal ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {text.split(' ').map((word, wordIndex) => (
          <span className="mk-reveal-word" key={`${word}-${wordIndex}`}>
            {splitType === 'word' ? (
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={visible ? { y: 0, opacity: 1 } : undefined}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: delay + wordIndex * 0.05 }}
              >
                {word}
              </motion.span>
            ) : (
              word.split('').map((letter, letterIndex) => (
                <motion.span
                  key={`${letter}-${letterIndex}`}
                  initial={{ y: '100%', opacity: 0, rotateX: -90 }}
                  animate={visible ? { y: 0, opacity: 1, rotateX: 0 } : undefined}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: delay + wordIndex * 0.1 + letterIndex * 0.02,
                  }}
                >
                  {letter}
                </motion.span>
              ))
            )}
          </span>
        ))}
      </span>
    </span>
  )
}
