'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, Code2, ExternalLink, Github, Lock, RotateCw } from 'lucide-react'
import { useRef, useState } from 'react'
import TextReveal from '@/components/ui/TextReveal'
import { useLanguage } from '@/context/LanguageContext'
import { projects, type Project } from '@/data/profile'

const techLogos: Record<string, string> = {
  'Next.js': '/techstackicons/next.svg', React: '/techstackicons/react-svgrepo-com.svg', TypeScript: '/techstackicons/typescript-icon-svgrepo-com.svg',
  'Tailwind CSS': '/techstackicons/tailwindcss-icon-svgrepo-com.svg', 'Node.js': '/techstackicons/nodejs-icon-svgrepo-com.svg',
  PostgreSQL: '/techstackicons/postgresql-svgrepo-com.svg', Docker: '/techstackicons/docker-svgrepo-com.svg',
}

function ProjectSimulator({ project, label }: { project: Project; label: string }) {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState(false)
  const domain = project.live.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <div className={`mk-simulator${hovered ? ' hovered' : ''}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="mk-simulator-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="controls"><ArrowLeft /><ArrowRight /><RotateCw /></span>
        <span className="address"><Lock /><small>{domain}</small><a href={project.live} target="_blank" rel="noreferrer" aria-label={label}><ExternalLink /></a></span>
      </div>
      <div className="mk-simulator-screen">
        {project.image ? (
          <>
            <div className="mk-simulator-image"><Image src={project.image} alt={label} width={1200} height={2400} sizes="(max-width: 1024px) 100vw, 50vw" /></div>
            <span className="mk-hover-hint">🖱️ {t.projects.hoverPreview}</span>
          </>
        ) : (
          <div className="mk-project-fallback"><Code2 size={44} /><strong>{project.title}</strong></div>
        )}
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
      {!mobile && <div className="mk-project-tech">{project.tech.map((tech) => <span key={tech}>{techLogos[tech] && <Image src={techLogos[tech]} alt="" width={15} height={15} />}<small>{tech}</small></span>)}</div>}
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
      <div className="mk-mobile-simulator"><ProjectSimulator project={project} label={t.projects.preview(project.title)} /></div>
      <div className="mk-project-tech">{project.tech.map((tech) => <span key={tech}>{techLogos[tech] && <Image src={techLogos[tech]} alt="" width={13} height={13} />}<small>{tech}</small></span>)}</div>
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
              {project.image && <Image src={project.image} alt="" fill sizes="100vw" priority />}
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
