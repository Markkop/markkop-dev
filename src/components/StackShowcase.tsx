'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { stack, type StackTech } from '@/data/profile'
import { invertOnLightLogos, stackLogos } from '@/data/techLogos'

type Tech = { name: StackTech; logo: string }

const tech: Tech[] = (Object.keys(stackLogos) as StackTech[]).map((name) => ({ name, logo: stackLogos[name] }))

const stacksByTech = new Map<StackTech, ReadonlySet<StackTech>[]>()
for (const { items } of stack) {
  const members = new Set<StackTech>(items)
  for (const name of items) {
    const matches = stacksByTech.get(name) ?? []
    matches.push(members)
    stacksByTech.set(name, matches)
  }
}

function randomStack(name: StackTech) {
  const matches = stacksByTech.get(name) ?? [new Set<StackTech>([name])]
  return matches[Math.floor(Math.random() * matches.length)]
}

function Hex({ item, index, mobile = false, lit = false, onEnter, onLeave, onToggle }: {
  item: Tech
  index: number
  mobile?: boolean
  lit?: boolean
  onEnter: (name: StackTech) => void
  onLeave: () => void
  onToggle: (name: StackTech) => void
}) {
  return (
    <button
      type="button"
      className={`mk-hex${mobile ? ' mobile' : ''}${lit ? ' lit' : ''}`}
      aria-pressed={lit}
      aria-label={item.name}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') onEnter(item.name) }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') onLeave() }}
      onPointerUp={(event) => { if (event.pointerType !== 'mouse') onToggle(item.name) }}
    >
      <svg viewBox="0 0 100 115" aria-hidden="true">
        <defs><linearGradient id={`hex-${mobile ? 'm' : 'd'}-${index}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" /><stop offset="1" /></linearGradient></defs>
        <polygon points="50 0,93.3 25,93.3 90,50 115,6.7 90,6.7 25" fill={`url(#hex-${mobile ? 'm' : 'd'}-${index})`} />
        <polygon className="inner" points="50 5,89 27,89 88,50 110,11 88,11 27" />
      </svg>
      <div className="mk-hex-content">
        <span className={`mk-hex-icon${invertOnLightLogos.has(item.name) ? ' mk-tech-invert' : ''}`}><Image src={item.logo} alt="" fill sizes="56px" /></span>
        <small>{item.name}</small>
      </div>
    </button>
  )
}

const assembleSpan = 0.4
const holdSpan = 0.2 / 3
const assembledAt = assembleSpan / (assembleSpan + holdSpan)

function AssemblingHex({ cell, index, progress, from, to, lit, onEnter, onLeave, onToggle }: {
  cell: Tech
  index: number
  progress: MotionValue<number>
  from: { x: number; y: number; r: number }
  to: { x: number; y: number }
  lit: boolean
  onEnter: (name: StackTech) => void
  onLeave: () => void
  onToggle: (name: StackTech) => void
}) {
  const start = index * 0.005
  const x = useTransform(progress, [start, assembledAt], [from.x, to.x])
  const y = useTransform(progress, [start, assembledAt], [from.y, to.y])
  const rotate = useTransform(progress, [start, assembledAt], [from.r, 0])
  const scale = useTransform(progress, [start, start + 0.15, assembledAt], [0.3, 0.85, 1])
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1])
  return (
    <motion.div suppressHydrationWarning className={`mk-scattered-hex${lit ? ' lit' : ''}`} style={{ x, y, rotate, scale, opacity }}>
      <Hex item={cell} index={index} lit={lit} onEnter={onEnter} onLeave={onLeave} onToggle={onToggle} />
    </motion.div>
  )
}

function seeded(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

const rounded = (value: number) => Math.round(value * 1000) / 1000

const HEX_BOX_W = 120
const HEX_BOX_H = 138
const HEX_VISUAL_W = 104
const HEX_GAP = 16
const HEX_MAX_ROWS = 3

function honeycombPositions(count: number, scale: number, cols: number) {
  const rows = Math.ceil(count / cols)
  const width = (HEX_VISUAL_W + HEX_GAP) * scale
  const height = (HEX_BOX_H * 0.75 + HEX_GAP) * scale
  const points = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    return {
      x: col * width + (row % 2 ? width / 2 : 0) - cols * width / 2 + width / 2,
      y: row * height - rows * height / 2 + height / 2,
    }
  })
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const point of points) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }
  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2
  return {
    positions: points.map((point) => ({ x: rounded(point.x - midX), y: rounded(point.y - midY) })),
    gridW: maxX - minX + HEX_BOX_W * scale,
    gridH: maxY - minY + HEX_BOX_H * scale,
  }
}

function fitHoneycombScale(count: number, cols: number, areaWidth: number, areaHeight: number) {
  const { gridW, gridH } = honeycombPositions(count, 1, cols)
  const pad = 12
  const scale = Math.min((areaWidth - pad * 2) / gridW, (areaHeight - pad * 2) / gridH)
  return Math.max(rounded(scale), 0.45)
}

function honeycombCols(count: number, areaWidth: number, areaHeight: number) {
  const pick = (candidates: number[]) => {
    let bestCols = candidates[0] ?? 3
    let bestScale = -1
    for (const cols of candidates) {
      if (cols < 2 || cols > count) continue
      const scale = fitHoneycombScale(count, cols, areaWidth, areaHeight)
      if (scale > bestScale) {
        bestScale = scale
        bestCols = cols
      }
    }
    return bestCols
  }

  if (areaWidth < 720) return 3
  if (areaWidth < 1200) return pick([4, 5, 6])
  const threeRow = Math.ceil(count / HEX_MAX_ROWS)
  return pick([threeRow, threeRow + 1])
}

function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 1200, height: 640 })
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      const next = { width: element.clientWidth, height: element.clientHeight }
      setSize((prev) => prev.width === next.width && prev.height === next.height ? prev : next)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return size
}

export default function StackShowcase() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const [activeStack, setActiveStack] = useState<{ tech: StackTech; members: ReadonlySet<StackTech> } | null>(null)
  const leaveTimer = useRef(0)
  const cells = tech
  const highlighted = activeStack?.members ?? null
  const onEnter = useCallback((name: StackTech) => {
    window.clearTimeout(leaveTimer.current)
    setActiveStack({ tech: name, members: randomStack(name) })
  }, [])
  const onLeave = useCallback(() => {
    leaveTimer.current = window.setTimeout(() => setActiveStack(null), 80)
  }, [])
  const onToggle = useCallback((name: StackTech) => {
    window.clearTimeout(leaveTimer.current)
    setActiveStack((current) => current?.tech === name ? null : { tech: name, members: randomStack(name) })
  }, [])
  const mobileRows = useMemo(() => {
    const rows: Tech[][] = []
    let index = 0
    let cols = 3
    while (index < cells.length) {
      rows.push(cells.slice(index, index + cols))
      index += cols
      cols = cols === 3 ? 2 : 3
    }
    return rows
  }, [cells])

  const canvasRef = useRef<HTMLDivElement>(null)
  const area = useElementSize(canvasRef)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const hexCols = useMemo(() => honeycombCols(cells.length, area.width, area.height), [cells.length, area.width, area.height])
  const hexScale = useMemo(() => fitHoneycombScale(cells.length, hexCols, area.width, area.height), [cells.length, hexCols, area.width, area.height])
  const assembled = useMemo(() => honeycombPositions(cells.length, hexScale, hexCols).positions, [cells.length, hexScale, hexCols])
  const scattered = useMemo(() => cells.map((_, index) => ({
    x: rounded((seeded(index * 3 + 1) - 0.5) * area.width),
    y: rounded((seeded(index * 3 + 2) - 0.5) * area.height),
    r: rounded((seeded(index * 3 + 3) - 0.5) * 90),
  })), [cells, area.width, area.height])
  const canvasVars = {
    '--hex-w': `${rounded(HEX_BOX_W * hexScale)}px`,
    '--hex-h': `${rounded(HEX_BOX_H * hexScale)}px`,
    '--hex-icon': `${rounded(54 * hexScale)}px`,
    '--hex-label': `${Math.max(7, rounded(10 * hexScale))}px`,
  } as CSSProperties

  return (
    <section id="tech-stack" className="mk-stack-root">
      <div className="mk-stack-mobile mk-section-dark">
        <header className="mk-stack-heading"><p>{t.stack.eyebrow}</p><h2>{t.stack.title} {t.stack.titleHighlight}</h2><span>{t.stack.intro}</span></header>
        <div className="mk-mobile-hexes">{mobileRows.map((row, rowIndex) => <div className="mk-mobile-hex-row" key={`row-${rowIndex}`}>{row.map((cell, columnIndex) => {
          const index = mobileRows.slice(0, rowIndex).reduce((sum, current) => sum + current.length, 0) + columnIndex
          const lit = highlighted ? highlighted.has(cell.name) : false
          return <motion.div key={`${cell.name}-${index}`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '80px' }} transition={{ duration: 0.45, delay: index * 0.03 }}><Hex item={cell} index={index} mobile lit={lit} onEnter={onEnter} onLeave={onLeave} onToggle={onToggle} /></motion.div>
        })}</div>)}</div>
      </div>
      <div className="mk-stack-track" ref={ref}>
        <div className="mk-stack-stage">
          <header className="mk-stack-heading">
            <p>{t.stack.eyebrow}</p>
            <h2>{t.stack.title} {t.stack.titleHighlight}</h2>
            <span>{t.stack.intro}</span>
            <motion.small style={{ opacity: cueOpacity }}><ChevronDown />{t.stack.assemble}</motion.small>
          </header>
          <div className="mk-stack-canvas" ref={canvasRef} style={canvasVars}>{cells.map((cell, index) => {
            const lit = highlighted ? highlighted.has(cell.name) : false
            return <AssemblingHex key={`${cell.name}-${index}`} cell={cell} index={index} progress={scrollYProgress} from={scattered[index]} to={assembled[index]} lit={lit} onEnter={onEnter} onLeave={onLeave} onToggle={onToggle} />
          })}</div>
        </div>
      </div>
    </section>
  )
}
