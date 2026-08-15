'use client'

import { RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLanguage()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen grid place-items-center px-6 bg-background text-foreground">
      <div className="terminal-card max-w-xl w-full p-8 text-center">
        <p className="eyebrow">{'// 500'}</p>
        <h1 className="text-4xl font-bold mt-4">{t.error.title}</h1>
        <p className="text-muted mt-4">{t.error.text}</p>
        <button type="button" className="button button-primary mt-8 mx-auto" onClick={reset}>
          <RefreshCcw size={17} />
          {t.error.retry}
        </button>
      </div>
    </main>
  )
}
