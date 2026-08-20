'use client'

import { motion } from 'framer-motion'
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import DevTo from '@/components/icons/DevTo'
import PhotoGallery from '@/components/PhotoGallery'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { useLanguage } from '@/context/LanguageContext'
import { profile, workPhotos } from '@/data/profile'

const SHOW_CONTACT_GALLERY = false

export default function Contact() {
  const { t } = useLanguage()
  const socials = (
    <div className="mk-contact-socials">
      <motion.a href={profile.links.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Github size={14} />GitHub</motion.a>
      <motion.a href={profile.links.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Linkedin size={14} />LinkedIn</motion.a>
      <motion.a href={profile.links.x} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Twitter size={14} />X</motion.a>
      <motion.a href={profile.links.instagram} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><Instagram size={14} />Instagram</motion.a>
      <motion.a href={profile.links.devto} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}><DevTo size={14} />Blog</motion.a>
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
