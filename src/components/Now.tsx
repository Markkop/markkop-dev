'use client'

import { motion } from 'framer-motion'
import NowGallery from '@/components/NowGallery'
import SectionWrapper from '@/components/ui/SectionWrapper'
import { useLanguage } from '@/context/LanguageContext'

export default function Now() {
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
