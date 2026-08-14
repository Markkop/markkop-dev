import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Github, Linkedin, Radio, Twitter } from 'lucide-react'
import { profile, projects } from '@/data/profile'
import { siteConfig } from '@/config/seo'

export const metadata: Metadata = {
  title: 'Links — Marcelo Kopmann',
  description: 'Projects, code, and social links for Marcelo Kopmann.',
  alternates: { canonical: '/links' },
  openGraph: { url: `${siteConfig.url}/links`, images: ['/og.png'] },
}

const socials = [
  { name: 'GitHub', description: 'Open-source projects and experiments', href: profile.links.github, icon: Github },
  { name: 'LinkedIn', description: 'Professional profile and contact', href: profile.links.linkedin, icon: Linkedin },
  { name: 'X / Twitter', description: '@heymarkkop', href: profile.links.x, icon: Twitter },
]

export default function LinksPage() {
  return (
    <main className="links-page">
      <div className="links-grid" aria-hidden="true" />
      <div className="links-shell">
        <Link href="/" className="brand" aria-label="Back to markkop.dev">markkop.dev<span>_</span></Link>
        <header className="links-header">
          <div className="avatar-ring">
            <Image src="/avatar.png" alt="Marcelo Kopmann" fill sizes="128px" priority />
          </div>
          <p className="eyebrow">{'// LINKS'}</p>
          <h1>Marcelo <span>/</span> Kopmann</h1>
          <p>Software engineer building useful, playful, and open products.</p>
          <div className="tag-row"><span>TypeScript</span><span>AI</span><span>Web3</span><span>Open source</span></div>
        </header>

        <section className="links-section">
          <h2><Radio size={14} /> Connect</h2>
          {socials.map(({ icon: Icon, ...item }, index) => (
            <a key={item.name} className={`link-card ${index === 1 ? 'primary' : ''}`} href={item.href} target="_blank" rel="noreferrer">
              <span className="link-icon"><Icon size={20} /></span>
              <span><strong>{item.name}</strong><small>{item.description}</small></span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </section>

        <section className="links-section">
          <h2><Radio size={14} /> Selected work</h2>
          {projects.slice(0, 6).map((project) => (
            <a key={project.slug} className="link-card" href={project.live} target="_blank" rel="noreferrer">
              <span className="link-icon">{project.title.slice(0, 2).toUpperCase()}</span>
              <span><strong>{project.title}</strong><small>{project.category} · {project.metric}</small></span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </section>
      </div>
    </main>
  )
}
