import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Portfolio from '@/components/Portfolio'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <Portfolio>
      <Hero />
    </Portfolio>
  )
}
