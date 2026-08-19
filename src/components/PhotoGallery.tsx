'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useGalleryWheelNav } from '@/hooks/useGalleryWheelNav'

const SWIPE_RATIO = 0.16
const SWIPE_MIN_PX = 48

export type PhotoGalleryItem = {
  id: string
  src: string
  position?: string
}

export default function PhotoGallery({
  photos,
  captions,
  label,
  prevLabel,
  nextLabel,
  showCaption = false,
}: {
  photos: readonly PhotoGalleryItem[]
  captions: readonly string[]
  label: string
  prevLabel: string
  nextLabel: string
  showCaption?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [instant, setInstant] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const drag = useRef<{ id: number; x: number; dx: number } | null>(null)
  const count = photos.length
  indexRef.current = index

  const goTo = useCallback((next: number) => {
    const wrapped = (next + count) % count
    if (wrapped === indexRef.current) return
    if (Math.abs(wrapped - indexRef.current) !== 1) setInstant(true)
    setIndex(wrapped)
  }, [count])

  const go = useCallback((delta: number) => {
    goTo(indexRef.current + delta)
  }, [goTo])

  useGalleryWheelNav({
    targetRef: rootRef,
    indexRef,
    count,
    getWidth: () => viewportRef.current?.clientWidth ?? 0,
    onOffset: (offset, active) => {
      setDragging(active)
      setDragX(offset)
    },
    onIndex: goTo,
    blocked: () => drag.current !== null,
  })

  useEffect(() => {
    if (!instant) return
    const id = window.requestAnimationFrame(() => setInstant(false))
    return () => window.cancelAnimationFrame(id)
  }, [instant])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      goTo(count - 1)
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = { id: event.pointerId, x: event.clientX, dx: 0 }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return
    const dx = event.clientX - drag.current.x
    const atStart = indexRef.current === 0 && dx > 0
    const atEnd = indexRef.current === count - 1 && dx < 0
    drag.current.dx = dx
    setDragX(atStart || atEnd ? dx * 0.28 : dx)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId) return
    const dx = drag.current.dx
    const width = viewportRef.current?.clientWidth ?? 1
    drag.current = null
    setDragging(false)
    setDragX(0)
    if (Math.abs(dx) < Math.max(SWIPE_MIN_PX, width * SWIPE_RATIO)) return
    go(dx < 0 ? 1 : -1)
  }

  return (
    <motion.div
      ref={rootRef}
      className="mk-now-gallery"
      tabIndex={0}
      data-lenis-prevent
      onKeyDown={onKeyDown}
      whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,.35)' }}
      aria-roledescription="carousel"
      aria-label={label}
    >
      {showCaption ? (
        <p className="mk-now-gallery-caption" aria-live="polite">{captions[index]}</p>
      ) : null}
      <div className="mk-now-gallery-frame">
        <div
          ref={viewportRef}
          className="mk-now-gallery-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onLostPointerCapture={onPointerUp}
        >
          <div
            className={`mk-now-gallery-track${dragging || instant ? ' instant' : ''}`}
            style={{ transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)` }}
          >
            {photos.map((item, i) => (
              <figure key={item.id}>
                <Image
                  src={item.src}
                  alt={captions[i] ?? ''}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectPosition: item.position }}
                  draggable={false}
                />
              </figure>
            ))}
          </div>
        </div>
        <button type="button" className="mk-now-gallery-nav prev" aria-label={prevLabel} onClick={() => go(-1)}>
          <ChevronLeft />
        </button>
        <button type="button" className="mk-now-gallery-nav next" aria-label={nextLabel} onClick={() => go(1)}>
          <ChevronRight />
        </button>
        <div className="mk-now-gallery-dots" role="group">
          {photos.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={captions[i]}
              aria-current={i === index ? 'true' : undefined}
              className={i === index ? 'active' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
