import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: siteConfig.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/links`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
