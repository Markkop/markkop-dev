'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Tech = { name: string; category: 'Frontend' | 'Backend' | 'Onchain' | 'Tools'; role?: string; core?: boolean; logo?: string }
type Cell = { type: 'label'; name: string; description: string } | ({ type: 'tech' } & Tech)

const tech: Tech[] = [
  { name: 'TypeScript', category: 'Frontend', role: 'Type Safety', core: true, logo: '/techstackicons/typescript-icon-svgrepo-com.svg' },
  { name: 'React', category: 'Frontend', role: 'UI Library', core: true, logo: '/techstackicons/react-svgrepo-com.svg' },
  { name: 'Next.js', category: 'Frontend', role: 'Framework', core: true, logo: '/techstackicons/next.svg' },
  { name: 'Svelte', category: 'Frontend' }, { name: 'Tailwind CSS', category: 'Frontend', logo: '/techstackicons/tailwindcss-icon-svgrepo-com.svg' },
  { name: 'Node.js', category: 'Backend', role: 'Runtime', core: true, logo: '/techstackicons/nodejs-icon-svgrepo-com.svg' },
  { name: 'Elixir', category: 'Backend' }, { name: 'PostgreSQL', category: 'Backend', role: 'Database', core: true, logo: '/techstackicons/postgresql-svgrepo-com.svg' },
  { name: 'Supabase', category: 'Backend', logo: '/techstackicons/supabase-logo-icon.svg' }, { name: 'REST APIs', category: 'Backend' },
  { name: 'Solidity', category: 'Onchain', role: 'Contracts', core: true }, { name: 'Hardhat', category: 'Onchain' },
  { name: 'Foundry', category: 'Onchain' }, { name: 'EVM', category: 'Onchain' }, { name: 'Polkadot', category: 'Onchain' },
  { name: 'GitHub', category: 'Tools', role: 'Source Control', core: true, logo: '/techstackicons/github (1).svg' },
  { name: 'Docker', category: 'Tools', role: 'Containers', core: true, logo: '/techstackicons/docker-svgrepo-com.svg' },
  { name: 'Vercel', category: 'Tools', logo: '/techstackicons/vercel.svg' }, { name: 'OpenAI', category: 'Tools' },
  { name: 'Forgejo', category: 'Tools' }, { name: 'VS Code', category: 'Tools', logo: '/techstackicons/Visual Studio Code (VS Code).svg' },
]

const descriptions: Record<Tech['category'], string> = {
  Frontend: 'Responsive, fast and expressive product interfaces.', Backend: 'Reliable APIs, data and application systems.',
  Onchain: 'Contracts, incentives and decentralized products.', Tools: 'Delivery, automation and daily engineering workflows.',
}

const categories: Tech['category'][] = ['Frontend', 'Backend', 'Onchain', 'Tools']

function Hex({ cell, index, mobile = false }: { cell: Cell; index: number; mobile?: boolean }) {
  const label = cell.type === 'label'
  const core = cell.type === 'tech' && cell.core
  const logo = cell.type === 'tech' ? cell.logo : undefined
  const role = cell.type === 'tech' ? cell.role : undefined
  return (
    <div className={`mk-hex${mobile ? ' mobile' : ''}${label ? ' label' : ''}${core ? ' core' : ''}`}>
      <svg viewBox="0 0 100 115" aria-hidden="true">
        <defs><linearGradient id={`hex-${mobile ? 'm' : 'd'}-${index}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" /><stop offset="1" /></linearGradient></defs>
        <polygon points="50 0,93.3 25,93.3 90,50 115,6.7 90,6.7 25" fill={`url(#hex-${mobile ? 'm' : 'd'}-${index})`} />
        <polygon className="inner" points="50 5,89 27,89 88,50 110,11 88,11 27" />
      </svg>
      <div className="mk-hex-content">
        {label ? <strong>{cell.name}</strong> : <>
          <span className="mk-hex-icon">{logo ? <Image src={logo} alt={cell.name} fill sizes="56px" /> : <b>{cell.name.slice(0, 2)}</b>}{core && <i>✓</i>}</span>
          <small>{cell.name}</small>{role && <em>{role}</em>}
        </>}
      </div>
      <div className="mk-hex-tooltip"><strong>{cell.name}</strong><small>{label ? cell.description : role}</small></div>
    </div>
  )
}

function AssemblingHex({ cell, index, progress, from, to }: { cell: Cell; index: number; progress: MotionValue<number>; from: { x: number; y: number; r: number }; to: { x: number; y: number } }) {
  const start = index * 0.005
  const x = useTransform(progress, [start, 0.8], [from.x, to.x])
  const y = useTransform(progress, [start, 0.8], [from.y, to.y])
  const rotate = useTransform(progress, [start, 0.8], [from.r, 0])
  const scale = useTransform(progress, [start, start + 0.15, 0.8], [0.3, 0.85, 1])
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1])
  return <motion.div suppressHydrationWarning className="mk-scattered-hex" style={{ x, y, rotate, scale, opacity }}><Hex cell={cell} index={index} /></motion.div>
}

function seeded(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

const rounded = (value: number) => Math.round(value * 1000) / 1000

export default function StackShowcase() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const cells = useMemo<Cell[]>(() => categories.flatMap((category) => [
    { type: 'label', name: category, description: descriptions[category] },
    ...tech.filter((item) => item.category === category).map((item) => ({ type: 'tech' as const, ...item })),
  ]), [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const assembled = useMemo(() => {
    const cols = 7, width = 120, height = 104, rows = Math.ceil(cells.length / cols)
    return cells.map((_, index) => {
      const row = Math.floor(index / cols), col = index % cols
      return { x: col * width + (row % 2 ? 60 : 0) - cols * width / 2 + width / 2, y: row * height - rows * height / 2 + height / 2 }
    })
  }, [cells])
  const scattered = useMemo(() => cells.map((_, index) => ({
    x: rounded((seeded(index * 3 + 1) - 0.5) * 900),
    y: rounded((seeded(index * 3 + 2) - 0.5) * 600),
    r: rounded((seeded(index * 3 + 3) - 0.5) * 90),
  })), [cells])

  return (
    <section id="tech-stack" className="mk-stack-root">
      <div className="mk-stack-mobile mk-section-dark">
        <header className="mk-stack-heading"><p>{t.stack.eyebrow}</p><h2>{t.stack.title} {t.stack.titleHighlight}</h2><span>{t.stack.intro}</span></header>
        <div className="mk-mobile-hexes">{cells.map((cell, index) => <motion.div key={`${cell.name}-${index}`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: index * 0.025 }}><Hex cell={cell} index={index} mobile /></motion.div>)}</div>
      </div>
      <div className="mk-stack-intro mk-section-dark"><header className="mk-stack-heading"><p>{t.stack.eyebrow}</p><h2>{t.stack.title} {t.stack.titleHighlight}</h2><span>{t.stack.intro}</span><small><ChevronDown />Scroll to assemble</small></header></div>
      <div className="mk-stack-track" ref={ref}>
        <div className="mk-stack-stage">{cells.map((cell, index) => <AssemblingHex key={`${cell.name}-${index}`} cell={cell} index={index} progress={scrollYProgress} from={scattered[index]} to={assembled[index]} />)}</div>
      </div>
    </section>
  )
}
