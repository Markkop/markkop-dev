'use client'

import { useEffect, useRef, type RefObject } from 'react'

const DESKTOP_MEDIA = '(min-width: 1025px)'
const SETTLE_MS = 110
const SNAP_RATIO = 0.32
const SNAP_MIN_PX = 64
const EDGE_RESISTANCE = 0.28

function wrap(index: number, count: number) {
  return ((index % count) + count) % count
}

export function useGalleryWheelNav({
  targetRef,
  indexRef,
  count,
  getWidth,
  onOffset,
  onIndex,
  blocked,
}: {
  targetRef: RefObject<HTMLElement | null>
  indexRef: RefObject<number>
  count: number
  getWidth: () => number
  onOffset: (offset: number, active: boolean) => void
  onIndex: (index: number) => void
  blocked?: () => boolean
}) {
  const getWidthRef = useRef(getWidth)
  const onOffsetRef = useRef(onOffset)
  const onIndexRef = useRef(onIndex)
  const blockedRef = useRef(blocked)
  const countRef = useRef(count)
  getWidthRef.current = getWidth
  onOffsetRef.current = onOffset
  onIndexRef.current = onIndex
  blockedRef.current = blocked
  countRef.current = count

  useEffect(() => {
    const node = targetRef.current
    if (!node) return

    let offset = 0
    let settleTimer = 0
    let raf = 0

    const visualOffset = (index: number, x: number, total: number) => {
      const atStart = index === 0 && x > 0
      const atEnd = index === total - 1 && x < 0
      return atStart || atEnd ? x * EDGE_RESISTANCE : x
    }

    const commitIndex = (next: number) => {
      if (next === indexRef.current) return
      onIndexRef.current(next)
      indexRef.current = next
    }

    const consume = () => {
      const width = getWidthRef.current()
      const total = countRef.current
      if (width <= 0 || total <= 1) return
      let index = indexRef.current
      while (offset <= -width && index < total - 1) {
        offset += width
        index += 1
      }
      while (offset >= width && index > 0) {
        offset -= width
        index -= 1
      }
      if (index === 0 && offset > 0) offset = Math.min(offset, width)
      if (index === total - 1 && offset < 0) offset = Math.max(offset, -width)
      commitIndex(index)
    }

    const publish = (active: boolean) => {
      onOffsetRef.current(visualOffset(indexRef.current, offset, countRef.current), active)
    }

    const settle = () => {
      const width = getWidthRef.current()
      const total = countRef.current
      const index = indexRef.current
      const threshold = Math.max(SNAP_MIN_PX, width * SNAP_RATIO)
      let next = index
      if (offset <= -threshold) next = wrap(index + 1, total)
      else if (offset >= threshold) next = wrap(index - 1, total)
      offset = 0
      if (raf) {
        window.cancelAnimationFrame(raf)
        raf = 0
      }
      commitIndex(next)
      onOffsetRef.current(0, false)
    }

    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia(DESKTOP_MEDIA).matches) return
      if (event.ctrlKey || event.metaKey) return
      event.preventDefault()
      if (blockedRef.current?.()) return
      if ((event.target as Element | null)?.closest?.('[data-pinched]')) return
      if (countRef.current <= 1) return

      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      let delta = absX > absY ? event.deltaX : event.deltaY
      if (event.deltaMode === 1) delta *= 16
      else if (event.deltaMode === 2) delta *= getWidthRef.current() || 1

      offset -= delta
      consume()
      if (!raf) {
        raf = window.requestAnimationFrame(() => {
          raf = 0
          publish(true)
        })
      }
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, SETTLE_MS)
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      node.removeEventListener('wheel', onWheel)
      window.clearTimeout(settleTimer)
      window.cancelAnimationFrame(raf)
    }
  }, [indexRef, targetRef])
}
