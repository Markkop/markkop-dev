'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Code2, ExternalLink, Github, Globe, Image as ImageIcon, Lock, MonitorSmartphone, Pointer, RotateCw, Video } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import PinchZoomFrame from '@/components/PinchZoomFrame'
import TextReveal from '@/components/ui/TextReveal'
import ShowcaseProgress from '@/components/ShowcaseProgress'
import { useLanguage } from '@/context/LanguageContext'
import { projects, type Project, type ProjectGalleryImage, type ProjectMedia } from '@/data/profile'
import { invertOnLightLogos, techLogos } from '@/data/techLogos'
import { starAccentVars } from '@/data/starPalettes'
import { useGalleryWheelNav } from '@/hooks/useGalleryWheelNav'

const StarsBackground = dynamic(() => import('@/components/StarsBackground'), { ssr: false })

function subscribeTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

function getThemeSnapshot(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Fallback desktop width for the iframe before the preview has been measured. */
const EMBED_WIDTH = 1200
const MOBILE_EMBED_WIDTH = 390
const MOBILE_PROJECT_MEDIA = '(max-width: 1024px)'

function useMobileProjectMedia() {
  const [isMobile, setIsMobile] = useState(false)
  useLayoutEffect(() => {
    const media = window.matchMedia(MOBILE_PROJECT_MEDIA)
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return isMobile
}

function useDismissOnOutsidePointer(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    if (!active) return

    const dismiss = () => onDismissRef.current()
    const onClick = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return
      dismiss()
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('scroll', dismiss, { passive: true })
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('scroll', dismiss)
    }
  }, [active, containerRef])
}

function MobileInteractOverlay({ onEnter }: { onEnter: () => void }) {
  const { t } = useLanguage()
  return (
    <button type="button" className="mk-mobile-interact" onClick={onEnter}>
      <Pointer aria-hidden="true" />
      <strong>{t.projects.tapToInteract}</strong>
    </button>
  )
}

function liveUrl(project: Project, item?: ProjectMedia) {
  if (item?.kind === 'live' && item.src) return item.src
  return project.live
}

function displayAddress(href: string) {
  try {
    const url = new URL(href)
    const path = url.pathname === '/' ? '' : url.pathname
    return `${url.host}${path || (url.search ? '/' : '')}${url.search}`.replace(/\/$/, '')
  } catch {
    return href.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

function SimulatorEmbed({
  src,
  label,
  frameKey,
  frameLoaded,
  onFrameLoad,
}: {
  src: string
  label: string
  frameKey: number
  frameLoaded: boolean
  onFrameLoad: () => void
}) {
  const scaleRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [embedSize, setEmbedSize] = useState({ width: EMBED_WIDTH, height: 800 })
  const [showFrame, setShowFrame] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [interacting, setInteracting] = useState(false)
  useDismissOnOutsidePointer(interacting, scaleRef, () => setInteracting(false))

  useLayoutEffect(() => {
    const node = scaleRef.current
    if (!node) return
    const media = window.matchMedia(MOBILE_PROJECT_MEDIA)
    const update = () => {
      setIsMobile(media.matches)
      const width = node.clientWidth
      const height = node.clientHeight
      if (width <= 0 || height <= 0) return

      if (media.matches) {
        const nextScale = width / MOBILE_EMBED_WIDTH
        setScale(nextScale)
        setEmbedSize({ width: MOBILE_EMBED_WIDTH, height: height / nextScale })
        return
      }

      // Inner 100dvh / visualViewport often resolve against the top-level window, not the iframe.
      if (window.visualViewport && window.visualViewport.scale !== 1) return
      const outerHeight = window.visualViewport?.height ?? window.innerHeight
      if (outerHeight <= 0) return
      const nextScale = height / outerHeight
      setScale(nextScale)
      setEmbedSize({ width: width / nextScale, height: outerHeight })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
      media.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => setShowFrame(true), 400)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div
      ref={scaleRef}
      className={`mk-simulator-scale${interacting ? ' interacting' : ''}`}
      data-lenis-prevent={!isMobile || interacting ? true : undefined}
      aria-busy={!frameLoaded}
      style={{ '--embed-scale': scale, '--embed-width': `${embedSize.width}px`, '--embed-height': `${embedSize.height}px` } as CSSProperties}
    >
      <div className={`mk-simulator-loading${frameLoaded ? ' hidden' : ''}`} aria-hidden="true">
        <i />
      </div>
      {showFrame ? (
        <iframe
          key={frameKey}
          className={`mk-simulator-frame${frameLoaded ? ' ready' : ''}`}
          src={src}
          width={Math.round(embedSize.width)}
          height={Math.round(embedSize.height)}
          title={label}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={onFrameLoad}
        />
      ) : null}
      <MobileInteractOverlay onEnter={() => setInteracting(true)} />
    </div>
  )
}

function SimulatorScrollImage({ src, label }: { src: string; label: string }) {
  const isMobile = useMobileProjectMedia()
  const imageRef = useRef<HTMLDivElement>(null)
  const [interacting, setInteracting] = useState(false)
  useDismissOnOutsidePointer(interacting, imageRef, () => setInteracting(false))

  return (
    <div
      ref={imageRef}
      className={`mk-simulator-image${interacting ? ' interacting' : ''}`}
      data-lenis-prevent={!isMobile || interacting ? true : undefined}
    >
      <PinchZoomFrame scrollParent className="mk-pinch-zoom-scroll">
        <Image src={src} alt={label} width={1200} height={2400} sizes="(max-width: 1024px) 100vw, 50vw" style={{ width: '100%', height: 'auto' }} />
      </PinchZoomFrame>
      <MobileInteractOverlay onEnter={() => setInteracting(true)} />
    </div>
  )
}

function SimulatorPreview({ project, label, phone = false }: { project: Project; label: string; phone?: boolean }) {
  if (project.video) {
    return <video className="mk-simulator-video" src={project.video} poster={project.image} autoPlay muted loop playsInline aria-label={label} />
  }
  if (project.image) {
    const src = phone && project.imageMobile ? project.imageMobile : project.image
    return <SimulatorScrollImage key={src} src={src} label={label} />
  }
  return <div className="mk-project-fallback"><Code2 size={44} /><strong>{project.title}</strong></div>
}

function SimulatorContainImage({ src, srcMobile, label }: { src: string; srcMobile?: string; label: string }) {
  const isMobile = useMobileProjectMedia()
  const imageSrc = isMobile && srcMobile ? srcMobile : src
  return (
    <PinchZoomFrame className="mk-simulator-contain" resetKey={imageSrc}>
      <Image src={imageSrc} alt={label} fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'contain' }} />
    </PinchZoomFrame>
  )
}

function SimulatorVideo({ src, poster, label, active }: { src: string; poster?: string; label: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (active) void node.play()
    else node.pause()
  }, [active])
  return <video ref={ref} className="mk-simulator-video" src={src} poster={poster} muted loop playsInline aria-label={label} />
}

function SimulatorGallery({
  images,
  index,
  onIndexChange,
  caption,
  prevLabel,
  nextLabel,
}: {
  images: ProjectGalleryImage[]
  index: number
  onIndexChange: (index: number) => void
  caption: (id: string) => string
  prevLabel: string
  nextLabel: string
}) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(index)
  const drag = useRef<{ id: number; x: number; dx: number; captured?: boolean } | null>(null)
  const pointers = useRef(new Set<number>())
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [instant, setInstant] = useState(false)
  const slideCount = images.length
  indexRef.current = index

  const goTo = (next: number) => {
    const wrapped = (next + slideCount) % slideCount
    if (wrapped === indexRef.current) return
    if (Math.abs(wrapped - indexRef.current) !== 1) setInstant(true)
    onIndexChange(wrapped)
  }

  const go = (dir: -1 | 1) => goTo(indexRef.current + dir)

  useGalleryWheelNav({
    targetRef: galleryRef,
    indexRef,
    count: slideCount,
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

  const cancelDrag = () => {
    const current = drag.current
    drag.current = null
    setDragging(false)
    setDragX(0)
    if (current && viewportRef.current?.hasPointerCapture(current.id)) {
      viewportRef.current.releasePointerCapture(current.id)
    }
  }

  const endDrag = (event?: PointerEvent<HTMLDivElement>) => {
    if (event) pointers.current.delete(event.pointerId)
    if (!drag.current || (event && drag.current.id !== event.pointerId)) return
    const dx = drag.current.dx
    const width = viewportRef.current?.clientWidth ?? 1
    drag.current = null
    setDragging(false)
    setDragX(0)
    if (Math.abs(dx) < Math.max(48, width * 0.16)) return
    go(dx < 0 ? 1 : -1)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as Element).closest('[data-pinched]')) return
    if (event.isPrimary) pointers.current.clear()
    pointers.current.add(event.pointerId)
    if (pointers.current.size > 1) {
      cancelDrag()
      return
    }
    drag.current = { id: event.pointerId, x: event.clientX, dx: 0 }
    setDragging(true)
    if (event.pointerType !== 'touch') event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointers.current.size > 1) {
      cancelDrag()
      return
    }
    if (drag.current?.id !== event.pointerId) return
    const dx = event.clientX - drag.current.x
    if (!drag.current.captured && event.pointerType === 'touch' && Math.abs(dx) > 12) {
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current.captured = true
    }
    const atStart = indexRef.current === 0 && dx > 0
    const atEnd = indexRef.current === slideCount - 1 && dx < 0
    const next = atStart || atEnd ? dx * 0.28 : dx
    drag.current.dx = dx
    setDragX(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(slideCount - 1)
    }
  }

  const currentCaption = caption(images[index]?.id ?? '')

  return (
    <div
      ref={galleryRef}
      className="mk-simulator-gallery"
      tabIndex={0}
      data-lenis-prevent
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label={currentCaption}
    >
      <div className="mk-simulator-gallery-bar">
        <small key={images[index]?.id} aria-live="polite">{currentCaption}</small>
      </div>
      <div className="mk-simulator-gallery-stage">
        <div
          ref={viewportRef}
          className="mk-simulator-gallery-viewport"
          data-lenis-prevent
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        >
          <div
            className={`mk-simulator-gallery-track${dragging || instant ? ' instant' : ''}`}
            style={{ transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)` }}
          >
            {images.map((image, i) => (
              <figure key={image.id} className="mk-simulator-gallery-slide">
                <PinchZoomFrame className="mk-pinch-zoom-fill" resetKey={index}>
                  <Image
                    src={image.src}
                    alt={caption(image.id)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={Math.abs(i - index) <= 1}
                    draggable={false}
                  />
                </PinchZoomFrame>
              </figure>
            ))}
          </div>
        </div>
        <button type="button" className="mk-simulator-gallery-nav prev" aria-label={prevLabel} onClick={() => go(-1)}>
          <ChevronLeft />
        </button>
        <button type="button" className="mk-simulator-gallery-nav next" aria-label={nextLabel} onClick={() => go(1)}>
          <ChevronRight />
        </button>
        <div className="mk-simulator-gallery-dots" role="group">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              aria-label={caption(image.id)}
              aria-current={i === index ? 'true' : undefined}
              className={i === index ? 'active' : ''}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MediaFavicon({ kind }: { kind: ProjectMedia['kind'] }) {
  if (kind === 'live') return <Globe aria-hidden="true" />
  if (kind === 'video') return <Video aria-hidden="true" />
  return <ImageIcon aria-hidden="true" />
}

function ProjectSimulator({ project, label, interactive = true }: { project: Project; label: string; interactive?: boolean }) {
  const { t } = useLanguage()
  const isMobile = useMobileProjectMedia()
  const copy = t.projects.items[project.slug]
  const media = project.media ?? []
  const hasTabs = media.length > 1
  const [activeId, setActiveId] = useState(media[0]?.id ?? '')
  const [visited, setVisited] = useState<Set<string>>(() => new Set(media[0]?.id ? [media[0].id] : []))
  const [embedState, setEmbedState] = useState<Record<string, { key: number; loaded: boolean; reloading: boolean }>>({})
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [phonePreview, setPhonePreview] = useState(false)
  const fadeTimers = useRef<Record<string, number>>({})
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const embed = interactive && Boolean(project.embed)
  const canToggleDevice = Boolean(project.imageMobile)
  const showMobileImage = canToggleDevice && (isMobile !== phonePreview)
  const compactChrome = showMobileImage && !isMobile
  const activeMedia = media.find((item) => item.id === activeId) ?? media[0]
  const galleryImages = activeMedia?.kind === 'gallery' ? (activeMedia.images ?? []) : []
  const galleryActive = galleryImages.length > 0
  const liveActive = !galleryActive && (!hasTabs || activeMedia?.kind === 'live')
  const activeEmbedId = liveActive ? (activeMedia?.id ?? 'live') : null
  const activeEmbed = activeEmbedId ? embedState[activeEmbedId] : undefined
  const canControl = embed && liveActive && Boolean(activeEmbed?.loaded)
  const href = liveUrl(project, liveActive ? activeMedia : undefined)
  const galleryCaption = (id: string) => copy?.tabs?.[id] ?? galleryImages.find((image) => image.id === id)?.label ?? id
  const mediaSrc = isMobile && activeMedia?.srcMobile ? activeMedia.srcMobile : activeMedia?.src
  const address = liveActive ? displayAddress(href) : (mediaSrc?.split('/').pop() ?? '')

  useEffect(() => {
    setPhonePreview(false)
  }, [isMobile, project.slug])

  useEffect(() => () => {
    Object.values(fadeTimers.current).forEach((id) => window.clearTimeout(id))
  }, [])

  const selectTab = (id: string) => {
    setActiveId(id)
    setVisited((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  const reloadPreview = () => {
    if (!activeEmbedId) return
    const id = activeEmbedId
    setEmbedState((current) => ({
      ...current,
      [id]: { key: (current[id]?.key ?? 0) + 1, loaded: false, reloading: true },
    }))
  }

  const tabLabel = (item: ProjectMedia) => (
    copy?.tabs?.[item.id] ?? item.label ?? (item.kind === 'live' ? t.projects.livePreview : item.id)
  )

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = media.length - 1
    let next = index
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    selectTab(media[next].id)
    tabRefs.current[next]?.focus()
  }

  const onFrameLoad = (id: string) => {
    window.clearTimeout(fadeTimers.current[id])
    fadeTimers.current[id] = window.setTimeout(() => {
      setEmbedState((current) => ({
        ...current,
        [id]: { key: current[id]?.key ?? 0, loaded: true, reloading: false },
      }))
    }, 280)
  }

  const livePanel = (item?: ProjectMedia) => {
    if (!embed) return <SimulatorPreview project={project} label={label} phone={showMobileImage} />
    const id = item?.id ?? 'live'
    const state = embedState[id] ?? { key: 0, loaded: false, reloading: false }
    return (
      <SimulatorEmbed
        src={liveUrl(project, item)}
        label={label}
        frameKey={state.key}
        frameLoaded={state.loaded}
        onFrameLoad={() => onFrameLoad(id)}
      />
    )
  }

  const renderMedia = (item: ProjectMedia, active: boolean) => {
    if (item.kind === 'gallery' && item.images?.length) {
      return (
        <SimulatorGallery
          images={item.images}
          index={galleryIndex}
          onIndexChange={setGalleryIndex}
          caption={galleryCaption}
          prevLabel={t.projects.galleryPrev}
          nextLabel={t.projects.galleryNext}
        />
      )
    }
    if (item.kind === 'live') return livePanel(item)
    if (item.kind === 'image' && item.src) return <SimulatorContainImage src={item.src} srcMobile={item.srcMobile} label={tabLabel(item)} />
    if (item.kind === 'video' && item.src) return <SimulatorVideo src={item.src} poster={project.image} label={tabLabel(item)} active={active} />
    return <SimulatorPreview project={project} label={label} phone={showMobileImage} />
  }

  return (
    <div className={`mk-simulator${embed ? ' embed' : ''}${hasTabs ? ' tabbed' : ''}${galleryActive ? ' gallery' : ''}${compactChrome ? ' phone' : ''}`} data-slug={project.slug}>
      {galleryActive ? null : hasTabs ? (
        <div className="mk-simulator-tabs" role="tablist" aria-label={label}>
          <span className="dots"><i /><i /><i /></span>
          {media.map((item, index) => {
            const selected = item.id === activeId
            return (
              <button
                key={item.id}
                ref={(node) => { tabRefs.current[index] = node }}
                type="button"
                role="tab"
                id={`${project.slug}-tab-${item.id}`}
                aria-controls={`${project.slug}-panel-${item.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className={selected ? 'active' : ''}
                onClick={() => selectTab(item.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <MediaFavicon kind={item.kind} />
                <small>
                  {item.id === 'pitch' ? (
                    <>
                      <span className="mk-tab-wide">{tabLabel(item)}</span>
                      <span className="mk-tab-narrow">{t.projects.pitchShort}</span>
                    </>
                  ) : tabLabel(item)}
                </small>
              </button>
            )
          })}
        </div>
      ) : null}
      {galleryActive ? null : (
      <div className="mk-simulator-bar">
        {hasTabs ? null : <span className="dots"><i /><i /><i /></span>}
        <span className="controls">
          <button type="button" aria-label={t.projects.embedBack} disabled={!canControl} onClick={reloadPreview}><ArrowLeft /></button>
          <button type="button" className="forward" aria-label={t.projects.embedForward} disabled><ArrowRight /></button>
          <button type="button" className={activeEmbed?.reloading ? 'reloading' : ''} aria-label={t.projects.embedReload} disabled={!canControl} onClick={reloadPreview}><RotateCw /></button>
        </span>
        <span className="address">
          {liveActive ? (
            <>
              <Lock aria-hidden="true" />
              <a href={href} target="_blank" rel="noreferrer" aria-label={`${address} (${label})`}>
                <small>{address}</small>
              </a>
            </>
          ) : (
            <small>{address}</small>
          )}
        </span>
        {canToggleDevice ? (
          <button
            type="button"
            className="device"
            aria-label={showMobileImage ? t.projects.showDesktopPreview : t.projects.showMobilePreview}
            aria-pressed={showMobileImage}
            onClick={() => setPhonePreview((current) => !current)}
          >
            <MonitorSmartphone />
          </button>
        ) : null}
      </div>
      )}
      <div className="mk-simulator-screen">
        {hasTabs ? media.map((item) => {
          const selected = item.id === activeId
          if (!selected && !visited.has(item.id)) return null
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`${project.slug}-panel-${item.id}`}
              aria-labelledby={`${project.slug}-tab-${item.id}`}
              hidden={!selected}
              inert={!selected ? true : undefined}
              className="mk-simulator-panel"
            >
              {renderMedia(item, selected)}
            </div>
          )
        }) : (activeMedia ? renderMedia(activeMedia, true) : livePanel())}
      </div>
    </div>
  )
}

const ROOT_ACCENT_VARS = ['--mk-accent', '--mk-accent-rgb', '--mk-accent-deep', '--mk-accent-ink'] as const

function applyRootAccent(slug: string, theme: 'dark' | 'light') {
  const root = document.documentElement.style
  const vars = starAccentVars(slug, theme)
  for (const key of ROOT_ACCENT_VARS) root.setProperty(key, vars[key])
}

function clearRootAccent() {
  const root = document.documentElement.style
  for (const key of ROOT_ACCENT_VARS) root.removeProperty(key)
}

function ProjectDetails({ project }: { project: Project }) {
  const { t } = useLanguage()
  const copy = t.projects.items[project.slug] ?? project
  return (
    <div className="mk-project-details">
      <div className="mk-project-badges"><span>{copy.category}</span><strong>{copy.metric}</strong></div>
      <div className="mk-project-heading">
        <h3>
          {project.title}
          <span className="mk-project-heading-links">
            <a href={project.live} target="_blank" rel="noreferrer" aria-label={t.projects.visit}><ExternalLink size={18} aria-hidden="true" /></a>
            {project.code && <a href={project.code} target="_blank" rel="noreferrer" aria-label={t.projects.source}><Github size={18} aria-hidden="true" /></a>}
          </span>
        </h3>
      </div>
      <p>{copy.description}</p>
      <div className="mk-project-tech">{project.tech.map((tech) => <span key={tech}>{techLogos[tech] && <Image className={invertOnLightLogos.has(tech) ? 'mk-tech-invert' : undefined} src={techLogos[tech]} alt="" width={13} height={13} />}<small>{tech}</small></span>)}</div>
      <div className="mk-project-actions">
        <a href={project.live} target="_blank" rel="noreferrer">{t.projects.visit}<ArrowRight size={14} /></a>
        {project.code && <a className="secondary" href={project.code} target="_blank" rel="noreferrer"><Github size={14} />{t.projects.source}</a>}
      </div>
    </div>
  )
}

export default function ProjectShowcase() {
  const { t } = useLanguage()
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark' as const)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [starsReady, setStarsReady] = useState(false)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.max(0, Math.min(Math.floor(value * projects.length), projects.length - 1))
    if (next !== activeRef.current) { activeRef.current = next; setActive(next) }
  })

  const project = projects[active]
  const accentVars = starAccentVars(project.slug, theme) as CSSProperties
  const progressVisible = useRef(false)

  useEffect(() => {
    const root = document.getElementById('projects')
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setStarsReady(true)
      observer.disconnect()
    }, { rootMargin: '200px 0px' })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new IntersectionObserver(([entry]) => {
      progressVisible.current = entry.isIntersecting
      if (!entry.isIntersecting) {
        clearRootAccent()
        return
      }
      applyRootAccent(
        projects[activeRef.current].slug,
        document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
      )
    }, { rootMargin: '0px 0px -50% 0px', threshold: 0 })
    observer.observe(track)
    return () => {
      observer.disconnect()
      progressVisible.current = false
      clearRootAccent()
    }
  }, [])

  useEffect(() => {
    if (!progressVisible.current) return
    applyRootAccent(project.slug, theme)
  }, [project.slug, theme])

  return (
    <section id="projects" className="mk-projects-root">
      <div className="mk-project-intro mk-section-dark">
        <h2><TextReveal text={t.projects.title} /><span><TextReveal text={t.projects.titleHighlight} delay={0.4} /></span></h2>
        <p><ChevronDown />{t.projects.scroll}</p>
      </div>
      <div
        className="mk-project-track"
        ref={trackRef}
        style={{
          '--project-track-height': `${projects.length * 100}vh`,
          '--project-count': projects.length,
        } as CSSProperties}
      >
        <div className="mk-project-stage" style={accentVars}>
          {starsReady ? <StarsBackground slug={project.slug} /> : null}
          <ShowcaseProgress progress={scrollYProgress} segments={projects.length} />
          <AnimatePresence mode="popLayout">
            <motion.article className="mk-project-slide" key={project.slug} style={accentVars} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.25 }}>
              <ProjectDetails project={project} />
              <div className="mk-project-simulator"><ProjectSimulator project={project} label={t.projects.preview(project.title)} /></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
