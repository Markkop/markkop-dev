'use client'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { content, type Language, type SiteContent } from '@/i18n/content'

const STORAGE_KEY = 'markkop-language'
const languageListeners = new Set<() => void>()

function getLanguageSnapshot(): Language {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.dataset.language === 'pt-BR' ? 'pt-BR' : 'en'
}

function subscribeToLanguage(listener: () => void) {
  languageListeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      const nextLanguage = event.newValue === 'pt-BR' ? 'pt-BR' : 'en'
      document.documentElement.dataset.language = nextLanguage
      document.documentElement.lang = nextLanguage
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    languageListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: SiteContent
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore<Language>(subscribeToLanguage, getLanguageSnapshot, () => 'en')

  const setLanguage = useCallback((nextLanguage: Language) => {
    document.documentElement.dataset.language = nextLanguage
    document.documentElement.lang = nextLanguage
    try { localStorage.setItem(STORAGE_KEY, nextLanguage) } catch { /* Keep the in-page switch functional. */ }
    languageListeners.forEach((listener) => listener())
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(getLanguageSnapshot() === 'en' ? 'pt-BR' : 'en')
  }, [setLanguage])

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage, t: content[language] }), [language, setLanguage, toggleLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

/** Language from the document, usable outside LanguageProvider (e.g. global-error). */
export function useDocumentLanguage(): Language {
  return useSyncExternalStore(subscribeToLanguage, getLanguageSnapshot, () => 'en')
}
