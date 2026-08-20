'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Calendar, Download } from 'lucide-react'
import PortfolioShell from '@/components/PortfolioShell'
import { useLanguage } from '@/context/LanguageContext'
import { profile } from '@/data/profile'

const PortfolioBelowFold = dynamic(() => import('@/components/PortfolioBelowFold'), { ssr: true })

function Hero() {
  const { t } = useLanguage()
  return (
    <section id="hero" className="mk-hero">
      <div className="mk-hero-glow" />
      <div className="mk-hero-inner">
        <div className="mk-hero-copy">
          <p className="mk-name">{profile.name}</p>
          <h1>
            <span className="mk-sr-only">{profile.name}. </span>
            <span>{t.hero.lead}</span>
            <strong>{t.hero.highlight}</strong>
            <small>{t.hero.summary}</small>
          </h1>
          <div className="mk-hero-actions">
            <a className="primary" href={profile.links.linkedin} target="_blank" rel="noreferrer"><Calendar size={16} />{t.nav.connect}</a>
            <Link className="secondary" href="/links"><Download size={16} />{t.nav.links}</Link>
          </div>
        </div>

        <div className="mk-portrait">
          <i />
          <div>
            <Image src="/LISBON_229.jpg" alt={`${profile.name} — ${t.hero.role}`} fill sizes="(max-width: 1024px) 100vw, 50vw" priority fetchPriority="high" />
            <span><strong>{profile.name}</strong><small>{t.hero.role}</small></span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mk-footer"><span>© 2026 {profile.name}</span><span>{t.footer.built}</span><span>$ mark --version 2026</span></footer>
  )
}

export default function Portfolio() {
  return (
    <PortfolioShell>
      <main id="main-content">
        <Hero />
        <PortfolioBelowFold />
      </main>
      <Footer />
    </PortfolioShell>
  )
}
