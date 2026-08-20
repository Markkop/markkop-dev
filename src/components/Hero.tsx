import Image from 'next/image'
import { HeroCaption, HeroCopy } from '@/components/HeroCopy'
import { profile } from '@/data/profile'
import portrait from '../../public/LISBON_229.jpg'

export default function Hero() {
  return (
    <section id="hero" className="mk-hero">
      <div className="mk-hero-glow" />
      <div className="mk-hero-inner">
        <HeroCopy />
        <div className="mk-portrait">
          <i />
          <div>
            <Image
              src={portrait}
              alt={`${profile.name} — ${profile.role}`}
              fill
              sizes="(max-width: 1024px) 92vw, 448px"
              preload
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
            <HeroCaption />
          </div>
        </div>
      </div>
    </section>
  )
}
