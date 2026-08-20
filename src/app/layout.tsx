import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { siteConfig } from '@/config/seo'
import { profile } from '@/data/profile'
import { LanguageProvider } from '@/context/LanguageContext'
import SmoothScroll from '@/components/SmoothScroll'
import { SPLASH_BOOT_SCRIPT, SPLASH_BOOT_STYLE } from '@/lib/splash'
import './globals.css'

const monaSans = localFont({
  src: './fonts/MonaSans.woff2',
  display: 'swap',
  weight: '200 900',
  variable: '--font-mona-sans',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    'Marcelo "Mark" Kopmann',
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
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'profile',
    locale: 'en_US',
    images: [{ url: '/og.jpg', width: 1536, height: 1024, alt: 'Marcelo "Mark" Kopmann — Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.handle,
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  colorScheme: 'dark light',
  viewportFit: 'cover',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marcelo "Mark" Kopmann',
  alternateName: ['Mark Kop', 'Marcelo Kopmann'],
  url: siteConfig.url,
  image: `${siteConfig.url}/LISBON_229.jpg`,
  jobTitle: 'Software Engineer',
  worksFor: { '@type': 'Organization', name: 'Halborn' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Florianópolis',
    addressRegion: 'Santa Catarina',
    addressCountry: 'BR',
  },
  sameAs: [
    profile.links.github,
    profile.links.linkedin,
    profile.links.x,
    profile.links.instagram,
    profile.links.devto,
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${monaSans.variable} ${monaSans.className}`} suppressHydrationWarning>
      <head>
        <link rel="describedby" href="/llms.txt" />
        <style id="mk-splash-boot" dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_STYLE }} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('markkop-theme')||'dark';var language=localStorage.getItem('markkop-language')==='pt-BR'?'pt-BR':'en';document.documentElement.dataset.language=language;document.documentElement.lang=language}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.language='en'}(function(){var v=window.visualViewport;if(v&&v.scale!==1)return;var h=v?v.height:window.innerHeight;var b=v?Math.max(0,window.innerHeight-v.height-v.offsetTop):0;var r=document.documentElement.style;r.setProperty('--mk-vvh',h+'px');r.setProperty('--mk-vv-bottom',b+'px')})()" + SPLASH_BOOT_SCRIPT,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body><LanguageProvider><SmoothScroll>{children}</SmoothScroll></LanguageProvider></body>
    </html>
  )
}
