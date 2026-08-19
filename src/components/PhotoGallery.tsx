'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

const SWIPE_PX = 48

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
  const drag = useRef<{ id: number; x: number } | null>(null)
  const count = photos.length

  const go = useCallback((delta: number) => {
    setIndex((current) => (current + delta + count) % count)
  }, [count])

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
      setIndex(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      setIndex(count - 1)
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = { id: event.pointerId, x: event.clientX }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId) return
    const dx = event.clientX - drag.current.x
    drag.current = null
    if (Math.abs(dx) < SWIPE_PX) return
    go(dx < 0 ? 1 : -1)
  }

  return (
    <motion.div
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
          className="mk-now-gallery-stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current = null }}
        >
          {photos.map((item, i) => (
            <figure key={item.id} className={i === index ? 'active' : undefined} aria-hidden={i === index ? undefined : true}>
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
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
