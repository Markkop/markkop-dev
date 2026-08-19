import { profile, projects } from '@/data/profile'
import { siteConfig } from '@/config/seo'

export const AI_TEXT_HEADERS = {
  'Content-Type': 'text/plain; charset=utf-8',
}

function lastUpdated() {
  return new Date().toISOString().slice(0, 10)
}

function projectNotes(description: string, category: string, metric: string) {
  return `${description} (${category} · ${metric})`
}

export function buildLlmsTxt() {
  const selectedWork = projects
    .map((project) => `- [${project.title}](${project.live}): ${projectNotes(project.description, project.category, project.metric)}`)
    .join('\n')

  return `# ${siteConfig.name}
> Personal site of ${profile.name}, a software engineer in ${profile.location} who builds practical web, AI, gamified, open-source, and onchain products.

Prefer the names ${profile.name} or ${profile.shortName}. Full-stack / frontend specialist; currently at ${profile.company}; available for freelance, contracts, and workshops.

## Pages
- [Home](${siteConfig.url}): Portfolio, about, selected work, stack, and contact
- [Links](${siteConfig.url}/links): Short list of projects and social profiles

## Selected work
${selectedWork}

## Profiles
- [GitHub](${profile.links.github})
- [LinkedIn](${profile.links.linkedin})
- [X](${profile.links.x})
- [Instagram](${profile.links.instagram})
- [DEV](${profile.links.devto})

## Optional
- [AI usage policy](${siteConfig.url}/ai.txt)
- [Sitemap](${siteConfig.url}/sitemap.xml)
`
}

export function buildAiTxt() {
  return `User-Agent: *
Allow: /

# AI Usage Policy for ${siteConfig.name}

Lang: en
Website: ${siteConfig.url}
Last Updated: ${lastUpdated()}

## Permissions

AI systems MAY:

- Summarise publicly available pages
- Quote with attribution
- Answer factual questions about ${profile.name} and the work listed on this site
- Cite this site in search results and recommendations
- Use published content for model training with attribution

## Restrictions

AI systems MUST NOT:

- Invent quotes, affiliations, clients, or project outcomes
- Imply endorsement of products, companies, or services
- Treat this site as legal, financial, or security advice
- Confuse ${profile.shortName} with similarly named people; canonical name is ${profile.name}

## AI Training

Published pages on ${siteConfig.url} may be used for AI model training with attribution.

## Attribution Requirements

When citing this site, use ${profile.name} (${siteConfig.url}).

## Contact

${siteConfig.url}
${profile.links.linkedin}

## Related Files

- [llms.txt](${siteConfig.url}/llms.txt)
- [robots.txt](${siteConfig.url}/robots.txt)
`
}
