'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle({ variant = 'nav' }: { variant?: 'nav' | 'dock' | 'bar' }) {
  const { toggleLanguage, t } = useLanguage()
  const className = variant === 'dock' ? 'mk-dock-btn' : variant === 'bar' ? 'mk-nav-icon' : 'language-toggle'
  const iconSize = variant === 'dock' ? 18 : variant === 'bar' ? 20 : 15

  return (
    <button
      className={className}
      type="button"
      onClick={toggleLanguage}
      aria-label={t.language.switchLabel}
      title={t.language.switchLabel}
    >
      <Languages size={iconSize} aria-hidden="true" />
    </button>
  )
}
