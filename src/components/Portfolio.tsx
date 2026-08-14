'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Code2,
  Github,
  Linkedin,
  MapPin,
  Menu,
  Moon,
  Radio,
  Sun,
  Terminal,
  Twitter,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { profile, projects, stack } from '@/data/profile'

type GithubProfile = { public_repos?: number; followers?: number }
type GithubEvent = { repo?: { name?: string }; type?: string }

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#tech-stack' },
  { label: 'Contact', href: '#contact' },
]

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const [github, setGithub] = useState<GithubProfile>({})
  const [activity, setActivity] = useState('Building in public')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('markkop-theme') === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = savedTheme

    const seen = sessionStorage.getItem('markkop-loaded')
    const timer = window.setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('markkop-loaded', 'true')
    }, seen ? 120 : 900)

    Promise.allSettled([
      fetch('https://api.github.com/users/Markkop').then((response) => response.ok ? response.json() : Promise.reject()),
      fetch('https://api.github.com/users/Markkop/events?per_page=5').then((response) => response.ok ? response.json() : Promise.reject()),
    ]).then(([profileResult, eventsResult]) => {
      if (profileResult.status === 'fulfilled') setGithub(profileResult.value as GithubProfile)
      if (eventsResult.status === 'fulfilled') {
        const event = (eventsResult.value as GithubEvent[]).find((item) => item.repo?.name)
        if (event?.repo?.name) setActivity(`Latest activity · ${event.repo.name.replace('Markkop/', '')}`)
      }
    })

    return () => window.clearTimeout(timer)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('markkop-theme', next)
  }

  const dynamicValue = (dynamic?: string, fallback?: string) => {
    if (dynamic === 'repos' && github.public_repos) return String(github.public_repos)
    if (dynamic === 'followers' && github.followers) return String(github.followers)
    return fallback ?? ''
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="loader-mark">markkop.dev<span>_</span></div>
            <div className="loader-track"><motion.span initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.75 }} /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="brand" href="#hero" aria-label="markkop.dev home">markkop.dev<span>_</span></a>
          <div className="desktop-nav">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </div>
          <div className="nav-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a className="nav-cta" href={profile.links.linkedin} target="_blank" rel="noreferrer">Connect</a>
            <button className="icon-button menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
              <Link href="/links" onClick={() => setMenuOpen(false)}>Links</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <aside className="social-rail" aria-label="Social profiles">
        <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
        <a href={profile.links.x} target="_blank" rel="noreferrer" aria-label="X"><Twitter size={17} /></a>
        <span />
      </aside>

      <main id="main-content">
        <section id="hero" className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-layout">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="status-line"><span /><Radio size={13} /> {activity}</div>
              <p className="eyebrow">{profile.name}</p>
              <h1>
                <span>I build practical products where</span>
                <strong>web, AI, games &amp; onchain systems meet.</strong>
              </h1>
              <p className="hero-summary">{profile.summary}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">Explore my work <ArrowDown size={15} /></a>
                <a className="button button-secondary" href={profile.links.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={15} /></a>
              </div>
              <div className="identity-row">
                <span><MapPin size={14} /> {profile.location}</span>
                <span><Building2 size={14} /> {profile.company}</span>
              </div>
            </motion.div>

            <motion.div className="terminal-wrap" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.25 }}>
              <div className="terminal-window">
                <div className="terminal-bar"><div><i /><i /><i /></div><span>markkop@dev:~</span><Terminal size={14} /></div>
                <div className="terminal-body">
                  <div className="terminal-profile">
                    <div className="avatar-frame"><Image src="/avatar.png" alt="Marcelo Kopmann" fill priority sizes="140px" /></div>
                    <div><small>whoami</small><strong>{profile.shortName}</strong><span>{profile.role}</span></div>
                  </div>
                  <div className="command"><span>$</span> cat focus.txt</div>
                  <p className="output">web_products + ai_workflows + open_source + onchain_incentives</p>
                  <div className="command"><span>$</span> git status --short</div>
                  <p className="output success">● curious, shipping, learning</p>
                  <div className="terminal-footer"><span>main</span><span>UTF-8</span><span>TypeScript</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container">
            <motion.div className="stats-grid" {...reveal}>
              {profile.stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{dynamicValue('dynamic' in stat ? stat.dynamic : undefined, stat.value)}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div className="section-heading" {...reveal}>
              <p className="eyebrow">{'// ABOUT ME'}</p>
              <h2>The person behind<br /><span>the terminal.</span></h2>
            </motion.div>

            <div className="about-grid">
              {profile.about.map((item, index) => (
                <motion.article key={item.title} {...reveal} transition={{ duration: 0.55, delay: index * 0.08 }}>
                  <p className="eyebrow">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.article>
              ))}
            </div>

            <motion.div className="journey" {...reveal}>
              <p className="eyebrow">{'// JOURNEY'}</p>
              <div className="journey-line">
                {profile.milestones.map((milestone) => (
                  <div key={milestone.year}><i /><strong>{milestone.year}</strong><span>{milestone.text}</span></div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="section projects-section">
          <div className="container">
            <motion.div className="section-heading split-heading" {...reveal}>
              <div><p className="eyebrow">{'// SELECTED WORK'}</p><h2>Projects that<br /><span>left the terminal.</span></h2></div>
              <p>Tools, experiments, and products built across more than a decade of learning in public.</p>
            </motion.div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.article className={`project-card ${index === 0 || index === 3 ? 'featured' : ''}`} key={project.slug} {...reveal}>
                  <div className="project-preview">
                    {project.image ? <Image src={project.image} alt={`${project.title} project preview`} fill sizes="(max-width: 768px) 100vw, 50vw" /> : (
                      <div className="project-fallback"><Code2 size={34} /><span>{project.title}</span></div>
                    )}
                    <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="project-content">
                    <div className="project-meta"><span>{project.category}</span><strong>{project.metric}</strong></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tag-row">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
                    <div className="project-bottom">
                      <small>{project.timeframe}</small>
                      <div>
                        {project.code && <a href={project.code} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><Github size={16} /></a>}
                        <a href={project.live} target="_blank" rel="noreferrer">Visit <ArrowUpRight size={15} /></a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="tech-stack" className="section stack-section">
          <div className="container">
            <motion.div className="section-heading" {...reveal}>
              <p className="eyebrow">{'// TOOLS OF THE TRADE'}</p>
              <h2>My technical<br /><span>constellation.</span></h2>
              <p>Different tools for different jobs—chosen for the problem, not the trend.</p>
            </motion.div>
            <div className="stack-grid">
              {stack.map((group, index) => (
                <motion.div className="stack-card" key={group.group} {...reveal} transition={{ duration: 0.5, delay: index * 0.07 }}>
                  <span className="stack-number">0{index + 1}</span>
                  <h3>{group.group}</h3>
                  <div>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="now-section">
          <div className="container">
            <motion.div className="now-card" {...reveal}>
              <div className="terminal-bar"><div><i /><i /><i /></div><span>cat /now.md</span><Radio size={14} /></div>
              <div className="now-body">
                <p><span>&gt;</span> Building habit systems with meaningful incentives</p>
                <p><span>&gt;</span> Exploring AI-assisted product workflows</p>
                <p><span>&gt;</span> Maintaining open-source tools and community projects</p>
                <p><span>&gt;</span> Shipping small experiments that teach something</p>
              </div>
              <small>Updated August 2026</small>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-layout">
            <motion.div {...reveal}>
              <p className="eyebrow">{'// LET\'S CONNECT'}</p>
              <h2>Have an interesting<br /><span>problem to solve?</span></h2>
              <p>I&apos;m always interested in thoughtful products, open-source collaboration, and systems that make work or life more rewarding.</p>
            </motion.div>
            <motion.div className="contact-links" {...reveal}>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /><span><strong>LinkedIn</strong><small>Start a conversation</small></span><ArrowUpRight size={18} /></a>
              <a href={profile.links.github} target="_blank" rel="noreferrer"><Github size={20} /><span><strong>GitHub</strong><small>Explore 98+ repositories</small></span><ArrowUpRight size={18} /></a>
              <a href={profile.links.x} target="_blank" rel="noreferrer"><Twitter size={20} /><span><strong>X / Twitter</strong><small>@heymarkkop</small></span><ArrowUpRight size={18} /></a>
              <Link href="/links"><Code2 size={20} /><span><strong>All links</strong><small>Projects and profiles</small></span><ArrowUpRight size={18} /></Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container"><span>© 2026 Marcelo Kopmann</span><span>Designed &amp; built by Mark · markkop.dev</span><span>$ mark --version 2026</span></div>
      </footer>
    </>
  )
}
