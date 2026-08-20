'use client'

import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { ChevronDown, ChevronsUp, Menu, Moon, Sparkles, Sun, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'
import { profile, projects } from '@/data/profile'
import { clearSplashPending, shouldSkipSplash, SPLASH_STORAGE_KEY } from '@/lib/splash'
import { projectIndexAt, projectScrollTop } from '@/lib/projectScroll'

const SECTION_IDS = ['hero', 'about', 'projects', 'tech-stack', 'now', 'contact'] as const
const isDev = process.env.NODE_ENV === 'development'

function subscribeTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

function getThemeSnapshot(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark' as const)
  const toggleTheme = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    localStorage.setItem('markkop-theme', next)
  }, [])
  return { theme, toggleTheme }
}

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

type NameStage = 'full' | 'short'

const NAME_EASE = [0.22, 1, 0.36, 1] as const
const NAME_MORPH_DURATION = 0.7
const NAME_LOOP_HOLD_MS = 5000
const SKIP_INITIALIZING_SCREEN = true
const ScrollDownCue = dynamic(() => import('@/components/ScrollDownCue'), { ssr: false })

function firstNameGlyphs(stage: NameStage) {
  const glyphs = [
    { id: 'M', char: 'M' },
    { id: 'a', char: 'a' },
    { id: 'r', char: 'r' },
    { id: 'ck', char: stage === 'short' ? 'k' : 'c' },
    { id: 'e', char: 'e' },
    { id: 'l', char: 'l' },
    { id: 'o', char: 'o' },
  ]
  return (stage === 'short' ? glyphs.slice(0, 4) : glyphs).map((glyph) => ({
    ...glyph,
    accent: true,
  }))
}

function lastNameGlyphs(stage: NameStage) {
  const glyphs = [
    { id: 'K', char: 'K' },
    { id: 'o2', char: 'o' },
    { id: 'p', char: 'p' },
    { id: 'm', char: 'm' },
    { id: 'a2', char: 'a' },
    { id: 'n1', char: 'n' },
    { id: 'n2', char: 'n' },
  ]
  return (stage === 'short' ? glyphs.slice(0, 3) : glyphs).map((glyph) => ({
    ...glyph,
    accent: false,
  }))
}

const Letter = forwardRef<HTMLSpanElement, {
  char: string
  accent: boolean
  morphable?: boolean
  muted?: boolean
}>(function Letter({ char, accent, morphable = false, muted = false }, ref) {
  const color = accent ? 'var(--mk-accent)' : muted ? 'var(--mk-muted)' : 'var(--mk-fg)'
  return (
    <motion.span
      ref={ref}
      className="mk-loader-letter"
      layout="position"
      initial={{ opacity: 0, scale: 0.5, y: 8, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', color }}
      exit={{
        opacity: 0,
        color,
        scale: 0.5,
        y: 8,
        filter: 'blur(8px)',
      }}
      transition={{ duration: NAME_MORPH_DURATION, ease: NAME_EASE }}
    >
      {morphable ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={char}
            initial={{ opacity: 0, scale: 0.72, filter: 'blur(7px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.72, filter: 'blur(7px)' }}
            transition={{ duration: NAME_MORPH_DURATION, ease: NAME_EASE }}
          >
            {char}
          </motion.span>
        </AnimatePresence>
      ) : char}
    </motion.span>
  )
})

type GreetingGlyph = { id: string; char: string; morphable?: boolean }

function nicknameGlyphs(stage: NameStage, isPortuguese: boolean): GreetingGlyph[] {
  if (isPortuguese) {
    const nome = [
      { id: 'pt-1', char: 'n', morphable: true },
      { id: 'pt-2', char: 'o', morphable: true },
      { id: 'pt-3', char: 'm', morphable: true },
      { id: 'pt-4', char: 'e', morphable: true },
    ]
    const apelido = [
      { id: 'pt-1', char: 'a', morphable: true },
      { id: 'pt-2', char: 'p', morphable: true },
      { id: 'pt-3', char: 'e', morphable: true },
      { id: 'pt-4', char: 'l', morphable: true },
      { id: 'pt-5', char: 'i' },
      { id: 'pt-6', char: 'd' },
      { id: 'pt-7', char: 'o' },
    ]
    return stage === 'short' ? apelido : nome
  }

  const name = [
    { id: 'n', char: 'n' },
    { id: 'a', char: 'a' },
    { id: 'm', char: 'm' },
    { id: 'e', char: 'e' },
  ]
  const nick = [
    { id: 'Nn', char: 'n' },
    { id: 'i', char: 'i' },
    { id: 'c', char: 'c' },
    { id: 'k', char: 'k' },
  ]
  return stage === 'short' ? [...nick, ...name] : name
}

function HelloMorph({
  active,
  delayMs = 0,
  language,
  onSettled,
  stage: controlledStage,
}: {
  active: boolean
  delayMs?: number
  language: string
  onSettled: () => void
  stage?: NameStage
}) {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState<NameStage>('full')
  const settledRef = useRef(onSettled)
  const isPortuguese = language === 'pt-BR'
  const prefix = isPortuguese ? 'Olá,' : 'Hi,'
  const lead = isPortuguese ? 'meu' : 'my'
  const tail = isPortuguese ? 'é' : 'is'
  const resolvedStage = controlledStage ?? stage

  useEffect(() => {
    settledRef.current = onSettled
  }, [onSettled])

  useEffect(() => {
    if (!active) return

    const shortenDelay = reduceMotion ? 0 : delayMs
    const hintDelay = reduceMotion ? 280 : delayMs + NAME_MORPH_DURATION * 1000 + 500
    const shorten = window.setTimeout(() => setStage('short'), shortenDelay)
    const hint = window.setTimeout(() => settledRef.current(), hintDelay)
    return () => {
      window.clearTimeout(shorten)
      window.clearTimeout(hint)
    }
  }, [active, delayMs, reduceMotion])

  const glyphs = nicknameGlyphs(resolvedStage, isPortuguese)
  const layoutTransition = { layout: { duration: NAME_MORPH_DURATION, ease: NAME_EASE } }

  return (
    <LayoutGroup>
      <motion.p
        className="mk-loader-hello"
        layout="position"
        layoutDependency={resolvedStage}
        transition={layoutTransition}
        aria-label={`${prefix} ${lead} ${resolvedStage === 'short' ? (isPortuguese ? 'apelido' : 'nickname') : (isPortuguese ? 'nome' : 'name')} ${tail}`}
      >
        <motion.span layout="position" transition={layoutTransition}>{prefix}</motion.span>
        <motion.span layout="position" transition={layoutTransition}>{lead}</motion.span>
        <motion.span className="mk-loader-word" layout="position" transition={layoutTransition}>
          <AnimatePresence mode="popLayout" initial={false}>
            {glyphs.map((glyph) => (
              <Letter key={glyph.id} char={glyph.char} accent={false} morphable={glyph.morphable} muted />
            ))}
          </AnimatePresence>
        </motion.span>
        <motion.span layout="position" transition={layoutTransition}>{tail}</motion.span>
      </motion.p>
    </LayoutGroup>
  )
}

function NameMorph({
  active = true,
  delayMs = 2000,
  onMorphed,
  stage: controlledStage,
}: {
  active?: boolean
  delayMs?: number
  onMorphed: () => void
  stage?: NameStage
}) {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState<NameStage>('full')
  const morphedRef = useRef(onMorphed)
  const resolvedStage = controlledStage ?? stage

  useEffect(() => {
    morphedRef.current = onMorphed
  }, [onMorphed])

  useEffect(() => {
    if (!active) return

    const shortenDelay = reduceMotion ? 0 : delayMs
    const doneDelay = reduceMotion ? 280 : delayMs + NAME_MORPH_DURATION * 1000
    const shorten = window.setTimeout(() => setStage('short'), shortenDelay)
    const done = window.setTimeout(() => morphedRef.current(), doneDelay)
    return () => {
      window.clearTimeout(shorten)
      window.clearTimeout(done)
    }
  }, [active, delayMs, reduceMotion])

  const first = firstNameGlyphs(resolvedStage)
  const last = lastNameGlyphs(resolvedStage)

  return (
    <LayoutGroup>
      <h2 className="mk-loader-name" aria-label={resolvedStage === 'short' ? 'Mark Kop' : 'Marcelo Kopmann'}>
        <motion.span
          className="mk-loader-word"
          layout="position"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            opacity: { duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            layout: { duration: NAME_MORPH_DURATION, ease: NAME_EASE },
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {first.map((glyph) => (
              <Letter key={glyph.id} char={glyph.char} accent={glyph.accent} morphable={glyph.id === 'ck'} />
            ))}
          </AnimatePresence>
        </motion.span>
        <motion.span
          className="mk-loader-word"
          layout="position"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            opacity: { duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] },
            layout: { duration: NAME_MORPH_DURATION, ease: NAME_EASE },
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {last.map((glyph) => (
              <Letter key={glyph.id} char={glyph.char} accent={glyph.accent} />
            ))}
          </AnimatePresence>
        </motion.span>
      </h2>
    </LayoutGroup>
  )
}

function LoadingScreen({
  forced = false,
  dismissId,
  onActiveChange,
  onChromeChange,
}: {
  forced?: boolean
  dismissId: number
  onActiveChange: (active: boolean) => void
  onChromeChange: (visible: boolean) => void
}) {
  const pathname = usePathname()
  const lenis = useLenis()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<LoaderPhase>(SKIP_INITIALIZING_SCREEN ? 'greeting' : 'loading')
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const [nicknameLabelSettled, setNicknameLabelSettled] = useState(false)
  const [loopStage, setLoopStage] = useState<NameStage | null>(null)
  const raf = useRef(0)
  const enteringRef = useRef(false)
  const isLinks = pathname.startsWith('/links')
  const copy = language === 'pt-BR'
    ? { welcome: 'Bem-vindo ao meu portfólio', enter: 'Role para entrar', init: 'Inicializando', ready: 'Pronto' }
    : { welcome: 'Welcome to my Portfolio', enter: 'Scroll to enter', init: 'Initializing', ready: 'Ready' }

  const pinToTop = useCallback(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [lenis])

  const finishEnter = useCallback(() => {
    if (enteringRef.current) return
    enteringRef.current = true
    sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true')
    pinToTop()
    setPhase('entering')
    window.setTimeout(() => {
      pinToTop()
      setPhase('done')
      setVisible(false)
      onActiveChange(false)
      onChromeChange(false)
    }, 1100)
  }, [onActiveChange, onChromeChange, pinToTop])

  const finishEnterRef = useRef(finishEnter)

  useEffect(() => {
    finishEnterRef.current = finishEnter
  }, [finishEnter])

  const enter = useCallback(() => {
    if (phase !== 'hint') return
    finishEnter()
  }, [finishEnter, phase])

  useLayoutEffect(() => {
    if (isLinks || sessionStorage.getItem(SPLASH_STORAGE_KEY) || (!forced && shouldSkipSplash())) {
      clearSplashPending()
    }
  }, [forced, isLinks])

  useEffect(() => {
    const release = () => {
      clearSplashPending()
      onActiveChange(false)
      onChromeChange(false)
    }

    if (isLinks || sessionStorage.getItem(SPLASH_STORAGE_KEY) || (!forced && shouldSkipSplash())) {
      queueMicrotask(release)
      return
    }

    const mountTimer = window.setTimeout(() => {
      setVisible(true)
      setMounted(true)
      onActiveChange(true)
      onChromeChange(false)
    }, 0)

    if (SKIP_INITIALIZING_SCREEN) {
      return () => window.clearTimeout(mountTimer)
    }

    const started = performance.now()
    let greetingTimer = 0
    const tick = (now: number) => {
      const raw = Math.min((now - started) / 3800, 1)
      const eased = loaderEase(raw)
      setCount(Math.round(eased * 100))
      if (raw < 1) raf.current = requestAnimationFrame(tick)
      else {
        setCount(100)
        greetingTimer = window.setTimeout(() => setPhase('greeting'), 500)
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.clearTimeout(mountTimer)
      cancelAnimationFrame(raf.current)
      window.clearTimeout(greetingTimer)
    }
  }, [forced, isLinks, onActiveChange, onChromeChange])

  useLayoutEffect(() => {
    if (!mounted || !visible) return
    clearSplashPending()
  }, [mounted, visible])

  useEffect(() => {
    if (dismissId === 0) return
    if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) return
    finishEnterRef.current()
  }, [dismissId])

  useEffect(() => {
    if (!mounted || !visible || isLinks) return
    if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) return
    lenis?.stop()
    pinToTop()
    return () => { lenis?.start() }
  }, [isLinks, lenis, mounted, pinToTop, visible])

  useEffect(() => {
    if (!mounted || !visible || phase === 'done') return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mounted, phase, visible])

  useEffect(() => {
    if (!mounted || isLinks || !visible || phase === 'done' || phase === 'hint') return
    const preventScroll = (event: Event) => event.preventDefault()
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [isLinks, mounted, phase, visible])

  useEffect(() => {
    if (phase === 'hint') onChromeChange(true)
  }, [onChromeChange, phase])

  useEffect(() => {
    if (phase !== 'hint') return
    const unlock = (event: Event) => {
      event.preventDefault()
      pinToTop()
      enter()
    }
    const onKey = (event: KeyboardEvent) => {
      if (!['Space', 'ArrowDown', 'Enter'].includes(event.code)) return
      event.preventDefault()
      pinToTop()
      enter()
    }
    window.addEventListener('wheel', unlock, { passive: false })
    window.addEventListener('touchmove', unlock, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('touchmove', unlock)
      window.removeEventListener('keydown', onKey)
    }
  }, [enter, phase, pinToTop])

  useEffect(() => {
    if (phase !== 'hint') return

    let timeout = 0
    let cancelled = false
    const morphMs = NAME_MORPH_DURATION * 1000
    const schedule = (delay: number, then: () => void) => {
      timeout = window.setTimeout(() => {
        if (cancelled) return
        then()
      }, delay)
    }

    schedule(500 + 550 + NAME_LOOP_HOLD_MS, () => {
      setLoopStage('full')
      const cycle = () => {
        schedule(NAME_LOOP_HOLD_MS + morphMs, () => {
          setLoopStage((current) => current === 'full' ? 'short' : 'full')
          cycle()
        })
      }
      cycle()
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [phase])

  if (!mounted || !visible || isLinks) return null
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
        <div className="mk-loader-logo-slot">
          <AnimatePresence>
            {loading && (
              <motion.div
                className="mk-loader-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Brand />
              </motion.div>
            )}
            {phase === 'hint' && (
              <motion.div
                className="mk-loader-logo"
                initial={{ opacity: 0, scale: 0.68 }}
                animate={{ opacity: 1, scale: 0.68 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Brand />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              <HelloMorph
                active
                delayMs={2000}
                language={language}
                stage={loopStage ?? undefined}
                onSettled={() => setNicknameLabelSettled(true)}
              />
              <NameMorph
                active={nicknameLabelSettled}
                delayMs={0}
                stage={loopStage ?? undefined}
                onMorphed={() => setPhase((current) => current === 'greeting' ? 'hint' : current)}
              />
              <motion.h3
                animate={{ opacity: phase === 'hint' ? 1 : 0, y: phase === 'hint' ? 0 : 10 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {copy.welcome}
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          className="mk-loader-enter"
          onClick={enter}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'hint' ? 1 : 0 }}
          transition={{ duration: 0.55, delay: phase === 'hint' ? 0.5 : 0, ease: [0.16, 1, 0.3, 1] }}
          style={{ pointerEvents: phase === 'hint' ? 'auto' : 'none' }}
        >
          <ScrollDownCue />
          <small>{copy.enter}</small>
        </motion.button>
      </motion.div>
    </div>
  )
}

function Navbar({ onBrandClick }: { onBrandClick: () => void }) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [active, setActive] = useState('hero')
  const previous = useRef(0)
  const navHidden = hidden && !open && !pathname.startsWith('/links')

  const handleBrandClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setOpen(false)
    onBrandClick()
  }, [onBrandClick])

  const links = [
    { label: t.nav.home, href: '#hero', id: 'hero' },
    { label: t.nav.about, href: '#about', id: 'about' },
    { label: t.nav.projects, href: '#projects', id: 'projects' },
    { label: t.nav.stack, href: '#tech-stack', id: 'tech-stack' },
    { label: t.nav.contact, href: '#contact', id: 'contact' },
  ]

  useEffect(() => {
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

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-nav-hidden', navHidden)
    return () => document.documentElement.removeAttribute('data-nav-hidden')
  }, [navHidden])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - previous.current
    if (latest < 80) setHidden(false)
    else if (diff > 30) setHidden(true)
    else if (diff < -10) setHidden(false)
    previous.current = latest
  })

  if (pathname.startsWith('/links')) return null

  const navMotion = { y: navHidden ? '-100%' : 0, opacity: navHidden ? 0 : 1 }

  return (
    <>
      <motion.header className={`mk-nav-desktop${navHidden ? ' is-hidden' : ''}`} animate={navMotion} transition={{ type: 'spring', stiffness: 260, damping: 30 }} onMouseEnter={() => setHidden(false)}>
        <nav onMouseLeave={() => setHovered(null)} aria-label={t.accessibility.primaryNav}>
          <a className="mk-nav-logo" href="#hero" aria-label={`markkop.dev · ${t.nav.home}`} onClick={handleBrandClick}><Brand compact /></a>
          <i className="mk-nav-divider" />
          {links.map((link, index) => (
            <a key={link.id} className={active === link.id ? 'active' : ''} href={link.href} onMouseEnter={() => setHovered(index)}>
              <span>{link.label}</span>
              {hovered === index && <motion.i layoutId="mk-nav-hover" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
            </a>
          ))}
          <a href={profile.links.linktree} target="_blank" rel="noreferrer" onMouseEnter={() => setHovered(links.length)}>
            <span>{t.nav.linktree}</span>
            {hovered === links.length && <motion.i layoutId="mk-nav-hover" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
          </a>
        </nav>
      </motion.header>

      <motion.header className={`mk-nav-mobile${navHidden ? ' is-hidden' : ''}`} animate={navMotion} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
        <nav>
          <a href="#hero" aria-label={`markkop.dev · ${t.nav.home}`} onClick={handleBrandClick}><Brand compact /></a>
          <div className="mk-nav-mobile-actions">
            <LanguageToggle variant="bar" />
            <button className="mk-nav-icon" type="button" onClick={toggleTheme} aria-label={t.accessibility.theme(theme)}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="mk-nav-menu" type="button" onClick={() => setOpen((value) => !value)} aria-label={t.accessibility.toggleMenu}>{open ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
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
                <motion.a href={profile.links.linktree} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + links.length * 0.04 }}>
                  <i />{t.nav.linktree}
                </motion.a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function getVisibleProjectTrack() {
  const track = document.querySelector('.mk-project-track')
  if (!(track instanceof HTMLElement)) return null
  if (getComputedStyle(track).display === 'none') return null
  return track
}

function nextScrollTop(scrollY: number) {
  const track = getVisibleProjectTrack()
  if (track) {
    const projectsSection = document.getElementById('projects')
    if (projectsSection && scrollY >= projectsSection.offsetTop - 80 && scrollY < track.offsetTop - 8) {
      return projectScrollTop(track, 0, projects.length)
    }
    const trackEnd = track.offsetTop + track.offsetHeight - innerHeight
    if (scrollY >= track.offsetTop - 8 && scrollY < trackEnd - 8) {
      const index = projectIndexAt(track, scrollY, projects.length)
      if (index < projects.length - 1) return projectScrollTop(track, index + 1, projects.length)
      const stack = document.getElementById('tech-stack')
      return stack ? stack.offsetTop : null
    }
  }

  const threshold = scrollY + 80
  for (const id of SECTION_IDS) {
    const element = document.getElementById(id)
    if (element && element.offsetTop > threshold) return element.offsetTop
  }
  return null
}

const DOCK_EASE = [0.16, 1, 0.3, 1] as const
const DOCK_NAV_EASE = [0.22, 1, 0.36, 1] as const

function ControlDock({
  theme,
  onToggleTheme,
  loaderActive,
  loaderChrome,
  onToggleStartup,
}: {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  loaderActive: boolean
  loaderChrome: boolean
  onToggleStartup: () => void
}) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const lenis = useLenis()
  const reduceMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)
  const [canGoDown, setCanGoDown] = useState(true)
  const isLinks = pathname.startsWith('/links')
  const showUtilities = !loaderActive || loaderChrome
  const showScrollButtons = !loaderActive && !isLinks

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setCanGoDown(nextScrollTop(latest) !== null)
  })
  useMotionValueEvent(scrollYProgress, 'change', (value) => setProgress(Math.round(value * 100)))

  const scrollToY = (top: number) => {
    if (lenis) lenis.scrollTo(top)
    else window.scrollTo({ top, behavior: 'smooth' })
  }

  const circumference = 2 * Math.PI * 24
  const atTop = progress <= 5
  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : {
        initial: { opacity: 0, x: 18 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 14 },
        transition: { duration: 0.55, delay: loaderActive ? 0.5 : 0, ease: DOCK_EASE },
      }
  const rise = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.94 },
      }

  return (
    <>
      <motion.div className="mk-top-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <aside className={`mk-dock${isDev ? ' debug' : ''}${loaderActive ? ' overlay' : ''}`}>
        {isDev && !isLinks ? (
          <button
            type="button"
            className={`mk-dock-btn${loaderActive ? ' active' : ''}`}
            onClick={onToggleStartup}
            aria-label={t.accessibility.startupUi(loaderActive)}
            aria-pressed={loaderActive}
          >
            <Sparkles size={18} />
          </button>
        ) : null}
        <AnimatePresence>
          {showUtilities ? (
            <motion.span key="dock-language" className="mk-dock-utilities mk-dock-btn-wrap" {...fade}>
              <LanguageToggle variant="dock" />
            </motion.span>
          ) : null}
          {showUtilities ? (
            <motion.button
              key="dock-theme"
              type="button"
              className="mk-dock-utilities mk-dock-btn"
              onClick={onToggleTheme}
              aria-label={t.accessibility.theme(theme)}
              {...fade}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          ) : null}
          {showScrollButtons ? (
            <motion.button
              key="dock-down"
              type="button"
              className="mk-dock-btn mk-to-bottom"
              onClick={() => {
                const top = nextScrollTop(window.scrollY)
                if (top !== null) scrollToY(top)
              }}
              disabled={!canGoDown}
              aria-label={t.accessibility.nextSection}
              {...rise}
              transition={reduceMotion ? rise.transition : { duration: 0.48, delay: 0.06, ease: DOCK_NAV_EASE }}
            >
              <span className="mk-to-bottom-arrows" aria-hidden="true"><ChevronDown /><ChevronDown /></span>
            </motion.button>
          ) : null}
          {showScrollButtons ? (
            <motion.button
              key="dock-up"
              type="button"
              className="mk-dock-btn mk-to-top"
              onClick={() => { if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={atTop}
              aria-label={t.accessibility.backToTop}
              {...rise}
              transition={reduceMotion ? rise.transition : { duration: 0.48, delay: 0.16, ease: DOCK_NAV_EASE }}
            >
              <svg className="mk-to-top-ring" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="24" /><circle className="progress" cx="30" cy="30" r="24" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} /></svg>
              <span className="mk-to-top-arrows" aria-hidden="true"><ChevronsUp /><ChevronsUp /></span>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </aside>
    </>
  )
}

export default function PortfolioShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [loaderPlayId, setLoaderPlayId] = useState(0)
  const [loaderDismissId, setLoaderDismissId] = useState(0)
  const [loaderActive, setLoaderActive] = useState(true)
  const [loaderChrome, setLoaderChrome] = useState(false)

  const replaySplash = useCallback(() => {
    sessionStorage.removeItem(SPLASH_STORAGE_KEY)
    setLoaderDismissId(0)
    setLoaderPlayId((value) => value + 1)
  }, [])

  const toggleStartupUi = useCallback(() => {
    if (loaderActive) setLoaderDismissId((value) => value + 1)
    else replaySplash()
  }, [loaderActive, replaySplash])

  return (
    <>
      <LoadingScreen key={loaderPlayId} forced={loaderPlayId > 0} dismissId={loaderDismissId} onActiveChange={setLoaderActive} onChromeChange={setLoaderChrome} />
      <a className="mk-skip" href="#main-content">{t.accessibility.skip}</a>
      <Navbar onBrandClick={replaySplash} />
      <ControlDock theme={theme} onToggleTheme={toggleTheme} loaderActive={loaderActive} loaderChrome={loaderChrome} onToggleStartup={toggleStartupUi} />
      {children}
    </>
  )
}
