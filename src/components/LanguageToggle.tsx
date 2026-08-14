'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <button
      className={`language-toggle${compact ? ' compact' : ''}`}
      type="button"
      onClick={toggleLanguage}
      aria-label={t.language.switchLabel}
      title={t.language.switchLabel}
    >
      <Languages size={15} aria-hidden="true" />
      <span className={language === 'en' ? 'active' : ''}>EN</span>
      <i>/</i>
      <span className={language === 'pt-BR' ? 'active' : ''}>PT</span>
    </button>
  )
}
