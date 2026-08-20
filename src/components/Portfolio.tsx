'use client'

import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'
import About from '@/components/About'
import PortfolioShell from '@/components/PortfolioShell'

const ProjectShowcase = dynamic(() => import('@/components/ProjectShowcase'))
const StackShowcase = dynamic(() => import('@/components/StackShowcase'))
const Now = dynamic(() => import('@/components/Now'))
const Contact = dynamic(() => import('@/components/Contact'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function Portfolio({ children }: { children: ReactNode }) {
  return (
    <PortfolioShell>
      <main id="main-content">
        {children}
        <About />
        <ProjectShowcase />
        <StackShowcase />
        <Now />
        <Contact />
      </main>
      <Footer />
    </PortfolioShell>
  )
}
