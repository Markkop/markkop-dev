'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowUpRight, Github, Instagram, Twitter } from 'lucide-react'
import DevTo from '@/components/icons/DevTo'
import LinkedIn from '@/components/icons/LinkedIn'
import { ExpandableProject, ExpandableTalk } from '@/components/LinksExpandableCard'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from '@/components/ThemeToggle'
import { extraProjects, projectToExtra, sortProjectsByDate } from '@/data/extraProjects'
import { profile, projects } from '@/data/profile'
import { talks } from '@/data/talks'
import { useLanguage } from '@/context/LanguageContext'

const StarsBackground = dynamic(() => import('@/components/StarsBackground'), { ssr: false })

export default function LinksPageContent() {
  const { t, language } = useLanguage()
  const [openTalk, setOpenTalk] = useState<string | null>(null)
  const [openProject, setOpenProject] = useState<string | null>(null)
  const socials = [
    { name: 'GitHub', description: t.links.github, href: profile.links.github, icon: Github },
    { name: 'LinkedIn', description: t.links.linkedin, href: profile.links.linkedin, icon: LinkedIn },
    { name: 'X / Twitter', description: '@heymarkkop', href: profile.links.x, icon: Twitter },
    { name: 'Instagram', description: '@markkop.dev', href: profile.links.instagram, icon: Instagram },
    { name: t.links.blog, description: t.links.blogDescription, href: profile.links.devto, icon: DevTo },
  ]

  return (
    <main className="links-page">
      <div className="links-stars" aria-hidden="true">
        <StarsBackground slug="habitchain" />
      </div>
      <div className="links-shell">
        <div className="links-topbar">
          <Link href="/" className="brand" aria-label={t.links.back}>markkop.dev<span>_</span></Link>
          <div className="links-topbar-actions">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <header className="links-header">
          <div className="avatar-ring">
            <Image src="/LISBON_229.jpg" alt={profile.name} fill sizes="128px" priority />
          </div>
        </header>

        <section className="links-section">
          <h2>// {t.links.connect}</h2>
          {socials.map(({ icon: Icon, ...item }) => (
            <a key={item.name} className="link-card" href={item.href} target="_blank" rel="noreferrer">
              <span className="link-icon"><Icon size={20} /></span>
              <span><strong>{item.name}</strong><small>{item.description}</small></span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </section>

        <section className="links-section">
          <h2>// {t.links.talks}</h2>
          {talks.map((talk) => (
            <ExpandableTalk
              key={talk.slug}
              talk={talk}
              language={language}
              open={openTalk === talk.slug}
              onToggle={() => setOpenTalk((current) => current === talk.slug ? null : talk.slug)}
            />
          ))}
        </section>

        <section className="links-section">
          <h2>// {t.links.projects}</h2>
          {sortProjectsByDate([
            ...projects.map((project) => projectToExtra(project, t.projects.items[project.slug] ?? project)),
            ...extraProjects,
          ]).map((item) => (
            <ExpandableProject
              key={item.slug}
              project={item}
              open={openProject === item.slug}
              onToggle={() => setOpenProject((current) => current === item.slug ? null : item.slug)}
            />
          ))}
        </section>
      </div>
    </main>
  )
}
