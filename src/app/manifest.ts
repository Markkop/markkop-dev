import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Marcelo "Mark" Kopmann — Software Engineer',
    short_name: 'markkop.dev',
    description: 'Web, AI, open-source, gamified, and onchain products by Marcelo "Mark" Kopmann.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0810',
    theme_color: '#8b5cf6',
    icons: [{ src: '/brand-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
  }
}
