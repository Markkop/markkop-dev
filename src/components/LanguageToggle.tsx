'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle({ variant = 'nav' }: { variant?: 'nav' | 'dock' }) {
  const { toggleLanguage, t } = useLanguage()
  const isDock = variant === 'dock'

  return (
    <button
      className={isDock ? 'mk-dock-btn' : 'language-toggle'}
      type="button"
      onClick={toggleLanguage}
      aria-label={t.language.switchLabel}
      title={t.language.switchLabel}
    >
      <Languages size={isDock ? 18 : 15} aria-hidden="true" />
    </button>
  )
}
