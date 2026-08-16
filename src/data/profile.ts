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
}

export const profile = {
  name: 'Marcelo Kopmann',
  shortName: 'Mark Kop',
  role: 'Software Engineer',
  location: 'Santa Catarina, Brazil',
  company: 'Halborn',
  headline: 'I build practical products where web, AI, games, and onchain systems meet.',
  summary:
    'Full-stack engineer turning ideas into useful tools, playful experiences, and open-source software.',
  links: {
    github: 'https://github.com/Markkop',
    linkedin: 'https://www.linkedin.com/in/markkopmann',
    x: 'https://x.com/heymarkkop',
  },
  stats: [
    { value: '7', label: 'Years programming' },
    { value: '3', label: 'Hackathon wins' },
    { value: '7k', label: 'Blog followers' },
    { value: '50+', label: 'Tech events attended' },
  ],
  about: [
    {
      label: '// THE WHY',
      title: 'Why I Code',
      text: 'Coding feels like magic. Being able to turn any idea into something useful is a powerful skill, and I love it. Agentic coding is the last magical wand I needed to start building products people will really enjoy.',
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
    { year: '2026', role: 'Halborn, Consulting, Freelance', orgs: [], now: true },
  ],
  journey: [
    { year: '2020', role: 'Open source Discord bot reaching 1k+ users', orgs: [{ name: 'Corvo Astral', logo: '/companies/discord.svg', href: 'https://github.com/Markkop/corvo-astral' }] },
    { year: '2021', role: 'First Tech Event Volunteer', orgs: [{ name: 'Codecon', logo: '/companies/codecon.png', logoLight: '/companies/codecon-light.png', href: 'https://www.codecon.dev/' }] },
    { year: '2022', role: 'System Analysis and Development graduation', orgs: [{ name: 'Estácio', logo: '/companies/estacio.svg', href: 'https://estacio.br/' }] },
    { year: '2025', role: 'Multiple hackathon wins', orgs: [{ name: 'HabitChain', logo: '/companies/habitchain.png', href: 'https://www.habitchain.xyz/' }] },
  ],
} as const

export const projects: Project[] = [
  {
    title: 'HabitChain',
    slug: 'habitchain',
    description: 'A habit tracker with real skin in the game, using onchain incentives to turn consistency into commitment.',
    category: 'Onchain Product',
    metric: 'Stake-backed habits',
    timeframe: '2025–2026',
    tech: ['TypeScript', 'Next.js', 'Solidity', 'Polkadot'],
    live: 'https://www.habitchain.xyz/',
    code: 'https://github.com/Markkop/habitchain-2',
    image: '/projects/habitchain.png',
  },
  {
    title: 'Minha Casa',
    slug: 'minha-casa',
    description: 'A workspace for collecting real-estate listings, comparing properties, and planning a home purchase.',
    category: 'Property Platform',
    metric: 'AI-assisted workflow',
    timeframe: '2025–2026',
    tech: ['Svelte', 'TypeScript', 'PostgreSQL', 'Elixir'],
    live: 'https://casas.markkop.dev/',
  },
  {
    title: 'Stipend Helper',
    slug: 'stipend',
    description: 'Extracts receipt data from PDFs with AI, converts currencies, and prepares stipend information quickly.',
    category: 'AI Utility',
    metric: 'PDF to structured data',
    timeframe: '2025',
    tech: ['JavaScript', 'Next.js', 'AI'],
    live: 'https://stipend.markkop.dev/',
    code: 'https://github.com/Markkop/stipend-helper',
    image: '/projects/stipend.png',
  },
  {
    title: 'Wedding Guest Planner',
    slug: 'wedding',
    description: 'A focused tool to organize guest lists, invitations, ordering, details, and RSVP status.',
    category: 'Planning Tool',
    metric: 'Guest workflow',
    timeframe: '2025–2026',
    tech: ['TypeScript', 'Next.js', 'React'],
    live: 'https://guests.markkop.dev/',
    code: 'https://github.com/Markkop/wedding-guest-planner',
    image: '/projects/wedding.png',
  },
  {
    title: 'NFT Marketplace',
    slug: 'nft-marketplace',
    description: 'A complete NFT marketplace built to explore smart-contract commerce and decentralized ownership.',
    category: 'Web3 Marketplace',
    metric: '181 GitHub stars',
    timeframe: '2022',
    tech: ['Next.js', 'Hardhat', 'Solidity', 'JavaScript'],
    live: 'https://nft-marketplace-markkop.vercel.app/',
    code: 'https://github.com/Markkop/nft-marketplace',
    image: '/projects/nft.png',
  },
  {
    title: 'Corvo Astral',
    slug: 'corvo-astral',
    description: 'A community-driven Discord bot that collects and serves useful information for Wakfu players.',
    category: 'Community Bot',
    metric: '30 GitHub stars',
    timeframe: '2020–present',
    tech: ['TypeScript', 'Node.js', 'Discord'],
    live: 'https://github.com/Markkop/corvo-astral',
    code: 'https://github.com/Markkop/corvo-astral',
    image: '/projects/corvo.png',
  },
  {
    title: 'RepoGPT',
    slug: 'repogpt',
    description: 'Merges repository files into a clean text bundle for LLM context and code conversations.',
    category: 'Developer Tool',
    metric: 'Repository to context',
    timeframe: '2023–2024',
    tech: ['TypeScript', 'Next.js', 'GitHub'],
    live: 'https://repo-gpt-black.vercel.app/',
    code: 'https://github.com/Markkop/RepoGPT',
    image: '/projects/repogpt.png',
  },
  {
    title: 'Repo Env Generator',
    slug: 'repo-env-generator',
    description: 'Scans a repository and identifies its environment-variable surface for faster project setup.',
    category: 'Developer Tool',
    metric: 'Automatic env discovery',
    timeframe: '2024',
    tech: ['TypeScript', 'Next.js', 'GitHub'],
    live: 'https://repoenvgen.markkop.dev/',
    code: 'https://github.com/Markkop/RepoEnvGenerator',
    image: '/projects/repoenv.png',
  },
  {
    title: 'Spotify Playlist Deleter',
    slug: 'spotify-playlist-deleter',
    description: 'A small utility for selecting and deleting many Spotify playlists in one pass.',
    category: 'Productivity Tool',
    metric: '14 GitHub stars',
    timeframe: '2023',
    tech: ['TypeScript', 'Next.js', 'Spotify API'],
    live: 'https://multiple-playlist-deleter-markkop.vercel.app/',
    code: 'https://github.com/Markkop/Multiple-Playlist-deleter',
    image: '/projects/spotify.png',
  },
  {
    title: 'Werewolf Moderator',
    slug: 'werewolf-moderator',
    description: 'A game-night companion that helps moderators manage roles and state in Werewolf and Mafia sessions.',
    category: 'Game Utility',
    metric: 'Live game state',
    timeframe: '2023–2024',
    tech: ['TypeScript', 'Next.js', 'React'],
    live: 'https://werewolf-moderator-helper-mu.vercel.app/',
    code: 'https://github.com/Markkop/werewolf-moderator-helper',
    image: '/projects/werewolf.png',
  },
]

export const stack = [
  { group: 'Frontend', items: ['TypeScript', 'React', 'Next.js', 'Svelte', 'Tailwind CSS'] },
  { group: 'Backend & Data', items: ['Node.js', 'Elixir', 'PostgreSQL', 'Supabase'] },
  { group: 'Onchain', items: ['Solidity', 'Hardhat', 'Foundry', 'EVM', 'Polkadot'] },
  { group: 'Delivery & Hosting', items: ['GitHub', 'Docker', 'Vercel', 'Forgejo'] },
  { group: 'AI Development', items: ['OpenAI', 'Codex', 'Claude', 'Cursor', 'VS Code'] },
] as const

export type StackTech = (typeof stack)[number]['items'][number]
