'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { useLanguage } from '@/context/LanguageContext'
import { profile } from '@/data/profile'

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
  const name = org.name === 'LFG' ? t.about.lfg : org.name
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

function TimelineNode({ milestone, role, column, branch, revealIndex }: { milestone: TimelineItem; role?: string; column: number; branch?: boolean; revealIndex: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      className={branch ? 'mk-journey-item mk-journey-branch' : 'mk-journey-item'}
      style={{ '--mk-col': column } as React.CSSProperties}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.45, delay: revealIndex * 0.03, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="mk-journey-mark"><i /><strong>{milestone.year}</strong></span>
      {milestone.now ? null : (
        <div className="mk-journey-brands">
          {milestone.orgs.map((org) => <JourneyOrg key={org.name} org={org} />)}
        </div>
      )}
      {role ? <small className={milestone.now ? 'mk-journey-now' : undefined}>{role}</small> : null}
    </motion.span>
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
          const node = branch ? <TimelineNode milestone={branch} role={branchRoles[index]} column={column + 1} branch revealIndex={index * 2 + 1} /> : null
          return (
            <div className="mk-journey-group" key={`${milestone.year}-${index}`}>
              <TimelineNode milestone={milestone} role={roles[index]} column={column} revealIndex={index * 2} />
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

export default function About() {
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

        <SectionWrapper className="mk-journey-reveal" delay={0.4}>
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
