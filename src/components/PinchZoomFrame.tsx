'use client'

import { useRef, type ReactNode } from 'react'
import { useContainedPinchZoom } from '@/hooks/useContainedPinchZoom'

export default function PinchZoomFrame({
  children,
  className,
  scrollParent = false,
  resetKey,
}: {
  children: ReactNode
  className?: string
  scrollParent?: boolean
  resetKey?: string | number
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useContainedPinchZoom({ frameRef, contentRef, scrollParent, resetKey })

  return (
    <div
      ref={frameRef}
      className={['mk-pinch-zoom', scrollParent ? 'scroll' : null, className].filter(Boolean).join(' ')}
      data-lenis-prevent
    >
      <div ref={contentRef} className={`mk-pinch-zoom-content${scrollParent ? ' flow' : ''}`}>
        {children}
      </div>
    </div>
  )
}
