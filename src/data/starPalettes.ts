export type StarPalette = {
  primary: string
  secondary: string
  ice: string
  fog: string
  glow: string
}

export const STAR_PALETTES: Record<string, StarPalette> = {
  prisma: { primary: '#22d3ee', secondary: '#3b82f6', ice: '#bfe8ff', fog: '#03060f', glow: '#bffcff' },
  halborn: { primary: '#c5ff01', secondary: '#8fd400', ice: '#eeffb8', fog: '#030805', glow: '#d8ff55' },
  habitchain: { primary: '#8b5cf6', secondary: '#a78bfa', ice: '#e9d5ff', fog: '#0b0810', glow: '#d8b4fe' },
  'todo-idle-quest': { primary: '#c4a574', secondary: '#6d5848', ice: '#f1e6d6', fog: '#1f130b', glow: '#e8d5b5' },
  wedding: { primary: '#f472b6', secondary: '#e879f9', ice: '#fbcfe8', fog: '#140814', glow: '#f9a8d4' },
  'corvo-astral': { primary: '#60a5fa', secondary: '#2563eb', ice: '#dbeafe', fog: '#030712', glow: '#bfdbfe' },
}

export const STAR_PALETTES_LIGHT: Record<string, StarPalette> = {
  prisma: { primary: '#0891b2', secondary: '#2563eb', ice: '#0284c7', fog: '#ffffff', glow: '#22d3ee' },
  halborn: { primary: '#111111', secondary: '#2a2a2a', ice: '#6b7280', fog: '#ffffff', glow: '#404040' },
  habitchain: { primary: '#7c3aed', secondary: '#6d28d9', ice: '#a78bfa', fog: '#ffffff', glow: '#8b5cf6' },
  'todo-idle-quest': { primary: '#6d5848', secondary: '#382e27', ice: '#8c7462', fog: '#ffffff', glow: '#c4a574' },
  wedding: { primary: '#db2777', secondary: '#c026d3', ice: '#ec4899', fog: '#ffffff', glow: '#f472b6' },
  'corvo-astral': { primary: '#2563eb', secondary: '#1d4ed8', ice: '#3b82f6', fog: '#ffffff', glow: '#60a5fa' },
}

export function starPaletteFor(slug: string, theme: 'dark' | 'light' = 'dark'): StarPalette {
  const palettes = theme === 'light' ? STAR_PALETTES_LIGHT : STAR_PALETTES
  return palettes[slug] ?? palettes.prisma ?? STAR_PALETTES.prisma
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]
}

function channelLuminance(value: number) {
  const srgb = value / 255
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

function darkenHex(hex: string, amount: number) {
  const scale = 1 - amount
  return `#${hexToRgb(hex).map((channel) => Math.round(channel * scale).toString(16).padStart(2, '0')).join('')}`
}

export function starAccentVars(slug: string, theme: 'dark' | 'light' = 'dark'): Record<string, string> {
  const palette = starPaletteFor(slug, slug === 'halborn' ? theme : 'dark')
  const [r, g, b] = hexToRgb(palette.primary)
  const luminance = 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
  return {
    '--mk-accent': palette.primary,
    '--mk-accent-rgb': `${r}, ${g}, ${b}`,
    '--mk-accent-deep': darkenHex(palette.primary, 0.18),
    '--mk-accent-ink': luminance > 0.45 ? '#0b0b0b' : '#ffffff',
  }
}
