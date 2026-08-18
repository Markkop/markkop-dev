'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, Code2, ExternalLink, Github, Globe, Image as ImageIcon, Lock, RotateCw, Video } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import TextReveal from '@/components/ui/TextReveal'
import { useLanguage } from '@/context/LanguageContext'
import { projects, type Project, type ProjectMedia } from '@/data/profile'
import { techLogos } from '@/data/techLogos'

/** Virtual desktop size inside the iframe. Higher = more desktop layout, smaller UI in the frame. */
const EMBED_WIDTH = 1200
const EMBED_HEIGHT = 900

function SimulatorEmbed({
  project,
  label,
  frameKey,
  frameLoaded,
  onFrameLoad,
}: {
  project: Project
  label: string
  frameKey: number
  frameLoaded: boolean
  onFrameLoad: () => void
}) {
  const { t } = useLanguage()
  const scaleRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [showFrame, setShowFrame] = useState(false)

  useLayoutEffect(() => {
    const node = scaleRef.current
    if (!node) return
    const update = () => {
      const width = node.clientWidth
      if (width > 0) setScale(width / EMBED_WIDTH)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => setShowFrame(true), 400)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div
      ref={scaleRef}
      className="mk-simulator-scale"
      data-lenis-prevent
      style={{ '--embed-scale': scale, '--embed-width': `${EMBED_WIDTH}px`, '--embed-height': `${EMBED_HEIGHT}px` } as CSSProperties}
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
          src={project.live}
          width={EMBED_WIDTH}
          height={EMBED_HEIGHT}
          title={label}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={onFrameLoad}
        />
      ) : null}
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
  const [hovered, setHovered] = useState(false)
  const [frameKey, setFrameKey] = useState(0)
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [reloading, setReloading] = useState(false)
  const fadeTimer = useRef(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const embed = interactive && Boolean(project.embed)
  const activeMedia = media.find((item) => item.id === activeId) ?? media[0]
  const liveActive = !hasTabs || activeMedia?.kind === 'live'
  const canControl = embed && frameLoaded && liveActive
  const domain = project.live.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const address = liveActive ? domain : (activeMedia?.src?.split('/').pop() ?? '')
  const hoverable = !embed && !hasTabs

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const reloadPreview = () => {
    setReloading(true)
    setFrameLoaded(false)
    setFrameKey((key) => key + 1)
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
    setActiveId(media[next].id)
    tabRefs.current[next]?.focus()
  }

  const onFrameLoad = () => {
    window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => {
      setFrameLoaded(true)
      setReloading(false)
    }, 280)
  }

  const livePanel = embed ? (
    <SimulatorEmbed
      project={project}
      label={label}
      frameKey={frameKey}
      frameLoaded={frameLoaded}
      onFrameLoad={onFrameLoad}
    />
  ) : (
    <SimulatorPreview project={project} label={label} />
  )

  const renderMedia = (item: ProjectMedia, active: boolean) => {
    if (item.kind === 'live') return livePanel
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
                onClick={() => setActiveId(item.id)}
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
          <button type="button" className={reloading ? 'reloading' : ''} aria-label={t.projects.embedReload} disabled={!canControl} onClick={reloadPreview}><RotateCw /></button>
        </span>
        <span className="address">
          {liveActive ? (
            <>
              <Lock aria-hidden="true" />
              <a href={project.live} target="_blank" rel="noreferrer" aria-label={label}>
                <small>{domain}</small>
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
        }) : livePanel}
      </div>
    </div>
  )
}

function ProjectDetails({ project, index, mobile = false }: { project: Project; index: number; mobile?: boolean }) {
  const { t } = useLanguage()
  const copy = t.projects.items[project.slug] ?? project
  return (
    <div className="mk-project-details">
      {mobile && <small className="mk-project-index">{String(index + 1).padStart(2, '0')}</small>}
      <div className="mk-project-badges"><span>{copy.category}</span><strong>{copy.metric}</strong></div>
      <h3>{project.title}</h3>
      <p>{copy.description}</p>
      {!mobile && <div className="mk-project-tech">{project.tech.map((tech) => <span key={tech}>{techLogos[tech] && <Image src={techLogos[tech]} alt="" width={13} height={13} />}<small>{tech}</small></span>)}</div>}
      {!mobile && <div className="mk-project-role"><span>{copy.category}</span><i /><span>{copy.timeframe}</span></div>}
      {!mobile && (
        <div className="mk-project-actions">
          <a href={project.live} target="_blank" rel="noreferrer">{t.projects.visit}<ArrowRight size={14} /></a>
          {project.code && <a className="secondary" href={project.code} target="_blank" rel="noreferrer"><Github size={14} />{t.projects.source}</a>}
        </div>
      )}
    </div>
  )
}

function MobileProject({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage()
  return (
    <motion.article className="mk-mobile-project" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <ProjectDetails project={project} index={index} mobile />
      <div className="mk-mobile-simulator"><ProjectSimulator project={project} label={t.projects.preview(project.title)} interactive={false} /></div>
      <div className="mk-project-tech">{project.tech.map((tech) => <span key={tech}>{techLogos[tech] && <Image src={techLogos[tech]} alt="" width={11} height={11} />}<small>{tech}</small></span>)}</div>
      <div className="mk-project-actions mobile">
        <a href={project.live} target="_blank" rel="noreferrer">{t.projects.visit}<ArrowRight size={14} /></a>
        {project.code && <a className="secondary" href={project.code} target="_blank" rel="noreferrer"><Github size={14} />{t.projects.source}</a>}
      </div>
    </motion.article>
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
      <div className="mk-projects-mobile mk-section-dark">
        <header className="mk-project-heading"><h2><TextReveal text={`${t.projects.title} ${t.projects.titleHighlight}`} /></h2></header>
        <div>{projects.map((item, index) => <MobileProject project={item} index={index} key={item.slug} />)}</div>
      </div>
      <div className="mk-project-intro mk-section-dark">
        <h2><TextReveal text={t.projects.title} /><span><TextReveal text={t.projects.titleHighlight} delay={0.4} /></span></h2>
        <p><ChevronDown />{t.projects.scroll}</p>
      </div>
      <div className="mk-project-track" ref={trackRef} style={{ height: `${projects.length * 100}vh` }}>
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
              const distance = track.offsetHeight - innerHeight
              window.scrollTo({ top: track.offsetTop + (index / Math.max(projects.length - 1, 1)) * distance, behavior: 'smooth' })
            }}><i />{index === active && <small>{item.title}</small>}</button>)}</div>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.article className="mk-project-slide" key={project.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.25 }}>
              <ProjectDetails project={project} index={active} />
              <div className="mk-project-simulator"><ProjectSimulator project={project} label={t.projects.preview(project.title)} /></div>
            </motion.article>
          </AnimatePresence>
          <motion.div className="mk-project-cue" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}><small>{active < projects.length - 1 ? t.projects.scroll : t.projects.keepScrolling}</small><ChevronDown /></motion.div>
        </div>
      </div>
    </section>
  )
}
