'use client'

import { useEffect, type RefObject } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 4
const SNAP_SCALE = 1.03
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_DIST = 28
const DOUBLE_TAP_SCALE = 2.2

type Point = { x: number; y: number }

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function touchPoint(touch: Touch): Point {
  return { x: touch.clientX, y: touch.clientY }
}

export function useContainedPinchZoom({
  frameRef,
  contentRef,
  resetKey,
  scrollParent = false,
}: {
  frameRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
  resetKey?: string | number
  scrollParent?: boolean
}) {
  useEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    let scale = 1
    let x = 0
    let y = 0
    let bakedScroll = false
    let pinched = false
    let didPinch = false
    let lastTap: { t: number; point: Point } | null = null
    let lastScrollY: number | null = null
    let pan: { x: number; y: number; originX: number; originY: number; pointerId: number } | null = null
    let pinch: { distance: number; scale: number; x: number; y: number; focal: Point; mid: Point } | null = null

    const originCenter = !scrollParent

    const apply = () => {
      content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      const nextPinched = scale > SNAP_SCALE
      if (nextPinched !== pinched) {
        pinched = nextPinched
        frame.toggleAttribute('data-pinched', pinched)
      }
    }

    const contentSize = () => ({
      width: Math.max(content.offsetWidth, frame.clientWidth),
      height: Math.max(content.offsetHeight, frame.clientHeight),
    })

    const clampPan = () => {
      const { width: contentWidth, height: contentHeight } = contentSize()
      const viewWidth = frame.clientWidth
      const viewHeight = frame.clientHeight
      if (originCenter) {
        const extraX = Math.max(0, (contentWidth * scale - viewWidth) / 2)
        const extraY = Math.max(0, (contentHeight * scale - viewHeight) / 2)
        x = clamp(x, -extraX, extraX)
        y = clamp(y, -extraY, extraY)
        return
      }
      x = clamp(x, Math.min(0, viewWidth - contentWidth * scale), 0)
      y = clamp(y, Math.min(0, viewHeight - contentHeight * scale), 0)
    }

    const bakeScroll = () => {
      if (!scrollParent || bakedScroll) return
      y -= frame.scrollTop
      frame.scrollTop = 0
      bakedScroll = true
    }

    const reset = () => {
      const restore = scrollParent && bakedScroll ? clamp(-y, 0, Math.max(0, frame.scrollHeight - frame.clientHeight)) : 0
      scale = 1
      x = 0
      y = 0
      bakedScroll = false
      pinch = null
      pan = null
      lastScrollY = null
      apply()
      if (scrollParent) frame.scrollTop = restore
    }

    const framePoint = (point: Point): Point => {
      const rect = frame.getBoundingClientRect()
      if (originCenter) {
        return { x: point.x - rect.left - rect.width / 2, y: point.y - rect.top - rect.height / 2 }
      }
      return {
        x: point.x - rect.left,
        y: point.y - rect.top + (bakedScroll ? 0 : frame.scrollTop),
      }
    }

    const zoomAround = (focal: Point, nextScale: number) => {
      const clamped = clamp(nextScale, MIN_SCALE, MAX_SCALE)
      x += focal.x * (scale - clamped)
      y += focal.y * (scale - clamped)
      scale = clamped
      clampPan()
      apply()
    }

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        lastTap = null
        lastScrollY = null
        pan = null
        didPinch = true
        bakeScroll()
        const a = touchPoint(event.touches[0])
        const b = touchPoint(event.touches[1])
        const mid = midpoint(a, b)
        pinch = {
          distance: distance(a, b),
          scale,
          x,
          y,
          mid,
          focal: framePoint(mid),
        }
        return
      }
      didPinch = false
      if (event.touches.length === 1) {
        const point = touchPoint(event.touches[0])
        if (scale > SNAP_SCALE) {
          pan = { pointerId: event.touches[0].identifier, x: point.x, y: point.y, originX: x, originY: y }
        } else if (scrollParent) {
          lastScrollY = point.y
        }
      }
    }

    const onTouchMove = (event: TouchEvent) => {
      if (pinch && event.touches.length >= 2) {
        event.preventDefault()
        const a = touchPoint(event.touches[0])
        const b = touchPoint(event.touches[1])
        const mid = midpoint(a, b)
        const next = pinch.scale * (distance(a, b) / pinch.distance)
        scale = pinch.scale
        x = pinch.x
        y = pinch.y
        zoomAround(pinch.focal, next)
        x += mid.x - pinch.mid.x
        y += mid.y - pinch.mid.y
        clampPan()
        apply()
        return
      }
      if (pan && event.touches.length === 1 && scale > SNAP_SCALE) {
        event.preventDefault()
        const point = touchPoint(event.touches[0])
        x = pan.originX + (point.x - pan.x)
        y = pan.originY + (point.y - pan.y)
        clampPan()
        apply()
        return
      }
      if (scrollParent && lastScrollY !== null && event.touches.length === 1 && scale <= SNAP_SCALE) {
        event.preventDefault()
        const point = touchPoint(event.touches[0])
        frame.scrollTop -= point.y - lastScrollY
        lastScrollY = point.y
      }
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) pinch = null
      if (event.touches.length === 0) {
        pan = null
        lastScrollY = null
      }
      if (event.touches.length > 0 || event.changedTouches.length === 0) return
      if (didPinch) {
        didPinch = false
        if (scale <= SNAP_SCALE) reset()
        return
      }
      if (scale > MIN_SCALE && scale <= SNAP_SCALE) {
        reset()
        return
      }
      const point = touchPoint(event.changedTouches[0])
      const now = performance.now()
      if (lastTap && now - lastTap.t < DOUBLE_TAP_MS && distance(point, lastTap.point) < DOUBLE_TAP_DIST) {
        lastTap = null
        bakeScroll()
        const focal = framePoint(point)
        if (scale > SNAP_SCALE) reset()
        else zoomAround(focal, DOUBLE_TAP_SCALE)
        return
      }
      lastTap = { t: now, point }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (scale <= SNAP_SCALE) return
      event.stopPropagation()
      if (event.pointerType === 'touch') return
      if (event.button !== 0) return
      pan = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, originX: x, originY: y }
      frame.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pan || pan.pointerId !== event.pointerId || event.pointerType === 'touch') return
      x = pan.originX + (event.clientX - pan.x)
      y = pan.originY + (event.clientY - pan.y)
      clampPan()
      apply()
    }

    const onPointerUp = (event: PointerEvent) => {
      if (pan?.pointerId === event.pointerId && event.pointerType !== 'touch') pan = null
    }

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      bakeScroll()
      const delta = event.deltaY > 0 ? 0.92 : 1.08
      zoomAround(framePoint({ x: event.clientX, y: event.clientY }), scale * delta)
      if (scale <= SNAP_SCALE) reset()
    }

    const onDoubleClick = (event: MouseEvent) => {
      event.preventDefault()
      bakeScroll()
      const focal = framePoint({ x: event.clientX, y: event.clientY })
      if (scale > SNAP_SCALE) reset()
      else zoomAround(focal, DOUBLE_TAP_SCALE)
    }

    apply()
    frame.addEventListener('touchstart', onTouchStart, { passive: true })
    frame.addEventListener('touchmove', onTouchMove, { passive: false })
    frame.addEventListener('touchend', onTouchEnd)
    frame.addEventListener('touchcancel', onTouchEnd)
    frame.addEventListener('pointerdown', onPointerDown)
    frame.addEventListener('pointermove', onPointerMove)
    frame.addEventListener('pointerup', onPointerUp)
    frame.addEventListener('pointercancel', onPointerUp)
    frame.addEventListener('wheel', onWheel, { passive: false })
    frame.addEventListener('dblclick', onDoubleClick)

    return () => {
      reset()
      frame.removeEventListener('touchstart', onTouchStart)
      frame.removeEventListener('touchmove', onTouchMove)
      frame.removeEventListener('touchend', onTouchEnd)
      frame.removeEventListener('touchcancel', onTouchEnd)
      frame.removeEventListener('pointerdown', onPointerDown)
      frame.removeEventListener('pointermove', onPointerMove)
      frame.removeEventListener('pointerup', onPointerUp)
      frame.removeEventListener('pointercancel', onPointerUp)
      frame.removeEventListener('wheel', onWheel)
      frame.removeEventListener('dblclick', onDoubleClick)
    }
  }, [contentRef, frameRef, resetKey, scrollParent])
}
