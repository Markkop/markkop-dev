import type { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/seo'
import { LanguageProvider } from '@/context/LanguageContext'
import SmoothScroll from '@/components/SmoothScroll'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    'Marcelo Kopmann',
    'Mark Kop',
    'software engineer',
    'full-stack developer',
    'AI products',
    'Web3 developer',
    'Solidity',
    'TypeScript',
    'Brazil',
  ],
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  alternates: { canonical: '/' },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'profile',
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Marcelo Kopmann — Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.handle,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  colorScheme: 'dark light',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marcelo Kopmann',
  alternateName: 'Mark Kop',
  url: siteConfig.url,
  image: `${siteConfig.url}/avatar.png`,
  jobTitle: 'Software Engineer',
  worksFor: { '@type': 'Organization', name: 'Halborn' },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Santa Catarina',
    addressCountry: 'BR',
  },
  sameAs: Object.values(siteConfig.links),
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/brand-icon.png" />
        <link rel="apple-touch-icon" href="/brand-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('markkop-theme')||'dark';var language=localStorage.getItem('markkop-language')==='pt-BR'?'pt-BR':'en';document.documentElement.dataset.language=language;document.documentElement.lang=language}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.language='en'}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body><LanguageProvider><SmoothScroll>{children}</SmoothScroll></LanguageProvider></body>
    </html>
  )
}
