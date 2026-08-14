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
import { profile, stack } from '@/data/profile'
import ProjectShowcase from '@/components/ProjectShowcase'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'

type GithubProfile = { public_repos?: number; followers?: number }
type GithubEvent = { repo?: { name?: string }; type?: string }

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
}

export default function Portfolio() {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const [github, setGithub] = useState<GithubProfile>({})
  const [activityRepo, setActivityRepo] = useState('')
  const [loading, setLoading] = useState(true)

  const navItems = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.stack, href: '#tech-stack' },
    { label: t.nav.contact, href: '#contact' },
  ]

  const activity = activityRepo ? `${t.status.latest} · ${activityRepo}` : t.status.building

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
        if (event?.repo?.name) setActivityRepo(event.repo.name.replace('Markkop/', ''))
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

      <a className="skip-link" href="#main-content">{t.accessibility.skip}</a>

      <header className="site-header">
        <nav className="nav-shell" aria-label={t.accessibility.primaryNav}>
          <a className="brand" href="#hero" aria-label={`markkop.dev · ${t.nav.home}`}>markkop.dev<span>_</span></a>
          <div className="desktop-nav">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </div>
          <div className="nav-actions">
            <LanguageToggle />
            <button className="icon-button" onClick={toggleTheme} aria-label={t.accessibility.theme(theme)}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a className="nav-cta" href={profile.links.linkedin} target="_blank" rel="noreferrer">{t.nav.connect}</a>
            <button className="icon-button menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={t.accessibility.toggleMenu}>
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
              <Link href="/links" onClick={() => setMenuOpen(false)}>{t.nav.links}</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <aside className="social-rail" aria-label={t.accessibility.socialProfiles}>
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
                <span>{t.hero.lead}</span>
                <strong>{t.hero.highlight}</strong>
              </h1>
              <p className="hero-summary">{t.hero.summary}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects">{t.hero.explore} <ArrowDown size={15} /></a>
                <a className="button button-secondary" href={profile.links.linkedin} target="_blank" rel="noreferrer">{t.hero.linkedin} <ArrowUpRight size={15} /></a>
              </div>
              <div className="identity-row">
                <span><MapPin size={14} /> {t.hero.location}</span>
                <span><Building2 size={14} /> {profile.company}</span>
              </div>
            </motion.div>

            <motion.div className="terminal-wrap" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.25 }}>
              <div className="terminal-window">
                <div className="terminal-bar"><div><i /><i /><i /></div><span>markkop@dev:~</span><Terminal size={14} /></div>
                <div className="terminal-body">
                  <div className="terminal-profile">
                    <div className="avatar-frame"><Image src="/avatar.png" alt="Marcelo Kopmann" fill priority sizes="140px" /></div>
                    <div><small>whoami</small><strong>{profile.shortName}</strong><span>{t.hero.role}</span></div>
                  </div>
                  <div className="command"><span>$</span> cat focus.txt</div>
                  <p className="output">{t.hero.focus}</p>
                  <div className="command"><span>$</span> git status --short</div>
                  <p className="output success">{t.hero.state}</p>
                  <div className="terminal-footer"><span>main</span><span>UTF-8</span><span>TypeScript</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container">
            <motion.div className="stats-grid" {...reveal}>
              {profile.stats.map((stat, index) => (
                <div key={stat.label}>
                  <strong>{dynamicValue('dynamic' in stat ? stat.dynamic : undefined, stat.value)}</strong>
                  <span>{t.about.stats[index]}</span>
                </div>
              ))}
            </motion.div>

            <motion.div className="section-heading" {...reveal}>
              <p className="eyebrow">{t.about.eyebrow}</p>
              <h2>{t.about.title}<br /><span>{t.about.titleHighlight}</span></h2>
            </motion.div>

            <div className="about-grid">
              {t.about.cards.map((item, index) => (
                <motion.article key={item.title} {...reveal} transition={{ duration: 0.55, delay: index * 0.08 }}>
                  <p className="eyebrow">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.article>
              ))}
            </div>

            <motion.div className="journey" {...reveal}>
              <p className="eyebrow">{t.about.journey}</p>
              <div className="journey-line">
                {profile.milestones.map((milestone, index) => (
                  <div key={milestone.year}><i /><strong>{milestone.year}</strong><span>{t.about.milestones[index]}</span></div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <ProjectShowcase />

        <section id="tech-stack" className="section stack-section">
          <div className="container">
            <motion.div className="section-heading" {...reveal}>
              <p className="eyebrow">{t.stack.eyebrow}</p>
              <h2>{t.stack.title}<br /><span>{t.stack.titleHighlight}</span></h2>
              <p>{t.stack.intro}</p>
            </motion.div>
            <div className="stack-grid">
              {stack.map((group, index) => (
                <motion.div className="stack-card" key={group.group} {...reveal} transition={{ duration: 0.5, delay: index * 0.07 }}>
                  <span className="stack-number">0{index + 1}</span>
                  <h3>{t.stack.groups[index]}</h3>
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
                {t.now.items.map((item) => <p key={item}><span>&gt;</span> {item}</p>)}
              </div>
              <small>{t.now.updated}</small>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-layout">
            <motion.div {...reveal}>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}<br /><span>{t.contact.titleHighlight}</span></h2>
              <p>{t.contact.intro}</p>
            </motion.div>
            <motion.div className="contact-links" {...reveal}>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /><span><strong>LinkedIn</strong><small>{t.contact.linkedin}</small></span><ArrowUpRight size={18} /></a>
              <a href={profile.links.github} target="_blank" rel="noreferrer"><Github size={20} /><span><strong>GitHub</strong><small>{t.contact.github}</small></span><ArrowUpRight size={18} /></a>
              <a href={profile.links.x} target="_blank" rel="noreferrer"><Twitter size={20} /><span><strong>X / Twitter</strong><small>@heymarkkop</small></span><ArrowUpRight size={18} /></a>
              <Link href="/links"><Code2 size={20} /><span><strong>{t.contact.allLinks}</strong><small>{t.contact.allLinksDescription}</small></span><ArrowUpRight size={18} /></Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container"><span>© 2026 Marcelo Kopmann</span><span>{t.footer.built}</span><span>$ mark --version 2026</span></div>
      </footer>
    </>
  )
}
