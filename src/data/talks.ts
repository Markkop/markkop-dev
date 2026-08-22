import { talksAsset } from '@/data/talksAssets'

export type TalkTag = {
  label: string
  url?: string
}

export type Talk = {
  slug: string
  title: string
  date: string
  event: string
  eventLink?: string
  location: string
  locationLink?: string
  description: string
  presentationLink: string
  feedbackLink: string
  coverImage: string
  tags: TalkTag[]
  topCover?: boolean
  fit?: 'cover' | 'contain'
  favicon?: string
  faviconOnDark?: boolean
  faviconFill?: boolean
}

export const talks: Talk[] = [
  {
    slug: 'self-hosting-ai-tooling',
    title: 'Self-Hosting & AI Tooling',
    date: '2026-08-25',
    event: 'Meetup Codecon FLN',
    location: 'Hostgator, Florianópolis',
    locationLink: 'https://maps.google.com/?q=Rua+Lauro+Linhares,+589,+Trindade,+Florian%C3%B3polis',
    description: 'How to self-host AI tooling and keep your development workflow under your own control',
    presentationLink: '',
    feedbackLink: '',
    coverImage: talksAsset('https://res.cloudinary.com/dmslsrxjq/image/upload/v1786467467/codecon-events/events/mdjf2rd3duxsbaewpcfp.jpg'),
    favicon: '/talks/favicons/codecon.png',
    faviconOnDark: true,
    tags: [
      { label: 'cursor', url: 'https://cursor.com' },
      { label: 'codex', url: 'https://chatgpt.com/codex' },
      { label: 'coolify', url: 'https://coolify.io' },
      { label: 'hostinger', url: 'https://www.hostinger.com' },
      { label: 'hermes', url: 'https://hermes-agent.nousresearch.com/docs/' },
    ],
    topCover: false,
    fit: 'contain',
  },
  {
    slug: 'state-of-ai-2025',
    title: 'State of AI 2025',
    date: '2025-03-22',
    event: 'Meetup FloripaJS',
    eventLink: 'https://www.meetup.com/floripajs/events/306419173',
    location: 'Neoway, Florianópolis',
    description: 'Find out how to keep up with AI and how people are using it when it comes to software development',
    presentationLink: 'https://docs.google.com/presentation/d/1XIx461UwqQDwO-j9bc-ppZVU0vikgahO_D9hN6I_a4g/edit?usp=sharing',
    feedbackLink: 'https://openfeedback.io/TcKKJ25Pz1FjZZpL8j79/2025-03-22/44tlHpo0j7RwMN7bJV7v',
    coverImage: talksAsset('https://secure.meetupstatic.com/photos/event/8/f/3/4/600_526476660.webp?w=750'),
    favicon: '/talks/favicons/floripajs.png',
    faviconFill: true,
    tags: [
      { label: 'flow', url: 'https://wisprflow.ai/' },
      { label: 'bolt', url: 'https://bolt.new/' },
      { label: 'suno', url: 'https://suno.com/' },
      { label: 'ai json video', url: 'https://youtu.be/fJgFZRGO9AQ' },
      { label: 'browsertools', url: 'https://browsertools.agentdesk.ai' },
      { label: 'cursor', url: 'https://cursor.directory/mcp' },
      { label: 'claude', url: 'https://www.claudemcp.com/servers' },
      { label: 'LLM Arena', url: 'https://lmarena.ai/' },
    ],
    topCover: true,
  },
  {
    slug: '10x-dev-ai',
    title: '10x Dev AI',
    date: '2024-10-01',
    event: 'Meetup Codecon FLN',
    eventLink: 'https://eventos.codecon.dev/meetup-codecon-fln-07/',
    location: 'Time Out, Florianópolis',
    description: 'Discover which AI tools you need to know to stay ahead and boost your productivity',
    presentationLink: 'https://docs.google.com/presentation/d/15BrDsRLp7sL_ZXCRuKPXbGFI_AR2K_WUi--aKHO-rrI/edit?usp=drivesdk',
    feedbackLink: 'https://openfeedback.io/TcKKJ25Pz1FjZZpL8j79/2024-09-25/F9I15yaOrcTKpDFzRO8x',
    coverImage: talksAsset('https://i.imgur.com/CNFhtZE.png'),
    favicon: '/talks/favicons/codecon.png',
    faviconOnDark: true,
    tags: [
      { label: 'v0', url: 'https://v0.dev/' },
      { label: 'Phind', url: 'https://www.phind.com' },
      { label: 'Aider', url: 'https://github.com/paul-gauthier/aider' },
      { label: 'Cursor', url: 'https://cursor.sh' },
      { label: '@AICodeKing', url: 'https://www.youtube.com/@AICodeKing' },
      { label: '@intheworldofai', url: 'https://www.youtube.com/@intheworldofai' },
      { label: 'video', url: 'https://www.youtube.com/watch?v=TBIjgBVFjVI' },
      { label: 'podcast', url: 'https://www.youtube.com/watch?v=uRuLgar5XZw' },
    ],
    topCover: false,
  },
  {
    slug: 'habitica-talk',
    title: 'Habitica Talk',
    date: '2019-09-07',
    event: 'Flask Conf',
    eventLink: 'https://2019.flask.python.org.br/',
    location: 'Softplan, Florianópolis',
    description: 'How I used Habitica to gamify my life and make my first open source contribution',
    presentationLink: 'https://docs.google.com/presentation/d/1BCFNadvJbrBUpa4wOWb_reQrAX0QjnWZs05xkAGAA8Y/edit?usp=sharing',
    feedbackLink: '',
    coverImage: talksAsset('https://i.imgur.com/FbKUQJX.png'),
    favicon: '/talks/favicons/flask-conf.png',
    faviconFill: true,
    tags: [
      { label: 'Habitica', url: 'https://habitica.com' },
      { label: 'github', url: 'https://github.com/HabitRPG/habitica' },
      { label: 'blogpost', url: 'https://dev.to/heymarkkop/my-first-open-source-contribution-21dh' },
      { label: 'pr', url: 'https://github.com/HabitRPG/habitica/pull/11375' },
    ],
    topCover: false,
  },
  {
    slug: 'rails-in-2019',
    title: 'Rails in 2019',
    date: '2019-08-27',
    event: 'Meetup RubyFloripa',
    eventLink: 'https://www.meetup.com/rubyfloripa/events/263061972/',
    location: 'Mercado Livre, Florianópolis',
    description: 'Some news, stats and reflexions about Ruby on Rails',
    presentationLink: 'https://docs.google.com/presentation/d/1d8SST0bhF-O0OEsclPWFsDKQsdAGjpTlEm-l_XSHvzI/edit?usp=sharing',
    feedbackLink: '',
    coverImage: talksAsset('https://i.imgur.com/kpyVVsu.png'),
    favicon: '/talks/favicons/rubyfloripa.png',
    faviconFill: true,
    tags: [
      { label: 'Ruby', url: 'https://www.ruby-lang.org/en/' },
      { label: 'Rails', url: 'https://rubyonrails.org' },
      { label: 'survey', url: 'https://survey.stackoverflow.co/' },
      { label: 'blogpost', url: 'https://naturaily.com/blog/who-gives-f-about-rails' },
    ],
    topCover: true,
  },
]
