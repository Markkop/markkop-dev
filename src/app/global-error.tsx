'use client'

import localFont from 'next/font/local'
import ErrorScreen from '@/components/ErrorScreen'
import { useDocumentLanguage } from '@/context/LanguageContext'
import type { AppRouteError } from '@/lib/appError'
import './globals.css'

const monaSans = localFont({
  src: './fonts/MonaSans.woff2',
  display: 'swap',
  weight: '200 900',
  variable: '--font-mona-sans',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
})

const THEME_BOOT_SCRIPT =
  "try{document.documentElement.dataset.theme=localStorage.getItem('markkop-theme')||'dark';var language=localStorage.getItem('markkop-language')==='pt-BR'?'pt-BR':'en';document.documentElement.dataset.language=language;document.documentElement.lang=language}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.language='en';document.documentElement.lang='en'}"

export default function GlobalError({
  error,
  reset,
}: {
  error: AppRouteError
  reset: () => void
}) {
  const language = useDocumentLanguage()

  return (
    <html lang={language} className={`${monaSans.variable} ${monaSans.className}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <ErrorScreen error={error} reset={reset} />
      </body>
    </html>
  )
}
