import type { Project } from '@/data/profile'
import { talksAsset } from '@/data/talksAssets'

export type ExtraProjectClient = {
  name: string
  url: string
}

export type ExtraProjectAiUsage = {
  level: 'Incremental' | 'Full' | 'None'
  description: string
}

export type ExtraProjectButton = {
  type: 'view' | 'source'
  text: string
  icon: 'globe' | 'code'
  url?: string
  enabled: boolean
  disabledReason?: string
}

export type ExtraProject = {
  slug: string
  title: string
  category: string
  date: string
  client: ExtraProjectClient
  aiUsage: ExtraProjectAiUsage
  description: string
  images: string[]
  tags: string[]
  buttons: ExtraProjectButton[]
}

function collectImages(project: Project) {
  if (project.slug === 'habitchain') return ['/projects/habitchain.png', '/projects/habitchain-pitch.png']
  if (project.slug === 'wedding') return ['/projects/wedding.png']

  const images: string[] = []
  const add = (src?: string) => {
    if (src && !images.includes(src)) images.push(src)
  }
  add(project.image)
  add(project.imageMobile)
  for (const item of project.media ?? []) {
    if (item.kind === 'image') {
      add(item.src)
      add(item.srcMobile)
    }
    if (item.kind === 'gallery') {
      for (const image of item.images ?? []) add(image.src)
    }
  }
  return images
}

export function projectToExtra(
  project: Project,
  copy: { description: string; category: string; timeframe: string },
): ExtraProject {
  return {
    slug: project.slug,
    title: project.title,
    category: copy.category,
    date: copy.timeframe,
    client: project.slug === 'halborn'
      ? { name: 'Halborn', url: project.live }
      : { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: {
      level: project.slug === 'prisma' ? 'Full' : 'None',
      description: '',
    },
    description: copy.description,
    images: collectImages(project),
    tags: [...project.tech],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: project.live, enabled: true },
      ...(project.code
        ? [{ type: 'source' as const, text: 'Repo', icon: 'code' as const, url: project.code, enabled: true }]
        : []),
    ],
  }
}

export function projectYear(date: string) {
  if (/present/i.test(date)) return Number.POSITIVE_INFINITY
  const years = date.match(/\d{4}/g)?.map(Number)
  return years?.length ? Math.max(...years) : 0
}

export function projectSubtitle(project: ExtraProject) {
  return `${project.category} · ${project.date}`
}

export function sortProjectsByDate(items: ExtraProject[]) {
  return items.toSorted((left, right) => projectYear(right.date) - projectYear(left.date))
}

export const extraProjects: ExtraProject[] = [
  {
    slug: 'repogpt',
    title: 'RepoGPT',
    category: 'Developer Tool',
    date: '2024',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: {
      level: 'Full',
      description: 'README notes that refactors and new implementations were largely produced with ChatGPT and Genie VS Code, exposing a live UI that calls OpenAI models.',
    },
    description: 'A tool that fetches files from a GitHub repository, merges them into a single context allowing for easy copy–paste into chatbots.',
    images: [talksAsset('/images/repogpt.png'), talksAsset('/images/repogpt-github.png')],
    tags: ['Next.js', 'TypeScript', 'OpenAI API', 'Tailwind CSS', 'Vercel'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://repogpt.markkop.dev/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/RepoGPT', enabled: true },
    ],
  },
  {
    slug: 'repo-env-generator',
    title: 'Repo Env Generator',
    category: 'Developer Tool',
    date: '2025',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'Full', description: '' },
    description: 'Web utility that scans a GitHub repository for environment variable usage and produces a .env file example.',
    images: [
      talksAsset('https://github.com/Markkop/RepoEnvGenerator/blob/main/public/og.png?raw=true'),
      talksAsset('/images/repoenvgen-github.png'),
    ],
    tags: ['Next.js', 'TypeScript', 'GitHub API', 'Vercel'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://repoenvgen.markkop.dev/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/RepoEnvGenerator', enabled: true },
    ],
  },
  {
    slug: 'beard-shave-tracker',
    title: 'Beard Shave Tracker',
    category: 'Micro-app',
    date: '2025',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'Full', description: '' },
    description: 'A micro‑app to track shaving history.',
    images: [talksAsset('/images/beard-tracker.png')],
    tags: ['React', 'TypeScript', 'Netlify'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://beard-shave-tracker.netlify.app/', enabled: true },
    ],
  },
  {
    slug: 'receipt-processor',
    title: 'Receipt Processor',
    category: 'Utility',
    date: '2025',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'Full', description: '' },
    description: 'Small utility that ingests receipt data and outputs parsed values for budgeting or claims. Built with Replit Agent',
    images: [talksAsset('/images/receipt-processor.png')],
    tags: ['JavaScript', 'Replit'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://stipend-claim-helper-markkop.replit.app/', enabled: true },
    ],
  },
  {
    slug: 'prompt-mural',
    title: 'Prompt Mural',
    category: 'Web App',
    date: '2025',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'Full', description: '' },
    description: 'A minimal public board to capture and iterate prompts for LLM workflows; designed for quick capture and sharing during experiments.',
    images: [talksAsset('/images/prompt-mural.png')],
    tags: ['Next.js', 'TypeScript', 'Vercel'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://promptmural.xyz/', enabled: true },
    ],
  },
  {
    slug: 'nft-marketplace',
    title: 'NFT Marketplace',
    category: 'DApp',
    date: '2022',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A full‑stack DApp for minting, listing, buying, and managing NFTs. Integrates IPFS via Pinata, MetaMask wallet, and testnet deployment scripts.',
    images: [talksAsset('/images/nft-marketplace-1.png'), talksAsset('/images/nft-marketplace-github.png')],
    tags: ['Next.js', 'Solidity', 'Hardhat', 'Ethers.js', 'IPFS', 'Vercel', 'Polygon'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://nft-marketplace-markkop.vercel.app/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/nft-marketplace', enabled: true },
    ],
  },
  {
    slug: 'essence-helper',
    title: 'Essence Helper',
    category: 'Voice App',
    date: '2022',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A Google App/Alexa Skill for ZenithVR MMORPG that delivers in‑game information via natural speech interfaces.',
    images: [talksAsset('/images/essence-helper.png'), talksAsset('/images/essence-helper-github.png')],
    tags: ['Jovo', 'TypeScript', 'Alexa', 'Google Assistant'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://www.amazon.com/dp/B09T6XJ3NT', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/essence-helper-jovo', enabled: true },
    ],
  },
  {
    slug: 'gather-websocket-api',
    title: 'Gather Websocket API Integration',
    category: 'API',
    date: '2021',
    client: { name: 'Codecon', url: 'https://codecon.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'An API integration with Gather Websocket to get statistics and create player interactions for the Codecon Online event.',
    images: [talksAsset('/images/codecon-gather-1.jpg')],
    tags: ['JavaScript', 'discord.js', 'Node.js'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://codecon.dev/', enabled: false, disabledReason: 'Project offline' },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/codecon-gather-api', enabled: true },
    ],
  },
  {
    slug: 'gamification-api',
    title: 'Gamification API',
    category: 'API',
    date: '2021',
    client: { name: 'Codecon', url: 'https://codecon.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'After building the Codecon Discord bot, we decided to move the gamification logic to a separate API so we could integrate it with the Codecon App',
    images: [talksAsset('/images/codecodes-api-1.png')],
    tags: ['JavaScript', 'Node.js'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://codecon.dev/', enabled: false, disabledReason: 'Project offline' },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/codecon-dev/codecodes-api', enabled: true },
    ],
  },
  {
    slug: 'codecon-discord-bot',
    title: 'Discord Bot',
    category: 'Community Bot',
    date: '2021',
    client: { name: 'Codecon', url: 'https://codecon.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A Discord bot for the Codecon community, used to manage ranks, claims, and token management.',
    images: [talksAsset('/images/codecon-discord-bot-1.jpg')],
    tags: ['JavaScript', 'discord.js', 'Node.js'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://codecon.dev/', enabled: false, disabledReason: 'Project offline' },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/codecon-dev/codecon-codes', enabled: true },
    ],
  },
  {
    slug: 'linktree-clone',
    title: 'LinkTree Clone',
    category: 'Website',
    date: '2024',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A simple linktree clone to make my links more accessible.',
    images: [talksAsset('/images/linktree-1.png')],
    tags: ['Next.js', 'Tailwind CSS'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://linktree.markkop.dev/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/linktree', enabled: true },
    ],
  },
  {
    slug: 'multiple-playlist-deleter',
    title: 'Multiple Playlist Deleter',
    category: 'Tool',
    date: '2023',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A tool to delete multiple playlists from a Spotify account.',
    images: [talksAsset('/images/spotify-1.jpeg')],
    tags: ['JavaScript', 'Spotify API'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://multiple-playlist-deleter.vercel.app/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/Multiple-Playlist-deleter', enabled: true },
    ],
  },
  {
    slug: 'mmorpg-guild-website',
    title: 'MMORPG Guild Website',
    category: 'Website',
    date: '2024',
    client: { name: 'Personal', url: 'https://www.corvosdeefrim.com/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A website for the Corvos de Efrim, a guild presente in multiple MMORPGs such as Wakfu, Dofus and Waven.',
    images: [talksAsset('/images/corvos-1.png')],
    tags: ['Next.js', 'Tailwind CSS'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://www.corvosdeefrim.com/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/corvos-de-efrim-website/', enabled: true },
    ],
  },
  {
    slug: 'web3-rewards-tracker',
    title: 'Web3 Rewards Tracker',
    category: 'Web App',
    date: '2022',
    client: { name: 'Multiple Clients', url: '' },
    aiUsage: { level: 'None', description: '' },
    description: 'A web app to track crypto rewards for web3 clients and users',
    images: [
      talksAsset('/images/retrocade-rewards-1.png'),
      talksAsset('/images/shilly-1.png'),
      talksAsset('/images/cryptoheadz-1.png'),
    ],
    tags: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Blockchain', 'BitQuery', 'PancakeSwap API'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://retrocade-rewards-tracker.vercel.app/', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/retrocade-earnings-checker', enabled: true },
    ],
  },
  {
    slug: 'youtube-download-cut',
    title: 'YouTube – Download & Cut',
    category: 'Desktop App',
    date: '2020',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'Incremental', description: '' },
    description: 'Cross‑platform Electron application to download a YouTube video and cut a clip by time range, with optional MP3 export.',
    images: [talksAsset('/images/yt-dl.png'), talksAsset('/images/yt-dlandcut-github.png')],
    tags: ['Electron', 'Node.js', 'FFmpeg', 'YouTube‑DL'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://github.com/Markkop/yt-dlandcut/releases', enabled: true },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/yt-dlandcut', enabled: true },
    ],
  },
  {
    slug: 'ecommerce-solutions',
    title: 'E-Commerce Solutions',
    category: 'Integration',
    date: '2019',
    client: { name: 'Linx', url: 'https://www.linx.com.br/' },
    aiUsage: { level: 'None', description: '' },
    description: 'As part of Linx team, I was responsible for the integration of the existing search, recommendation, showcase and banners products',
    images: [talksAsset('/images/lnx-1.png')],
    tags: ['JavaScript', 'PHP', 'jQuery', 'Vue.js'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: 'https://www.linx.com.br/busca-e-personalizacao/', enabled: true },
    ],
  },
  {
    slug: 'web-ar-business-card',
    title: 'Web AR Business Card',
    category: 'Prototype',
    date: '2021',
    client: { name: 'ArcTouch', url: 'https://www.arctouch.com/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A proof of concept for a business card that uses a marker to display 3D models using Augmented Reality.',
    images: [talksAsset('/images/web-ar.png')],
    tags: ['AR.js', 'A-Frame', 'HTML', 'CSS', 'JavaScript'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: '', enabled: false, disabledReason: 'Private project' },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/web-ar-testing', enabled: true },
    ],
  },
  {
    slug: 'metaverse-project',
    title: 'Metaverse Project',
    category: 'Prototype',
    date: '2022',
    client: { name: 'ArcTouch', url: 'https://www.arctouch.com/' },
    aiUsage: { level: 'None', description: '' },
    description: 'A proof of concept for making a Decentraland plot/scene interacting with external APIs',
    images: [
      talksAsset('/images/metaverse-3.png'),
      talksAsset('/images/metaverse-1.jpg'),
      talksAsset('/images/metaverse-2.png'),
    ],
    tags: ['Decentraland', 'Metaverse', 'TypeScript', 'Web3'],
    buttons: [
      { type: 'view', text: 'Visit', icon: 'globe', url: '', enabled: false, disabledReason: 'Private project' },
      { type: 'source', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/decentraland-scene-test', enabled: true },
    ],
  },
  {
    slug: 'habitica-scripts',
    title: 'Habitica Scripts',
    category: 'Scripts',
    date: '2019',
    client: { name: 'Personal', url: 'https://markkop.dev/' },
    aiUsage: { level: 'None', description: '' },
    description: 'One of my first projects, a set of scripts to extend Habitica.com functionality. It features a Pomodoro Timer task, Custom Skills and keyboard shortcurs.',
    images: [talksAsset('/images/habitica-1.jpg')],
    tags: ['JavaScript', 'Habitica API'],
    buttons: [
      { type: 'view', text: 'Repo', icon: 'code', url: 'https://github.com/Markkop/habiticaScripts', enabled: true },
    ],
  },
]
