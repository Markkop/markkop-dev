export type StarPalette = {
  primary: string
  secondary: string
  ice: string
  fog: string
  glow: string
}

export const STAR_PALETTES: Record<string, StarPalette> = {
  prisma: { primary: '#22d3ee', secondary: '#3b82f6', ice: '#bfe8ff', fog: '#03060f', glow: '#bffcff' },
  habitchain: { primary: '#8b5cf6', secondary: '#a78bfa', ice: '#e9d5ff', fog: '#0b0810', glow: '#d8b4fe' },
  wedding: { primary: '#f472b6', secondary: '#fb7185', ice: '#fce7f3', fog: '#12080f', glow: '#fbcfe8' },
  'corvo-astral': { primary: '#60a5fa', secondary: '#2563eb', ice: '#dbeafe', fog: '#030712', glow: '#bfdbfe' },
}

export function starPaletteFor(slug: string): StarPalette {
  return STAR_PALETTES[slug] ?? STAR_PALETTES.prisma
}
