import type { Metadata } from 'next'
import Portfolio from '@/components/Portfolio'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return <Portfolio />
}
