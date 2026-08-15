'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

function LenisSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(tick)
    }
  }, [lenis])

  return null
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, autoRaf: false }}>
      <LenisSync />
      {children}
    </ReactLenis>
  )
}
