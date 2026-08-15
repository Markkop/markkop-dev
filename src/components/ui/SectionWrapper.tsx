'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function SectionWrapper({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48, clipPath: 'inset(12% 0 0 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -60px 0px' }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay,
        opacity: { duration: 0.55 },
        clipPath: { duration: 0.65, delay: delay + 0.05 },
      }}
    >
      {children}
    </motion.div>
  )
}
