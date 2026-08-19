'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Download, Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import NowGallery from '@/components/NowGallery'
import PhotoGallery from '@/components/PhotoGallery'
import PortfolioShell from '@/components/PortfolioShell'
import ProjectShowcase from '@/components/ProjectShowcase'
import StackShowcase from '@/components/StackShowcase'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { useLanguage } from '@/context/LanguageContext'
import { profile, workPhotos } from '@/data/profile'

type TimelineOrg = { name: string; logo?: string; logoLight?: string; href?: string; emoji?: string }
type TimelineItem = { year: string; orgs: readonly TimelineOrg[]; now?: boolean }

function JourneyOrgLogo({ org }: { org: TimelineOrg }) {
  if (org.emoji) {
    return <span className="mk-journey-logo-wrap mk-journey-emoji" aria-hidden="true">{org.emoji}</span>
  }

  if (!org.logo) return null

  return (
    <span className="mk-journey-logo-wrap" aria-hidden="true">
      <Image className={org.logoLight ? 'mk-journey-logo-dark' : undefined} src={org.logo} alt="" width={16} height={16} />
      {org.logoLight ? <Image className="mk-journey-logo-light" src={org.logoLight} alt="" width={16} height={16} /> : null}
    </span>
  )
}

function JourneyOrg({ org }: { org: TimelineOrg }) {
  const { t } = useLanguage()
  const name = org.name === 'Me and You' ? t.about.meAndYou : org.name
  const content = (
    <>
      <JourneyOrgLogo org={org} />
      {name}
    </>
  )

  if (org.href) {
    return (
      <a className="mk-journey-org" href={org.href} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return <span className="mk-journey-org">{content}</span>
}

function TimelineNode({ milestone, role, column, branch }: { milestone: TimelineItem; role?: string; column: number; branch?: boolean }) {
  return (
    <span className={branch ? 'mk-journey-item mk-journey-branch' : 'mk-journey-item'} style={{ '--mk-col': column } as React.CSSProperties}>
      <span className="mk-journey-mark"><i /><strong>{milestone.year}</strong></span>
      {milestone.now ? null : (
        <div className="mk-journey-brands">
          {milestone.orgs.map((org) => <JourneyOrg key={org.name} org={org} />)}
        </div>
      )}
      {role ? <small className={milestone.now ? 'mk-journey-now' : undefined}>{role}</small> : null}
    </span>
  )
}

function Timeline({ label, milestonesLabel, items, roles, branches, branchRoles }: { label: string; milestonesLabel: string; items: readonly TimelineItem[]; roles: readonly string[]; branches: readonly TimelineItem[]; branchRoles: readonly string[] }) {
  return (
    <div className="mk-journey" style={{ '--mk-cols': items.length } as React.CSSProperties}>
      <div className="mk-journey-headings">
        <p>{label}</p>
      </div>
      <div className="mk-journey-track">
        <p className="mk-journey-milestones-heading">{milestonesLabel}</p>
        {items.map((milestone, index) => {
          const column = index * 2 + 1
          const branch = index < items.length - 1 ? branches[index] : undefined
          const node = branch ? <TimelineNode milestone={branch} role={branchRoles[index]} column={column + 1} branch /> : null
          return (
            <div className="mk-journey-group" key={`${milestone.year}-${index}`}>
              <TimelineNode milestone={milestone} role={roles[index]} column={column} />
              {branch ? (
                <>
                  <i className="mk-journey-connector" style={{ '--mk-col': column + 1 } as React.CSSProperties} />
                  {index === 0 ? (
                    <div className="mk-journey-milestone-start" style={{ '--mk-col': column + 1 } as React.CSSProperties}>
                      <p className="mk-journey-milestones-heading">{milestonesLabel}</p>
                      {node}
                    </div>
                  ) : node}
                </>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

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

  return (
    <section id="about" className="mk-about mk-section-dark">
      <div className="mk-section-glow" />
      <div className="mk-wide">
        <SectionWrapper>
          <div className="mk-stats">
            {profile.stats.map((stat, index) => {
              const copy = t.about.stats[index]
              return (
                <div key={stat.label}>
                  <span className="mk-stat-prefix">{copy.prefix}</span>
                  <strong>{stat.value}</strong>
                  <span>{copy.label}</span>
                </div>
              )
            })}
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
          <Timeline
            label={t.about.journey}
            milestonesLabel={t.about.milestonesHeading}
            items={profile.milestones}
            roles={t.about.careerMilestones}
            branches={profile.journey}
            branchRoles={t.about.milestones}
          />
        </SectionWrapper>
      </div>
    </section>
  )
}

function Now() {
  const { t } = useLanguage()
  return (
    <section id="now" className="mk-now mk-section-dark">
      <div className="mk-section-glow" />
      <div className="mk-wide">
        <SectionWrapper><h2 className="mk-kicker">{t.now.eyebrow}</h2></SectionWrapper>
        <div className="mk-now-grid">
          <SectionWrapper className="mk-now-col" delay={0.1}>
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
          <SectionWrapper className="mk-now-col" delay={0.18}>
            <NowGallery />
          </SectionWrapper>
        </div>
      </div>
    </section>
  )
}

const SHOW_CONTACT_GALLERY = false

function Contact() {
  const { t } = useLanguage()
  const socials = (
    <div className="mk-contact-socials">
      <motion.a href={profile.links.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Github size={14} />GitHub</motion.a>
      <motion.a href={profile.links.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Linkedin size={14} />LinkedIn</motion.a>
      <motion.a href={profile.links.x} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Twitter size={14} />X</motion.a>
      <motion.a href={profile.links.instagram} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Instagram size={14} />Instagram</motion.a>
    </div>
  )

  return (
    <section id="contact" className="mk-contact mk-section-dark">
      <div className="mk-contact-glow" />
      <div className="mk-wide">
        {SHOW_CONTACT_GALLERY ? (
          <div className="mk-contact-grid">
            <SectionWrapper className="mk-contact-copy-col">
              <p className="mk-kicker">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}<br /><motion.span animate={{ opacity: [1, 0.72, 1] }} transition={{ duration: 3, repeat: Infinity }}>{t.contact.titleHighlight}</motion.span></h2>
              <p className="mk-contact-copy">{t.contact.intro}</p>
              {socials}
            </SectionWrapper>
            <SectionWrapper className="mk-contact-gallery-col" delay={0.12}>
              <PhotoGallery
                photos={workPhotos}
                captions={t.contact.photos}
                label={t.contact.galleryLabel}
                prevLabel={t.contact.galleryPrev}
                nextLabel={t.contact.galleryNext}
                showCaption
              />
            </SectionWrapper>
          </div>
        ) : (
          <>
            <SectionWrapper><p className="mk-kicker">{t.contact.eyebrow}</p></SectionWrapper>
            <SectionWrapper delay={0.1}><h2>{t.contact.title}<br /><motion.span animate={{ opacity: [1, 0.72, 1] }} transition={{ duration: 3, repeat: Infinity }}>{t.contact.titleHighlight}</motion.span></h2></SectionWrapper>
            <SectionWrapper delay={0.2}><p className="mk-contact-copy">{t.contact.intro}</p></SectionWrapper>
            <SectionWrapper delay={0.3}>{socials}</SectionWrapper>
          </>
        )}
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
