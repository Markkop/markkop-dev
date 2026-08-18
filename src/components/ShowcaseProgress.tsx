'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'

export default function ShowcaseProgress({
  progress,
  segments = 1,
}: {
  progress: MotionValue<number>
  segments?: number
}) {
  const local = useTransform(progress, (value) => {
    if (segments <= 1) return value
    const scaled = value * segments
    const index = Math.min(Math.floor(scaled), segments - 1)
    return scaled - index
  })

  return (
    <motion.div
      className="mk-showcase-progress"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 2,
        zIndex: 400,
        transformOrigin: 'top',
        background: 'var(--mk-accent)',
        boxShadow: '0 0 8px rgba(var(--mk-accent-rgb), .55)',
        pointerEvents: 'none',
        scaleY: local,
      }}
    />
  )
}
