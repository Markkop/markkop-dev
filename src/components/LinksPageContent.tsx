'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Github, Instagram, Linkedin, Radio, Twitter } from 'lucide-react'
import { profile, projects } from '@/data/profile'
import { useLanguage } from '@/context/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

export default function LinksPageContent() {
  const { t } = useLanguage()
  const socials = [
    { name: 'GitHub', description: t.links.github, href: profile.links.github, icon: Github },
    { name: 'LinkedIn', description: t.links.linkedin, href: profile.links.linkedin, icon: Linkedin },
    { name: 'X / Twitter', description: '@heymarkkop', href: profile.links.x, icon: Twitter },
    { name: 'Instagram', description: '@markkop.dev', href: profile.links.instagram, icon: Instagram },
  ]

  return (
    <main className="links-page">
      <div className="links-grid" aria-hidden="true" />
      <div className="links-shell">
        <div className="links-topbar">
          <Link href="/" className="brand" aria-label={t.links.back}>markkop.dev<span>_</span></Link>
          <LanguageToggle />
        </div>
        <header className="links-header">
          <div className="avatar-ring">
            <Image src="/LISBON_229.jpg" alt={profile.name} fill sizes="128px" priority />
          </div>
          <p className="eyebrow">{t.links.eyebrow}</p>
          <h1>Marcelo <span>&quot;Mark&quot;</span> Kopmann</h1>
          <p>{t.links.summary}</p>
          <div className="tag-row"><span>TypeScript</span><span>{t.links.ai}</span><span>Web3</span><span>{t.links.openSource}</span></div>
        </header>

        <section className="links-section">
          <h2><Radio size={14} /> {t.links.connect}</h2>
          {socials.map(({ icon: Icon, ...item }, index) => (
            <a key={item.name} className={`link-card ${index === 1 ? 'primary' : ''}`} href={item.href} target="_blank" rel="noreferrer">
              <span className="link-icon"><Icon size={20} /></span>
              <span><strong>{item.name}</strong><small>{item.description}</small></span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </section>

        <section className="links-section">
          <h2><Radio size={14} /> {t.links.selectedWork}</h2>
          {projects.slice(0, 6).map((project) => {
            const copy = t.projects.items[project.slug] ?? project
            return (
              <a key={project.slug} className="link-card" href={project.live} target="_blank" rel="noreferrer">
                <span className="link-icon">{project.title.slice(0, 2).toUpperCase()}</span>
                <span><strong>{project.title}</strong><small>{copy.category} · {copy.metric}</small></span>
                <ArrowUpRight size={18} />
              </a>
            )
          })}
        </section>
      </div>
    </main>
  )
}
