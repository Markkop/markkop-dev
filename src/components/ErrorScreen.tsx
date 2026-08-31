'use client'

import { RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useDocumentLanguage } from '@/context/LanguageContext'
import { content } from '@/i18n/content'
import {
  formatErrorDump,
  formatErrorStack,
  getErrorEyebrow,
  reportAppError,
  type AppRouteError,
} from '@/lib/appError'

export default function ErrorScreen({
  error,
  reset,
}: {
  error: AppRouteError
  reset: () => void
}) {
  const language = useDocumentLanguage()
  const copy = content[language].error
  const eyebrow = getErrorEyebrow(error)
  const dump = formatErrorDump(error)
  const stack = formatErrorStack(error)

  useEffect(() => {
    reportAppError(error)
  }, [error])

  return (
    <main className="min-h-screen grid place-items-center px-6 bg-background text-foreground">
      <div className="terminal-card error-card max-w-xl w-full p-8 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-4xl font-bold mt-4">{copy.title}</h1>
        <p className="text-muted mt-4">{copy.text}</p>
        <p className="command error-quip">
          <span>$</span> {copy.quip}
        </p>
        <p className="output">{copy.quipHint}</p>
        <section className="error-dump" aria-label={copy.details}>
          <p className="error-dump-prompt">
            <span>$</span> {copy.dump}
          </p>
          <pre>
            <code>{dump}</code>
          </pre>
          {stack ? (
            <details className="error-stack">
              <summary>{copy.stack}</summary>
              <pre>
                <code>{stack}</code>
              </pre>
            </details>
          ) : null}
        </section>
        <button type="button" className="button button-primary mt-8 mx-auto" onClick={reset}>
          <RefreshCcw size={17} aria-hidden="true" />
          {copy.retry}
        </button>
      </div>
    </main>
  )
}
