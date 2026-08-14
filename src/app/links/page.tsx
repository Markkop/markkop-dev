import type { Metadata } from 'next'
import { siteConfig } from '@/config/seo'
import LinksPageContent from '@/components/LinksPageContent'

export const metadata: Metadata = {
  title: 'Links — Marcelo Kopmann',
  description: 'Projects, code, and social links for Marcelo Kopmann.',
  alternates: { canonical: '/links' },
  openGraph: { url: `${siteConfig.url}/links`, images: ['/og.png'] },
}

export default function LinksPage() {
  return <LinksPageContent />
}
