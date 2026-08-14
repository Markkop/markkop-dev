import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/links`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
