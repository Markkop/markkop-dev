'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Globe,
  MapPin,
  MessageSquare,
  Presentation,
  Sparkles,
  Tag,
  User,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { projectSubtitle, type ExtraProject, type ExtraProjectButton } from '@/data/extraProjects'
import type { Talk } from '@/data/talks'
import type { Language } from '@/i18n/content'

export function formatTalkDate(date: string, language: Language) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(language === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function stop(event: MouseEvent) {
  event.stopPropagation()
}

function LinksExpandable({
  id,
  title,
  subtitle,
  image,
  isFavicon,
  onDark,
  fill,
  open,
  onToggle,
  children,
}: {
  id: string
  title: string
  subtitle: string
  image?: string
  isFavicon?: boolean
  onDark?: boolean
  fill?: boolean
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const panelId = `${id}-panel`
  const iconClass = [
    'link-icon',
    isFavicon ? 'is-favicon' : '',
    onDark ? 'is-on-dark' : '',
    fill ? 'is-fill' : '',
  ].filter(Boolean).join(' ')

  return (
    <article className={open ? 'links-expand is-open' : 'links-expand'}>
      <button
        type="button"
        className="link-card"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={iconClass}>
          {image ? (
            <>
              {/* Remote covers from talks.markkop.dev; CSP allowlists the hosts. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className={isFavicon ? 'is-favicon' : undefined} />
            </>
          ) : title.slice(0, 2).toUpperCase()}
        </span>
        <span>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <div
        className="links-expand-panel"
        id={panelId}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="links-expand-clip">{children}</div>
      </div>
    </article>
  )
}

function MediaGallery({
  images,
  alt,
  fit = 'cover',
  topCover = true,
}: {
  images: string[]
  alt: string
  fit?: 'cover' | 'contain'
  topCover?: boolean
}) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const current = images[index] ?? images[0]
  if (!current) return null

  return (
    <div className={topCover ? 'links-detail-media is-top' : 'links-detail-media'}>
      {/* Remote covers from talks.markkop.dev; sizes vary and hosts are CSP-allowlisted. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={current} alt={alt} className={fit === 'contain' ? 'is-contain' : undefined} />
      {images.length > 1 ? (
        <>
          <button
            type="button"
            className="links-gallery-nav is-prev"
            onClick={(event) => {
              stop(event)
              setIndex((value) => (value === 0 ? images.length - 1 : value - 1))
            }}
            aria-label={t.links.galleryPrev}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="links-gallery-nav is-next"
            onClick={(event) => {
              stop(event)
              setIndex((value) => (value === images.length - 1 ? 0 : value + 1))
            }}
            aria-label={t.links.galleryNext}
          >
            <ChevronRight size={16} />
          </button>
          <div className="links-gallery-dots">
            {images.map((image, imageIndex) => (
              <button
                key={image}
                type="button"
                className={imageIndex === index ? 'is-active' : undefined}
                onClick={(event) => {
                  stop(event)
                  setIndex(imageIndex)
                }}
                aria-label={`${imageIndex + 1} / ${images.length}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

function DetailAction({
  href,
  enabled,
  label,
  icon: Icon,
  disabledReason,
}: {
  href?: string
  enabled: boolean
  label: string
  icon: typeof Globe
  disabledReason?: string
}) {
  const { t } = useLanguage()
  const available = Boolean(enabled && href)
  const className = available ? 'links-detail-action' : 'links-detail-action is-disabled'
  const content = (
    <>
      <Icon size={14} />
      {label}
    </>
  )

  if (available && href) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" onClick={stop}>
        {content}
      </a>
    )
  }

  return (
    <span className={className} title={disabledReason || t.links.notAvailable}>
      {content}
    </span>
  )
}

function ProjectAction({ button }: { button: ExtraProjectButton }) {
  const { t } = useLanguage()
  const label = button.icon === 'code' || button.type === 'source' ? t.links.repo : t.links.visit
  const Icon = button.icon === 'code' ? Code2 : Globe
  return (
    <DetailAction
      icon={Icon}
      label={label}
      href={button.url}
      enabled={button.enabled}
      disabledReason={button.disabledReason}
    />
  )
}

export function ExpandableTalk({
  talk,
  open,
  onToggle,
  language,
}: {
  talk: Talk
  open: boolean
  onToggle: () => void
  language: Language
}) {
  const { t } = useLanguage()
  const dateLabel = formatTalkDate(talk.date, language)
  const itemIcon = talk.favicon || talk.coverImage
  const isFavicon = Boolean(talk.favicon)

  return (
    <LinksExpandable
      id={`talk-${talk.slug}`}
      title={talk.title}
      subtitle={`${dateLabel} · ${talk.event}`}
      image={itemIcon}
      isFavicon={isFavicon}
      onDark={talk.faviconOnDark}
      fill={talk.faviconFill}
      open={open}
      onToggle={onToggle}
    >
      <div className="links-detail">
        <div className="links-detail-media-wrap">
          <MediaGallery images={[talk.coverImage]} alt={talk.title} fit={talk.fit} topCover={talk.topCover} />
        </div>
        <div className="links-detail-body">
          <h3>{talk.title}</h3>
          <p className="links-detail-meta">
            <span><Calendar size={13} /> {dateLabel}</span>
            {talk.eventLink ? (
              <a href={talk.eventLink} target="_blank" rel="noreferrer" onClick={stop}>
                <Users size={13} /> {talk.event}
              </a>
            ) : (
              <span><Users size={13} /> {talk.event}</span>
            )}
            {talk.locationLink ? (
              <a href={talk.locationLink} target="_blank" rel="noreferrer" onClick={stop}>
                <MapPin size={13} /> {talk.location}
              </a>
            ) : (
              <span><MapPin size={13} /> {talk.location}</span>
            )}
          </p>
          <p className="links-detail-copy">{talk.description}</p>
          <div className="links-detail-tags">
            {talk.tags.map((tag) => (
              tag.url ? (
                <a key={tag.label} href={tag.url} target="_blank" rel="noreferrer" onClick={stop}>{tag.label}</a>
              ) : (
                <span key={tag.label}>{tag.label}</span>
              )
            ))}
          </div>
          <div className="links-detail-actions">
            <DetailAction icon={Presentation} label={t.links.presentation} href={talk.presentationLink} enabled={Boolean(talk.presentationLink)} />
            <DetailAction icon={MessageSquare} label={t.links.feedback} href={talk.feedbackLink} enabled={Boolean(talk.feedbackLink)} />
          </div>
        </div>
      </div>
    </LinksExpandable>
  )
}

export function ExpandableProject({
  project,
  open,
  onToggle,
}: {
  project: ExtraProject
  open: boolean
  onToggle: () => void
}) {
  const { t } = useLanguage()
  const personal = project.client.name.toLowerCase() === 'personal'
  const ClientIcon = personal ? User : Building2
  const itemIcon = project.favicon || project.images[0] || ''
  const isFavicon = Boolean(project.favicon)

  return (
    <LinksExpandable
      id={`project-${project.slug}`}
      title={project.title}
      subtitle={projectSubtitle(project)}
      image={itemIcon}
      isFavicon={isFavicon}
      onDark={project.faviconOnDark}
      fill={project.faviconFill}
      open={open}
      onToggle={onToggle}
    >
      <div className="links-detail">
        <div className="links-detail-media-wrap">
          <MediaGallery images={project.images} alt={project.title} />
        </div>
        <div className="links-detail-body">
          <h3>{project.title}</h3>
          <p className="links-detail-meta">
            <span><Tag size={13} /> {project.category}</span>
            {project.client.url ? (
              <a href={project.client.url} target="_blank" rel="noreferrer" onClick={stop}>
                <ClientIcon size={13} /> {project.client.name}
              </a>
            ) : (
              <span><ClientIcon size={13} /> {project.client.name}</span>
            )}
            <span><Calendar size={13} /> {project.date}</span>
            {project.aiUsage.level === 'Full' ? (
              <span className="links-ai-badge" title={project.aiUsage.description || t.links.builtWithAi}>
                <Sparkles size={13} /> {t.links.builtWithAi}
              </span>
            ) : null}
          </p>
          <p className="links-detail-copy">{project.description}</p>
          <div className="links-detail-tags">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="links-detail-actions">
            {project.buttons.map((button) => (
              <ProjectAction key={`${button.type}-${button.url ?? button.text}`} button={button} />
            ))}
          </div>
        </div>
      </div>
    </LinksExpandable>
  )
}
