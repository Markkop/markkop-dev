import type { StackTech } from './profile'

export const stackLogos = {
  TypeScript: '/techstackicons/typescript-icon-svgrepo-com.svg',
  React: '/techstackicons/react-svgrepo-com.svg',
  'Next.js': '/techstackicons/next.svg',
  Svelte: '/techstackicons/svelte.svg',
  'Tailwind CSS': '/techstackicons/tailwindcss-icon-svgrepo-com.svg',
  'Node.js': '/techstackicons/nodejs-icon-svgrepo-com.svg',
  Elixir: '/techstackicons/elixir.svg',
  PostgreSQL: '/techstackicons/postgresql-svgrepo-com.svg',
  Supabase: '/techstackicons/supabase-logo-icon.svg',
  Solidity: '/techstackicons/solidity.svg',
  Hardhat: '/techstackicons/hardhat.svg',
  Foundry: '/techstackicons/foundry.png',
  EVM: '/techstackicons/ethereum.svg',
  Polkadot: '/techstackicons/polkadot.svg',
  GitHub: '/techstackicons/github (1).svg',
  Docker: '/techstackicons/docker-svgrepo-com.svg',
  Vercel: '/techstackicons/vercel.svg',
  Forgejo: '/techstackicons/forgejo.svg',
  OpenAI: '/techstackicons/openai.svg',
  Codex: '/techstackicons/codex.svg',
  Claude: '/techstackicons/Claude_AI_symbol.svg',
  Cursor: '/techstackicons/cursor.png',
  'VS Code': '/techstackicons/Visual Studio Code (VS Code).svg',
} satisfies Record<StackTech, string>

export const techLogos: Record<string, string> = {
  ...stackLogos,
  Discord: '/companies/discord.svg',
}

export const invertOnLightLogos = new Set<string>(['Solidity', 'GitHub', 'OpenAI', 'Codex', 'Vercel'])
