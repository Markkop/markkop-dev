'use client'

import PhotoGallery from '@/components/PhotoGallery'
import { useLanguage } from '@/context/LanguageContext'
import { nowPhotos } from '@/data/profile'

export default function NowGallery() {
  const { t } = useLanguage()
  return (
    <PhotoGallery
      photos={nowPhotos}
      captions={t.now.photos}
      label={t.now.galleryLabel}
      prevLabel={t.now.galleryPrev}
      nextLabel={t.now.galleryNext}
    />
  )
}
