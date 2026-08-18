'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

function syncVisualViewport() {
  const viewport = window.visualViewport
  const height = viewport?.height ?? window.innerHeight
  const bottom = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0
  const root = document.documentElement.style
  root.setProperty('--mk-vvh', `${height}px`)
  root.setProperty('--mk-vv-bottom', `${bottom}px`)
}

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

  useEffect(() => {
    syncVisualViewport()
    window.addEventListener('resize', syncVisualViewport)
    window.visualViewport?.addEventListener('resize', syncVisualViewport)
    window.visualViewport?.addEventListener('scroll', syncVisualViewport)
    return () => {
      window.removeEventListener('resize', syncVisualViewport)
      window.visualViewport?.removeEventListener('resize', syncVisualViewport)
      window.visualViewport?.removeEventListener('scroll', syncVisualViewport)
    }
  }, [])

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
