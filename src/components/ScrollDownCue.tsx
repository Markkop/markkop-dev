'use client'

import { useReducedMotion } from 'framer-motion'
import { LottieLight } from 'lottie-react'
import scrollDown from '@/assets/scroll-down.json'

export default function ScrollDownCue() {
  const reduceMotion = useReducedMotion()
  const play = reduceMotion !== true

  return (
    <LottieLight
      className="mk-loader-scroll"
      src={scrollDown}
      loop={play}
      autoplay={play}
      aria-hidden
    />
  )
}
