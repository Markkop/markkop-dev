'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Code2, Download, Github, Linkedin, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import PortfolioShell from '@/components/PortfolioShell'
import ProjectShowcase from '@/components/ProjectShowcase'
import StackShowcase from '@/components/StackShowcase'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { useLanguage } from '@/context/LanguageContext'
import { profile } from '@/data/profile'

type GithubProfile = { public_repos?: number; followers?: number }

function Hero() {
  const { t } = useLanguage()
  return (
    <section id="hero" className="mk-hero">
      <div className="mk-hero-glow" />
      <div className="mk-hero-inner">
        <motion.div className="mk-hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
          <p className="mk-name">{profile.name}</p>
          <h1>
            <span>{t.hero.lead}</span>
            <strong>{t.hero.highlight}</strong>
            <small>{t.hero.summary}</small>
          </h1>
          <div className="mk-hero-actions">
            <a className="primary" href={profile.links.linkedin} target="_blank" rel="noreferrer"><Calendar size={16} />{t.nav.connect}</a>
            <Link className="secondary" href="/links"><Download size={16} />{t.nav.links}</Link>
          </div>
        </motion.div>

        <motion.div className="mk-portrait" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>
          <i />
          <div>
            <Image src="/LISBON_229.jpg" alt={`${profile.name} — ${t.hero.role}`} fill sizes="(max-width: 1024px) 100vw, 50vw" priority />
            <span><strong>{profile.name}</strong><small>{t.hero.role}</small></span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function About() {
  const { t } = useLanguage()
  const [github, setGithub] = useState<GithubProfile>({})

  useEffect(() => {
    fetch('https://api.github.com/users/Markkop')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((value: GithubProfile) => setGithub(value))
      .catch(() => undefined)
  }, [])

  const valueFor = (index: number, fallback: string) => {
    if (index === 0 && github.public_repos) return String(github.public_repos)
    if (index === 1 && github.followers) return String(github.followers)
    return fallback
  }

  return (
    <section id="about" className="mk-about mk-section-dark">
      <div className="mk-section-glow" />
      <div className="mk-wide">
        <SectionWrapper>
          <div className="mk-stats">
            {profile.stats.map((stat, index) => <div key={stat.label}><strong>{valueFor(index, stat.value)}</strong><span>{t.about.stats[index]}</span></div>)}
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.1}>
          <header className="mk-section-heading compact"><p>{t.about.eyebrow}</p><h2>{t.about.title}<br /><span>{t.about.titleHighlight}</span></h2></header>
        </SectionWrapper>

        <div className="mk-about-columns">
          {t.about.cards.map((card, index) => (
            <SectionWrapper key={card.title} delay={0.15 + index * 0.1}>
              <article><p>{card.label}</p><h3>{card.title}</h3><div>{card.text}</div></article>
            </SectionWrapper>
          ))}
        </div>

        <SectionWrapper delay={0.4}>
          <div className="mk-journey"><p>{t.about.journey}</p><div>{profile.milestones.map((milestone, index) => <span key={milestone.year}><i /><strong>{milestone.year}</strong><small>{t.about.milestones[index]}</small></span>)}</div></div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function Now() {
  const { t } = useLanguage()
  return (
    <section className="mk-now mk-section-dark">
      <div className="mk-section-glow" />
      <div className="mk-wide">
        <SectionWrapper><h2 className="mk-kicker">{t.now.eyebrow}</h2></SectionWrapper>
        <SectionWrapper delay={0.1}>
          <motion.div className="mk-now-card" whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,.35)' }}>
            <p><motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>$</motion.span> cat /now.md</p>
            {t.now.items.map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.1 }}>
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}>&gt;</motion.span>{item}
              </motion.div>
            ))}
            <small>{t.now.updated}</small>
          </motion.div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function Contact() {
  const { t } = useLanguage()
  return (
    <section id="contact" className="mk-contact mk-section-dark">
      <div className="mk-contact-glow" />
      <div className="mk-wide">
        <SectionWrapper><p className="mk-kicker">{t.contact.eyebrow}</p></SectionWrapper>
        <SectionWrapper delay={0.1}><h2>{t.contact.title}<br /><motion.span animate={{ opacity: [1, 0.72, 1] }} transition={{ duration: 3, repeat: Infinity }}>{t.contact.titleHighlight}</motion.span></h2></SectionWrapper>
        <SectionWrapper delay={0.2}><p className="mk-contact-copy">{t.contact.intro}</p></SectionWrapper>
        <SectionWrapper delay={0.3}>
          <div className="mk-contact-actions">
            <motion.a href={profile.links.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>{t.nav.connect}<ArrowRight size={15} /></motion.a>
            <motion.a className="secondary" href={profile.links.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>{t.contact.github}<Github size={15} /></motion.a>
          </div>
        </SectionWrapper>
        <SectionWrapper delay={0.4}>
          <div className="mk-contact-socials">
            <a href={profile.links.github} target="_blank" rel="noreferrer"><Github size={14} />GitHub</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} />LinkedIn</a>
            <a href={profile.links.x} target="_blank" rel="noreferrer"><Twitter size={14} />X</a>
            <Link href="/links"><Code2 size={14} />{t.contact.allLinks}</Link>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="mk-footer"><span>© 2026 {profile.name}</span><span>{t.footer.built}</span><span><motion.i animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>$</motion.i> mark --version 2026</span></footer>
  )
}

export default function Portfolio() {
  return (
    <PortfolioShell>
      <main id="main-content">
        <Hero />
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
