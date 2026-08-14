'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Code2, Github } from 'lucide-react'
import { useRef, useState } from 'react'
import { projects, type Project } from '@/data/profile'

function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className="project-browser">
      <div className="project-browser-bar">
        <span /><span /><span />
        <small>{project.live.replace(/^https?:\/\//, '').replace(/\/$/, '')}</small>
      </div>
      <div className="project-browser-body">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} project preview`}
            fill
            priority={priority}
            sizes="(max-width: 980px) 100vw, 56vw"
          />
        ) : (
          <div className="project-showcase-fallback">
            <Code2 size={44} />
            <strong>{project.title}</strong>
            <span>{project.category}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCopy({ project, index }: { project: Project; index: number }) {
  return (
    <div className="project-showcase-copy">
      <div className="project-showcase-meta">
        <span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <span>{project.category}</span>
        <strong>{project.metric}</strong>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-showcase-tags">
        {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
      </div>
      <div className="project-showcase-links">
        <a href={project.live} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={16} /></a>
        {project.code && (
          <a className="secondary" href={project.code} target="_blank" rel="noreferrer">
            <Github size={16} /> Source
          </a>
        )}
        <small>{project.timeframe}</small>
      </div>
    </div>
  )
}

export default function ProjectShowcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextIndex = Math.min(Math.floor(latest * projects.length), projects.length - 1)
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    }
  })

  const activeProject = projects[activeIndex]

  function goToProject(index: number) {
    const track = trackRef.current
    if (!track) return
    const availableDistance = track.offsetHeight - window.innerHeight
    const top = track.offsetTop + (index / Math.max(projects.length - 1, 1)) * availableDistance
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container project-showcase-intro">
        <motion.div
          className="section-heading split-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <div><p className="eyebrow">{'// SELECTED WORK'}</p><h2>Projects that<br /><span>left the terminal.</span></h2></div>
          <p>Tools, experiments, and products built across more than a decade of learning in public.</p>
        </motion.div>
      </div>

      <div ref={trackRef} className="project-scroll-track" style={{ height: `${projects.length * 100}vh` }}>
        <div className="project-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={`background-${activeProject.slug}`}
              className="project-stage-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              aria-hidden="true"
            >
              {activeProject.image && <Image src={activeProject.image} alt="" fill sizes="100vw" />}
              <span />
            </motion.div>
          </AnimatePresence>

          <motion.div className="project-stage-progress" style={{ width: progress }} />

          <div className="project-stage-nav container">
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
            <div aria-label="Choose a project">
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => goToProject(index)}
                  aria-label={`Show ${project.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={activeProject.slug}
              className="project-stage-slide container"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCopy project={activeProject} index={activeIndex} />
              <ProjectVisual project={activeProject} priority={activeIndex === 0} />
            </motion.article>
          </AnimatePresence>

          <div className="project-scroll-cue"><ArrowDown size={14} /><span>Scroll to explore</span></div>
        </div>
      </div>

      <div className="project-mobile-list">
        {projects.map((project, index) => (
          <article className="project-mobile-slide" key={project.slug}>
            <div className="container">
              <ProjectCopy project={project} index={index} />
              <ProjectVisual project={project} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
