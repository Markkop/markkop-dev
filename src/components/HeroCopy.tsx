'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Link as LinkIcon } from 'lucide-react'
import LinkedIn from '@/components/icons/LinkedIn'
import { useLanguage } from '@/context/LanguageContext'
import { profile } from '@/data/profile'

export function HeroCopy() {
  const { t } = useLanguage()
  return (
    <motion.div className="mk-hero-copy" initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
      <p className="mk-name">{profile.name}</p>
      <h1>
        <span className="mk-sr-only">{profile.name}. </span>
        <span>{t.hero.lead}</span>
        <strong>{t.hero.highlight}</strong>
        <small>{t.hero.summary}</small>
      </h1>
      <div className="mk-hero-actions">
        <a className="primary" href={profile.links.linkedin} target="_blank" rel="noreferrer"><LinkedIn size={16} />{t.nav.connect}</a>
        <a className="secondary" href={profile.links.instagram} target="_blank" rel="noreferrer"><Instagram size={16} />Follow</a>
        <Link className="secondary" href="/links"><LinkIcon size={16} />{t.nav.links}</Link>
      </div>
    </motion.div>
  )
}

export function HeroCaption() {
  const { t } = useLanguage()
  return (
    <span><strong>{profile.name}</strong><small>{t.hero.role}</small></span>
  )
}
