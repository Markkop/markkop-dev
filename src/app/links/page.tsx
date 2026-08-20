import type { Metadata } from 'next'
import { siteConfig } from '@/config/seo'
import LinksPageContent from '@/components/LinksPageContent'
import './links.css'

export const metadata: Metadata = {
  title: 'Links — Marcelo "Mark" Kopmann',
  description: 'Projects, code, and social links for Marcelo "Mark" Kopmann.',
  alternates: { canonical: '/links' },
  openGraph: { url: `${siteConfig.url}/links`, images: ['/og.jpg'] },
}

export default function LinksPage() {
  return <LinksPageContent />
}
