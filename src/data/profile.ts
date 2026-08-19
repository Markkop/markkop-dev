export type ProjectGalleryImage = {
  id: string
  src: string
  label?: string
}

export type ProjectMedia = {
  id: string
  kind: 'live' | 'image' | 'video' | 'gallery'
  src?: string
  srcMobile?: string
  images?: ProjectGalleryImage[]
  label?: string
}

export type Project = {
  title: string
  slug: string
  description: string
  category: string
  metric: string
  timeframe: string
  tech: string[]
  live: string
  code?: string
  image?: string
  imageMobile?: string
  video?: string
  embed?: boolean
  media?: ProjectMedia[]
}

export const profile = {
  name: 'Marcelo "Mark" Kopmann',
  shortName: 'Mark Kop',
  role: 'Software Engineer',
  location: 'Florianópolis, Santa Catarina, Brazil',
  company: 'Halborn',
  headline: 'I build practical products where web, AI, games, and onchain systems meet.',
  summary:
    'Full-stack engineer turning ideas into useful tools, playful experiences, and open-source software.',
  links: {
    github: 'https://github.com/Markkop',
    linkedin: 'https://www.linkedin.com/in/marcelo-kopmann/',
    x: 'https://x.com/heymarkkop',
    instagram: 'https://www.instagram.com/markkop.dev',
    devto: 'https://dev.to/heymarkkop',
    linktree: 'https://linktree.markkop.dev',
  },
  stats: [
    { value: '2019', prefix: 'Since', label: 'Programming' },
    { value: '7000', prefix: 'Around', label: 'Blog followers' },
    { value: '100', prefix: 'Over', label: 'Projects completed' },
    { value: '3', prefix: 'Secured', label: 'Hackathon wins' },
  ],
  about: [
    {
      label: '// THE WHY',
      title: 'Why I Code',
      text: 'Coding feels like magic. Being able to turn any idea into something useful is a powerful skill, and I love it.',
    },
    {
      label: '// VALUES',
      title: 'What I Value',
      text: 'I value proactivity, curiosity, creativity, teamwork, respect, and ownership. Working with people who share these same principles is where the magic happens.',
    },
    {
      label: '// MOTIVATION',
      title: 'What Motivates Me',
      text: 'I want to have a good time, working on what I like and doing my best at it. Feedback from managers and colleagues keeps telling me I’m on the right track.',
    },
  ],
  milestones: [
    { year: '2019', role: 'Full-stack Developer', orgs: [{ name: 'Linx', logo: '/companies/linx-dark.png', logoLight: '/companies/linx.png', href: 'https://www.linx.com.br/' }] },
    { year: '2021', role: 'Senior Software Engineer', orgs: [{ name: 'ArcTouch', logo: '/companies/arctouch.png', href: 'https://arctouch.com/' }] },
    { year: '2022', role: 'Frontend Developer', orgs: [{ name: 'Halborn', logo: '/companies/halborn.png', href: 'https://www.halborn.com/' }] },
    { year: '2024', role: 'Senior Frontend Developer', orgs: [{ name: 'Halborn', logo: '/companies/halborn.png', href: 'https://www.halborn.com/' }] },
    { year: '2026', role: 'websites, consulting and workshops', orgs: [{ name: 'Me and You', emoji: '🤝' }] },
  ],
  journey: [
    { year: '2020', role: '1k+ users Discord bot', orgs: [{ name: 'Corvo Astral', logo: '/companies/discord.svg', href: 'https://github.com/Markkop/corvo-astral' }] },
    { year: '2021', role: 'Tech Event Volunteer since then', orgs: [{ name: 'Codecon', logo: '/companies/codecon.png', logoLight: '/companies/codecon-light.png', href: 'https://www.codecon.dev/' }] },
    { year: '2022', role: 'System Analysis and Development graduation', orgs: [{ name: 'Estácio', logo: '/companies/estacio.svg', href: 'https://estacio.br/' }] },
    { year: '2025', role: 'Multiple hackathon wins', orgs: [{ name: 'HabitChain', logo: '/companies/habitchain.png', href: 'https://www.habitchain.xyz/' }] },
  ],
} as const

export const projects: Project[] = [
  {
    title: 'Halborn',
    slug: 'halborn',
    description: 'The public site for an elite blockchain security firm. I led the WordPress to Next.js migration, CMS integration, and the marketing experience.',
    category: 'Company Website',
    metric: 'WordPress → Next.js',
    timeframe: '2022–present',
    tech: ['Next.js', 'Strapi CMS', 'React', 'Tailwind CSS'],
    live: 'https://www.halborn.com/',
    image: '/projects/halborn.jpg',
    imageMobile: '/projects/halborn-mobile.jpg',
  },
  {
    title: 'HabitChain',
    slug: 'habitchain',
    description: 'A habit tracker with real skin in the game, using onchain incentives to turn consistency into commitment.',
    category: 'Onchain Product',
    metric: 'Hackathon winner',
    timeframe: '2025–2026',
    tech: ['TypeScript', 'Next.js', 'Solidity', 'Base'],
    live: 'https://www.habitchain.xyz/',
    code: 'https://github.com/Markkop/habitchain-2',
    image: '/projects/habitchain.png',
    embed: true,
    media: [
      { id: 'live', kind: 'live', label: 'Website' },
      { id: 'app', kind: 'live', src: 'https://app.habitchain.xyz/?mode=demo', label: 'App' },
      { id: 'pitch', kind: 'image', src: '/projects/habitchain-pitch.png', srcMobile: '/projects/habitchain-pitch-mobile.png', label: 'One-slide pitch' },
    ],
  },
  {
    title: 'Prisma',
    slug: 'prisma',
    description: 'A workspace for collecting real-estate listings, comparing properties, and planning a home purchase.',
    category: 'Property Platform',
    metric: 'AI-assisted workflow',
    timeframe: '2025–2026',
    tech: ['Svelte', 'Elixir', 'PostgreSQL', 'OpenAI'],
    live: 'https://casas.markkop.dev/',
    image: '/projects/minha-casa.png',
    video: '/projects/minha-casa.webm',
    embed: true,
  },
  {
    title: 'Guest Planner',
    slug: 'wedding',
    description: 'A focused tool to organize guest lists, invitations, ordering, details, and RSVP status.',
    category: 'Planning Tool',
    metric: 'Perfect for Weddings',
    timeframe: '2025–2026',
    tech: ['TypeScript', 'Next.js', 'React'],
    live: 'https://guests.markkop.dev/',
    code: 'https://github.com/Markkop/wedding-guest-planner',
    image: '/projects/wedding.png',
    embed: true,
  },
  {
    title: 'Corvo Astral',
    slug: 'corvo-astral',
    description: 'A community-driven Discord bot that collects and serves useful information for Wakfu players.',
    category: 'Community Bot',
    metric: '500+ Discord servers',
    timeframe: '2020–2025',
    tech: ['TypeScript', 'Node.js', 'Discord'],
    live: 'https://top.gg/bot/750529201161109507',
    code: 'https://github.com/Markkop/corvo-astral',
    image: '/projects/corvo-astral/alma.png',
    media: [{
      id: 'gallery',
      kind: 'gallery',
      images: [
        { id: 'alma', src: '/projects/corvo-astral/alma.png', label: 'Almanax' },
        { id: 'alma-daily', src: '/projects/corvo-astral/alma-daily.png', label: 'Daily Almanax' },
        { id: 'party', src: '/projects/corvo-astral/party.png', label: 'Party listing' },
        { id: 'i18n-lang', src: '/projects/corvo-astral/i18n-lang.png', label: 'Languages' },
        { id: 'i18n-translate', src: '/projects/corvo-astral/i18n-translate.png', label: 'Translation' },
        { id: 'equip', src: '/projects/corvo-astral/equip.png', label: 'Equipment search' },
        { id: 'subli-name', src: '/projects/corvo-astral/subli-name.png', label: 'Sublimation by name' },
        { id: 'subli-slots', src: '/projects/corvo-astral/subli-slots.png', label: 'Sublimation by slots' },
        { id: 'recipe', src: '/projects/corvo-astral/recipe.png', label: 'Recipe search' },
        { id: 'calc', src: '/projects/corvo-astral/calc.png', label: 'Damage calculator' },
      ],
    }],
  },
]

export const nowPhotos = [
  { id: 'mk2', src: '/gallery/mk2.jpg', position: '50% 100%' },
  { id: 'mk1', src: '/gallery/mk1.jpg', position: '78% 48%' },
  { id: 'mk3', src: '/gallery/mk3.jpg', position: '50% 50%' },
] as const

export const workPhotos = [
  { id: 'work1', src: '/gallery/work1.jpg', position: '50% 0%' },
  { id: 'work3', src: '/gallery/work3.jpg', position: '50% 0%' },
  { id: 'work2', src: '/gallery/work2.jpg', position: '50% 0%' },
] as const

export const stack = [
  { group: 'Next.js Product', items: ['Next.js', 'Node.js', 'PostgreSQL', 'GitHub', 'Vercel', 'Codex'] },
  { group: 'React AI App', items: ['React', 'Tailwind CSS', 'Supabase', 'GitHub', 'Vercel', 'OpenAI'] },
  { group: 'Frontend CMS Site', items: ['Next.js', 'React', 'Tailwind CSS', 'Strapi CMS'] },
  { group: 'Self-hosted Svelte App', items: ['Svelte', 'Elixir', 'PostgreSQL', 'Forgejo', 'Docker', 'Claude'] },
  { group: 'Hardhat EVM dApp', items: ['React', 'TypeScript', 'Node.js', 'Solidity', 'Hardhat', 'EVM', 'GitHub', 'VS Code'] },
  { group: 'Foundry EVM dApp', items: ['Next.js', 'TypeScript', 'Node.js', 'Solidity', 'Foundry', 'EVM', 'GitHub', 'Cursor'] },
  { group: 'Base dApp', items: ['Next.js', 'TypeScript', 'Solidity', 'Base'] },
  { group: 'Polkadot dApp', items: ['Next.js', 'TypeScript', 'Node.js', 'Polkadot', 'Docker', 'GitHub'] },
] as const

export type StackTech = (typeof stack)[number]['items'][number]
