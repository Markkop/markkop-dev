'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowUp, Code2, Github, Linkedin, Menu, Moon, Sun, Twitter, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import LanguageToggle from '@/components/LanguageToggle'
import SmoothScroll from '@/components/SmoothScroll'
import { useLanguage } from '@/context/LanguageContext'
import { profile } from '@/data/profile'

function Brand({ compact = false }: { compact?: boolean }) {
  return <span className={`mk-brand${compact ? ' compact' : ''}`}>markkop.dev<span>_</span></span>
}

function loaderEase(t: number) {
  if (t < 0.25) return 3.2 * t * t
  if (t < 0.65) return 0.2 + ((t - 0.25) / 0.4) * 0.5
  if (t < 0.88) return 0.7 + Math.pow((t - 0.65) / 0.23, 1.5) * 0.18
  return 0.88 + Math.pow((t - 0.88) / 0.12, 4) * 0.12
}

type LoaderPhase = 'loading' | 'greeting' | 'hint' | 'entering' | 'done'

function WordReveal({ text, delay, accent = false }: { text: string; delay: number; accent?: boolean }) {
  return (
    <span className={accent ? 'accent' : ''}>
      {text.split(' ').map((word, index) => (
        <motion.span
          className="mk-loader-word"
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: delay + index * 0.09, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

function LoadingScreen() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const [phase, setPhase] = useState<LoaderPhase>('loading')
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const raf = useRef(0)
  const isLinks = pathname.startsWith('/links')
  const copy = language === 'pt-BR'
    ? { hello: 'Oi, meu nome é', welcome: 'Bem-vindo ao meu portfólio', enter: 'Role para entrar', init: 'Inicializando', ready: 'Pronto' }
    : { hello: 'Hi, my name is', welcome: 'Welcome to my Portfolio', enter: 'Scroll to enter', init: 'Initializing', ready: 'Ready' }

  const enter = useCallback(() => {
    if (phase !== 'hint') return
    setPhase('entering')
    window.setTimeout(() => {
      setPhase('done')
      setVisible(false)
      sessionStorage.setItem('markkop-mubx-loaded', 'true')
    }, 1100)
  }, [phase])

  useEffect(() => {
    if (isLinks) return
    const local = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    if (!local && sessionStorage.getItem('markkop-mubx-loaded')) {
      const skipTimer = window.setTimeout(() => {
        setPhase('done')
        setVisible(false)
      }, 0)
      return () => window.clearTimeout(skipTimer)
    }

    const started = performance.now()
    const tick = (now: number) => {
      const raw = Math.min((now - started) / 3800, 1)
      setCount(Math.round(loaderEase(raw) * 100))
      if (raw < 1) raf.current = requestAnimationFrame(tick)
      else {
        setCount(100)
        window.setTimeout(() => setPhase('greeting'), 500)
        window.setTimeout(() => setPhase('hint'), 2700)
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [isLinks])

  useEffect(() => {
    if (!visible || phase === 'done') return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [phase, visible])

  useEffect(() => {
    if (phase !== 'hint') return
    const onKey = (event: KeyboardEvent) => {
      if (['Space', 'ArrowDown', 'Enter'].includes(event.code)) enter()
    }
    window.addEventListener('wheel', enter, { passive: true })
    window.addEventListener('touchmove', enter, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', enter)
      window.removeEventListener('touchmove', enter)
      window.removeEventListener('keydown', onKey)
    }
  }, [enter, phase])

  if (!visible || isLinks) return null
  const loading = phase === 'loading'
  const greeting = phase === 'greeting' || phase === 'hint'
  const entering = phase === 'entering'

  return (
    <div className="mk-loader" aria-live="polite">
      <motion.div className="mk-loader-curtain top" animate={{ y: entering ? '-100%' : 0 }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div className="mk-loader-curtain bottom" animate={{ y: entering ? '100%' : 0 }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div className="mk-loader-glow" animate={{ opacity: entering ? 0 : 1 }} />
      <motion.div className="mk-loader-accent" animate={{ scaleX: loading ? 1 : 0, opacity: loading ? 1 : 0 }} />
      <motion.div className="mk-loader-content" animate={{ opacity: entering ? 0 : 1 }}>
        <motion.div className="mk-loader-logo" animate={{ scale: loading ? 1 : 0.68, y: loading ? 0 : -18 }}>
          <Brand />
        </motion.div>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div className="mk-loader-counter" key="count" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}>
              <strong>{count}<small>%</small></strong>
              <div><span style={{ width: `${count}%` }} /></div>
              <p>{count < 100 ? copy.init : copy.ready}</p>
            </motion.div>
          )}
          {greeting && (
            <motion.div className="mk-loader-greeting" key="greeting" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <p>{copy.hello}</p>
              <h2><WordReveal text="Marcelo" delay={0.2} /> <WordReveal text="Kopmann." delay={0.38} accent /></h2>
              <motion.h3 animate={{ opacity: phase === 'hint' ? 1 : 0, y: phase === 'hint' ? 0 : 10 }}>{copy.welcome}</motion.h3>
              <motion.button type="button" className="mk-loader-enter" onClick={enter} animate={{ opacity: phase === 'hint' ? 1 : 0 }}>
                <span><i /></span><small>{copy.enter}</small>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.small className="mk-loader-watermark" animate={{ opacity: entering ? 0 : 1 }}>markkop.dev</motion.small>
    </div>
  )
}

function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [active, setActive] = useState('hero')
  const previous = useRef(0)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const links = [
    { label: t.nav.home, href: '#hero', id: 'hero' },
    { label: t.nav.about, href: '#about', id: 'about' },
    { label: t.nav.projects, href: '#projects', id: 'projects' },
    { label: t.nav.stack, href: '#tech-stack', id: 'tech-stack' },
    { label: t.nav.contact, href: '#contact', id: 'contact' },
  ]

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-38% 0px -55%', threshold: 0 },
    )
    links.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - previous.current
    if (latest < 80) setHidden(false)
    else if (diff > 30) setHidden(true)
    else if (diff < -10) setHidden(false)
    previous.current = latest
  })

  if (pathname.startsWith('/links')) return null

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('markkop-theme', next)
  }

  const navMotion = { y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }

  return (
    <>
      <motion.header className="mk-nav-desktop" animate={navMotion} transition={{ type: 'spring', stiffness: 260, damping: 30 }} onMouseEnter={() => setHidden(false)}>
        <nav onMouseLeave={() => setHovered(null)} aria-label={t.accessibility.primaryNav}>
          <a className="mk-nav-logo" href="#hero" aria-label={`markkop.dev · ${t.nav.home}`}><Brand compact /></a>
          <i className="mk-nav-divider" />
          {links.map((link, index) => (
            <a key={link.id} className={active === link.id ? 'active' : ''} href={link.href} onMouseEnter={() => setHovered(index)}>
              <span>{link.label}</span>
              {hovered === index && <motion.i layoutId="mk-nav-hover" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
            </a>
          ))}
          <i className="mk-nav-divider" />
          <Link className="mk-nav-secondary" href="/links"><Code2 size={14} /> {t.nav.links}</Link>
          <LanguageToggle compact />
          <button className="mk-nav-icon" onClick={toggleTheme} aria-label={t.accessibility.theme(theme)}>{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
          <a className="mk-nav-cta" href={profile.links.linkedin} target="_blank" rel="noreferrer">{t.nav.connect}</a>
        </nav>
      </motion.header>

      <motion.header className="mk-nav-mobile" animate={navMotion} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
        <nav>
          <a href="#hero" aria-label={`markkop.dev · ${t.nav.home}`}><Brand compact /></a>
          <button onClick={() => setOpen((value) => !value)} aria-label={t.accessibility.toggleMenu}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button className="mk-drawer-backdrop" aria-label={t.accessibility.toggleMenu} onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="mk-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <button className="mk-drawer-close" onClick={() => setOpen(false)} aria-label={t.accessibility.toggleMenu}><X size={20} /></button>
              <div className="mk-drawer-links">
                {links.map((link, index) => (
                  <motion.a key={link.id} className={active === link.id ? 'active' : ''} href={link.href} onClick={() => setOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + index * 0.04 }}>
                    <i />{link.label}
                  </motion.a>
                ))}
                <Link href="/links" onClick={() => setOpen(false)}><i />{t.nav.links}</Link>
              </div>
              <div className="mk-drawer-settings"><LanguageToggle compact /><button className="mk-nav-icon" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button></div>
              <a className="mk-drawer-cta" href={profile.links.linkedin} target="_blank" rel="noreferrer">{t.nav.connect}</a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const socialItems = [
  { label: 'GitHub', href: profile.links.github, Icon: Github, color: '#f0f6fc', bg: 'rgba(240,246,252,.08)' },
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: Linkedin, color: '#0a66c2', bg: 'rgba(10,102,194,.12)' },
  { label: 'X', href: profile.links.x, Icon: Twitter, color: '#8b5cf6', bg: 'rgba(139,92,246,.12)' },
]

function SocialSidebar() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <motion.aside className="mk-social" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 1.8 }}>
      <i />
      {socialItems.map(({ label, href, Icon, color, bg }) => (
        <span key={label}>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} onMouseEnter={() => setHovered(label)} onMouseLeave={() => setHovered(null)} style={hovered === label ? { color, background: bg, borderColor: `${color}55` } : undefined}><Icon size={18} /></a>
          <small className={hovered === label ? 'visible' : ''} style={{ color }}>{label}</small>
        </span>
      ))}
      <i />
    </motion.aside>
  )
}

function FloatingLogo() {
  const { scrollY } = useScroll()
  const smoothY = useSpring(scrollY, { stiffness: 120, damping: 30 })
  const [progress, setProgress] = useState(0)
  useEffect(() => smoothY.on('change', (value) => {
    const height = document.documentElement.scrollHeight - innerHeight
    setProgress(Math.max(0, Math.min(1, value / Math.max(height, 1))))
  }), [smoothY])
  const circumference = 2 * Math.PI * 25.5
  return (
    <motion.div className="mk-floating-logo" animate={{ opacity: progress > 0.01 ? 1 : 0, scale: progress > 0.01 ? 1 : 0.7 }}>
      <svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="25.5" /><circle className="progress" cx="28" cy="28" r="25.5" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} /></svg>
      <span><Image src="/brand-icon.png" alt="markkop.dev" width={30} height={30} /></span>
      <small>{Math.round(progress * 100)}%</small>
    </motion.div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (value) => setProgress(Math.round(value * 100)))
  const circumference = 2 * Math.PI * 24
  return (
    <>
      <motion.div className="mk-top-progress" style={{ scaleX: scrollYProgress }} />
      <button className={`mk-to-top${progress > 5 ? ' visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll back to top">
        <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" /><circle className="progress" cx="30" cy="30" r="24" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} /></svg>
        <ArrowUp size={20} />
        <small>{progress}%</small>
      </button>
    </>
  )
}

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <a className="mk-skip" href="#main-content">Skip to content</a>
      <Navbar />
      <SocialSidebar />
      <FloatingLogo />
      <ScrollProgress />
      {children}
    </SmoothScroll>
  )
}
