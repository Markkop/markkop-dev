'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, Code2, ExternalLink, Github, Globe, Hand, Image as ImageIcon, Lock, RotateCw, Video } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import TextReveal from '@/components/ui/TextReveal'
import { useLanguage } from '@/context/LanguageContext'
import { projects, type Project, type ProjectMedia } from '@/data/profile'
import { techLogos } from '@/data/techLogos'
import { projectScrollTop } from '@/lib/projectScroll'

/** Fallback desktop width for the iframe before the preview has been measured. */
const EMBED_WIDTH = 1200
const MOBILE_EMBED_WIDTH = 390
const MOBILE_PROJECT_MEDIA = '(max-width: 1024px)'

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
  project,
  src,
  label,
  frameKey,
  frameLoaded,
  onFrameLoad,
}: {
  project: Project
  src: string
  label: string
  frameKey: number
  frameLoaded: boolean
  onFrameLoad: () => void
}) {
  const { t } = useLanguage()
  const scaleRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [embedSize, setEmbedSize] = useState({ width: EMBED_WIDTH, height: 800 })
  const [showFrame, setShowFrame] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [interacting, setInteracting] = useState(false)

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
      style={{ '--embed-scale': scale, '--embed-width': `${embedSize.width}px`, '--embed-height': `${embedSize.height}px` } as CSSProperties}
    >
      {project.image ? (
        <div className={`mk-simulator-poster${frameLoaded ? ' hidden' : ''}`}>
          <Image src={project.image} alt="" width={1200} height={800} sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      ) : null}
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
      <button type="button" className="mk-mobile-interact" onClick={() => setInteracting(true)}>
        <Hand aria-hidden="true" />
        <strong>{t.projects.tapToInteract}</strong>
        <small>{t.projects.tapToInteractHint}</small>
      </button>
      <button type="button" className="mk-mobile-interact-exit" onClick={() => setInteracting(false)}>
        {t.projects.exitPreview}
      </button>
      <span className="mk-hover-hint">🖱️ {t.projects.embedHint}</span>
    </div>
  )
}

function SimulatorPreview({ project, label }: { project: Project; label: string }) {
  const { t } = useLanguage()
  if (project.video) {
    return <video className="mk-simulator-video" src={project.video} poster={project.image} autoPlay muted loop playsInline aria-label={label} />
  }
  if (project.image) {
    return (
      <>
        <div className="mk-simulator-image"><Image src={project.image} alt={label} width={1200} height={2400} sizes="(max-width: 1024px) 100vw, 50vw" /></div>
        <span className="mk-hover-hint">🖱️ {t.projects.hoverPreview}</span>
      </>
    )
  }
  return <div className="mk-project-fallback"><Code2 size={44} /><strong>{project.title}</strong></div>
}

function SimulatorContainImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="mk-simulator-contain">
      <Image src={src} alt={label} fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'contain' }} />
    </div>
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

function MediaFavicon({ kind }: { kind: ProjectMedia['kind'] }) {
  if (kind === 'live') return <Globe aria-hidden="true" />
  if (kind === 'video') return <Video aria-hidden="true" />
  return <ImageIcon aria-hidden="true" />
}

function ProjectSimulator({ project, label, interactive = true }: { project: Project; label: string; interactive?: boolean }) {
  const { t } = useLanguage()
  const copy = t.projects.items[project.slug]
  const media = project.media ?? []
  const hasTabs = media.length > 1
  const [activeId, setActiveId] = useState(media[0]?.id ?? '')
  const [visited, setVisited] = useState<Set<string>>(() => new Set(media[0]?.id ? [media[0].id] : []))
  const [hovered, setHovered] = useState(false)
  const [embedState, setEmbedState] = useState<Record<string, { key: number; loaded: boolean; reloading: boolean }>>({})
  const fadeTimers = useRef<Record<string, number>>({})
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const embed = interactive && Boolean(project.embed)
  const activeMedia = media.find((item) => item.id === activeId) ?? media[0]
  const liveActive = !hasTabs || activeMedia?.kind === 'live'
  const activeEmbedId = liveActive ? (activeMedia?.id ?? 'live') : null
  const activeEmbed = activeEmbedId ? embedState[activeEmbedId] : undefined
  const canControl = embed && liveActive && Boolean(activeEmbed?.loaded)
  const href = liveUrl(project, liveActive ? activeMedia : undefined)
  const address = liveActive ? displayAddress(href) : (activeMedia?.src?.split('/').pop() ?? '')
  const hoverable = !embed && !hasTabs

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
    if (!embed) return <SimulatorPreview project={project} label={label} />
    const id = item?.id ?? 'live'
    const state = embedState[id] ?? { key: 0, loaded: false, reloading: false }
    return (
      <SimulatorEmbed
        project={project}
        src={liveUrl(project, item)}
        label={label}
        frameKey={state.key}
        frameLoaded={state.loaded}
        onFrameLoad={() => onFrameLoad(id)}
      />
    )
  }

  const renderMedia = (item: ProjectMedia, active: boolean) => {
    if (item.kind === 'live') return livePanel(item)
    if (item.kind === 'image' && item.src) return <SimulatorContainImage src={item.src} label={tabLabel(item)} />
    if (item.kind === 'video' && item.src) return <SimulatorVideo src={item.src} poster={project.image} label={tabLabel(item)} active={active} />
    return <SimulatorPreview project={project} label={label} />
  }

  return (
    <div
      className={`mk-simulator${hovered ? ' hovered' : ''}${embed ? ' embed' : ''}${hasTabs ? ' tabbed' : ''}`}
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
    >
      {hasTabs ? (
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
                <small>{tabLabel(item)}</small>
              </button>
            )
          })}
        </div>
      ) : null}
      <div className="mk-simulator-bar">
        {hasTabs ? null : <span className="dots"><i /><i /><i /></span>}
        <span className="controls">
          <button type="button" aria-label={t.projects.embedBack} disabled={!canControl} onClick={reloadPreview}><ArrowLeft /></button>
          <button type="button" aria-label={t.projects.embedForward} disabled><ArrowRight /></button>
          <button type="button" className={activeEmbed?.reloading ? 'reloading' : ''} aria-label={t.projects.embedReload} disabled={!canControl} onClick={reloadPreview}><RotateCw /></button>
        </span>
        <span className="address">
          {liveActive ? (
            <>
              <Lock aria-hidden="true" />
              <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <small>{address}</small>
                <ExternalLink />
              </a>
            </>
          ) : (
            <small>{address}</small>
          )}
        </span>
      </div>
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
        }) : livePanel()}
      </div>
    </div>
  )
}

function ProjectDetails({ project }: { project: Project }) {
  const { t } = useLanguage()
  const copy = t.projects.items[project.slug] ?? project
  return (
    <div className="mk-project-details">
      <div className="mk-project-badges"><span>{copy.category}</span><strong>{copy.metric}</strong></div>
      <h3>{project.title}</h3>
      <p>{copy.description}</p>
      <div className="mk-project-tech">{project.tech.map((tech) => <span key={tech}>{techLogos[tech] && <Image src={techLogos[tech]} alt="" width={13} height={13} />}<small>{tech}</small></span>)}</div>
      <div className="mk-project-role"><span>{copy.category}</span><i /><span>{copy.timeframe}</span></div>
      <div className="mk-project-actions">
        <a href={project.live} target="_blank" rel="noreferrer">{t.projects.visit}<ArrowRight size={14} /></a>
        {project.code && <a className="secondary" href={project.code} target="_blank" rel="noreferrer"><Github size={14} />{t.projects.source}</a>}
      </div>
    </div>
  )
}

export default function ProjectShowcase() {
  const { t } = useLanguage()
  const trackRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.max(0, Math.min(Math.floor(value * projects.length), projects.length - 1))
    if (next !== activeRef.current) { activeRef.current = next; setActive(next) }
  })

  const project = projects[active]
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
          '--project-mobile-track-height': `${(projects.length + 1) * 100}dvh`,
        } as CSSProperties}
      >
        <div className="mk-project-stage">
          <AnimatePresence mode="popLayout">
            <motion.div className="mk-project-background" key={project.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {project.video ? (
                <video src={project.video} poster={project.image} autoPlay muted loop playsInline />
              ) : project.image ? (
                <Image src={project.image} alt="" fill sizes="100vw" priority />
              ) : null}
              <i />
            </motion.div>
          </AnimatePresence>
          <motion.div className="mk-project-progress" style={{ width: progress }} />
          <div className="mk-project-topbar">
            <span><strong>{String(active + 1).padStart(2, '0')}</strong><i>/</i>{String(projects.length).padStart(2, '0')}</span>
            <div>{projects.map((item, index) => <button key={item.slug} className={index === active ? 'active' : ''} aria-label={t.projects.show(item.title)} onClick={() => {
              const track = trackRef.current
              if (!track) return
              window.scrollTo({ top: projectScrollTop(track, index, projects.length), behavior: 'smooth' })
            }}><i />{index === active && <small>{item.title}</small>}</button>)}</div>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.article className="mk-project-slide" key={project.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.25 }}>
              <ProjectDetails project={project} />
              <div className="mk-project-simulator"><ProjectSimulator project={project} label={t.projects.preview(project.title)} /></div>
            </motion.article>
          </AnimatePresence>
          <motion.div className="mk-project-cue" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}><small>{active < projects.length - 1 ? t.projects.scroll : t.projects.keepScrolling}</small><ChevronDown /></motion.div>
        </div>
      </div>
    </section>
  )
}
