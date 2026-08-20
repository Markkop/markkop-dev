'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { profile } from '@/data/profile'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mk-footer"><span>© 2026 {profile.name}</span><span>{t.footer.built}</span><span><motion.i animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>$</motion.i> mark --version 2026</span></footer>
  )
}
