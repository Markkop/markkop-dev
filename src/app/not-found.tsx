import type { Metadata } from 'next'
import NotFoundContent from '@/components/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page not found — markkop.dev',
  description: 'This page does not exist on markkop.dev.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <NotFoundContent />
}
