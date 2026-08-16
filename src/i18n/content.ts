import { profile, projects } from '@/data/profile'

export type Language = 'en' | 'pt-BR'

type ProjectCopy = {
  description: string
  category: string
  metric: string
  timeframe: string
}

export type SiteContent = {
  language: { label: string; switchLabel: string }
  nav: { home: string; about: string; projects: string; stack: string; contact: string; connect: string; links: string }
  accessibility: { skip: string; backToTop: string; primaryNav: string; toggleMenu: string; socialProfiles: string; theme: (theme: 'dark' | 'light') => string }
  status: { building: string; latest: string }
  hero: {
    lead: string
    highlight: string
    summary: string
    explore: string
    linkedin: string
    role: string
    location: string
    focus: string
    state: string
  }
  about: {
    eyebrow: string
    title: string
    titleHighlight: string
    stats: string[]
    cards: Array<{ label: string; title: string; text: string }>
    journey: string
    milestones: string[]
  }
  projects: {
    eyebrow: string
    title: string
    titleHighlight: string
    intro: string
    visit: string
    source: string
    choose: string
    show: (title: string) => string
    preview: (title: string) => string
    hoverPreview: string
    scroll: string
    keepScrolling: string
    items: Record<string, ProjectCopy>
  }
  stack: { eyebrow: string; title: string; titleHighlight: string; intro: string; assemble: string; groups: string[] }
  now: { eyebrow: string; items: string[]; updated: string }
  contact: {
    eyebrow: string
    title: string
    titleHighlight: string
    intro: string
    linkedin: string
    github: string
    allLinks: string
    allLinksDescription: string
  }
  footer: { built: string }
  links: {
    back: string
    eyebrow: string
    summary: string
    ai: string
    openSource: string
    connect: string
    selectedWork: string
    github: string
    linkedin: string
  }
  notFound: { title: string; text: string; home: string }
  error: { title: string; text: string; retry: string }
}

const englishProjects = Object.fromEntries(
  projects.map((project) => [project.slug, {
    description: project.description,
    category: project.category,
    metric: project.metric,
    timeframe: project.timeframe,
  }]),
)

const portugueseProjects: Record<string, ProjectCopy> = {
  habitchain: {
    description: 'Um rastreador de hábitos com compromisso real, usando incentivos onchain para transformar consistência em responsabilidade.',
    category: 'Produto Onchain',
    metric: 'Hábitos com valor em stake',
    timeframe: '2025–2026',
  },
  'minha-casa': {
    description: 'Um espaço para reunir anúncios de imóveis, comparar propriedades e planejar a compra de uma casa.',
    category: 'Plataforma Imobiliária',
    metric: 'Fluxo assistido por IA',
    timeframe: '2025–2026',
  },
  stipend: {
    description: 'Extrai dados de recibos em PDF com IA, converte moedas e prepara rapidamente as informações de reembolso.',
    category: 'Utilitário com IA',
    metric: 'PDF para dados estruturados',
    timeframe: '2025',
  },
  wedding: {
    description: 'Uma ferramenta focada em organizar convidados, convites, ordenação, detalhes e confirmações de presença.',
    category: 'Ferramenta de Planejamento',
    metric: 'Fluxo de convidados',
    timeframe: '2025–2026',
  },
  'nft-marketplace': {
    description: 'Um marketplace completo de NFTs criado para explorar comércio com smart contracts e propriedade descentralizada.',
    category: 'Marketplace Web3',
    metric: '181 estrelas no GitHub',
    timeframe: '2022',
  },
  'corvo-astral': {
    description: 'Um bot comunitário para Discord que reúne e disponibiliza informações úteis para jogadores de Wakfu.',
    category: 'Bot Comunitário',
    metric: '30 estrelas no GitHub',
    timeframe: '2020–presente',
  },
  repogpt: {
    description: 'Combina os arquivos de um repositório em um pacote de texto limpo para contexto de LLMs e conversas sobre código.',
    category: 'Ferramenta para Devs',
    metric: 'Repositório para contexto',
    timeframe: '2023–2024',
  },
  'repo-env-generator': {
    description: 'Analisa um repositório e identifica suas variáveis de ambiente para acelerar a configuração do projeto.',
    category: 'Ferramenta para Devs',
    metric: 'Descoberta automática de envs',
    timeframe: '2024',
  },
  'spotify-playlist-deleter': {
    description: 'Um pequeno utilitário para selecionar e excluir várias playlists do Spotify de uma só vez.',
    category: 'Ferramenta de Produtividade',
    metric: '14 estrelas no GitHub',
    timeframe: '2023',
  },
  'werewolf-moderator': {
    description: 'Um companheiro para noites de jogo que ajuda moderadores a gerenciar papéis e estados em partidas de Lobisomem e Máfia.',
    category: 'Utilitário para Jogos',
    metric: 'Estado da partida ao vivo',
    timeframe: '2023–2024',
  },
}

export const content: Record<Language, SiteContent> = {
  en: {
    language: { label: 'English', switchLabel: 'Switch language to Portuguese' },
    nav: { home: 'Home', about: 'About', projects: 'Projects', stack: 'Stack', contact: 'Contact', connect: 'Connect', links: 'Links' },
    accessibility: {
      skip: 'Skip to content',
      backToTop: 'Scroll back to top',
      primaryNav: 'Primary navigation',
      toggleMenu: 'Toggle menu',
      socialProfiles: 'Social profiles',
      theme: (theme) => `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
    },
    status: { building: 'Building in public', latest: 'Latest activity' },
    hero: {
      lead: 'I build practical products where',
      highlight: 'web, AI, games & onchain systems meet.',
      summary: profile.summary,
      explore: 'Explore my work',
      linkedin: 'Connect on LinkedIn',
      role: profile.role,
      location: profile.location,
      focus: 'web_products + ai_workflows + open_source + onchain_incentives',
      state: '● curious, shipping, learning',
    },
    about: {
      eyebrow: '// ABOUT ME',
      title: 'The person behind',
      titleHighlight: 'the prompt.',
      stats: profile.stats.map((stat) => stat.label),
      cards: profile.about.map((item) => ({ ...item })),
      journey: '// JOURNEY',
      milestones: profile.milestones.map((item) => item.text),
    },
    projects: {
      eyebrow: '// SELECTED WORK',
      title: 'From idea',
      titleHighlight: 'to product.',
      intro: 'Tools, experiments, and products built across more than a decade of learning in public.',
      visit: 'Visit project',
      source: 'Source',
      choose: 'Choose a project',
      show: (title) => `Show ${title}`,
      preview: (title) => `${title} project preview`,
      hoverPreview: 'Hover to scroll preview',
      scroll: 'Scroll to explore',
      keepScrolling: 'Keep scrolling',
      items: englishProjects,
    },
    stack: {
      eyebrow: '// TOOLS OF THE TRADE',
      title: 'My technical',
      titleHighlight: 'constellation.',
      intro: 'Different tools for different jobs—chosen for the problem, not the trend.',
      assemble: 'Scroll to assemble',
      groups: ['Frontend', 'Backend', 'Onchain', 'Tools'],
    },
    now: {
      eyebrow: 'CURRENTLY BUILDING',
      items: [
        'Building habit systems with meaningful incentives',
        'Exploring AI-assisted product workflows',
        'Maintaining open-source tools and community projects',
        'Shipping small experiments that teach something',
      ],
      updated: 'Updated August 2026',
    },
    contact: {
      eyebrow: '// LET\'S CONNECT',
      title: 'Have an interesting',
      titleHighlight: 'problem to solve?',
      intro: 'I’m always interested in thoughtful products, open-source collaboration, and systems that make work or life more rewarding.',
      linkedin: 'Start a conversation',
      github: 'Explore 98+ repositories',
      allLinks: 'All links',
      allLinksDescription: 'Projects and profiles',
    },
    footer: { built: 'Designed & built by Mark · markkop.dev' },
    links: {
      back: 'Back to markkop.dev',
      eyebrow: '// LINKS',
      summary: 'Software engineer building useful, playful, and open products.',
      ai: 'AI',
      openSource: 'Open source',
      connect: 'Connect',
      selectedWork: 'Selected work',
      github: 'Open-source projects and experiments',
      linkedin: 'Professional profile and contact',
    },
    notFound: { title: 'This route wandered off.', text: 'The page is missing, but the rest of the system is still online.', home: 'Return home' },
    error: { title: 'Something went wrong.', text: 'An unexpected error occurred. Try rendering this page again.', retry: 'Try again' },
  },
  'pt-BR': {
    language: { label: 'Português', switchLabel: 'Mudar idioma para inglês' },
    nav: { home: 'Início', about: 'Sobre', projects: 'Projetos', stack: 'Stack', contact: 'Contato', connect: 'Conectar', links: 'Links' },
    accessibility: {
      skip: 'Pular para o conteúdo',
      backToTop: 'Voltar ao topo',
      primaryNav: 'Navegação principal',
      toggleMenu: 'Abrir ou fechar menu',
      socialProfiles: 'Perfis sociais',
      theme: (theme) => `Mudar para o tema ${theme === 'dark' ? 'claro' : 'escuro'}`,
    },
    status: { building: 'Construindo em público', latest: 'Atividade recente' },
    hero: {
      lead: 'Eu crio produtos práticos onde',
      highlight: 'web, IA, jogos e sistemas onchain se encontram.',
      summary: 'Engenheiro full-stack que transforma ideias em ferramentas úteis, experiências divertidas e software open source.',
      explore: 'Conheça meu trabalho',
      linkedin: 'Conectar no LinkedIn',
      role: 'Engenheiro de Software',
      location: 'Santa Catarina, Brasil',
      focus: 'produtos_web + fluxos_com_ia + open_source + incentivos_onchain',
      state: '● curioso, criando, aprendendo',
    },
    about: {
      eyebrow: '// SOBRE MIM',
      title: 'A pessoa por trás',
      titleHighlight: 'do prompt.',
      stats: ['Anos programando', 'Vitórias em hackathons', 'Seguidores no blog', 'Eventos de tech'],
      cards: [
        { label: '// O PORQUÊ', title: 'Por que eu programo', text: 'Programar para mim é como mágica. Ter a habilidade de transformar qualquer ideia em algo útil é um poder enorme, e eu amo isso. O coding com agentes é a varinha mágica que faltava para eu começar a construir produtos que as pessoas realmente vão gostar.' },
        { label: '// VALORES', title: 'O que eu valorizo', text: 'Valorizo proatividade, curiosidade, criatividade, trabalho em equipe, respeito e senso de dono. A mágica acontece quando trabalho com pessoas que compartilham esses mesmos princípios.' },
        { label: '// MOTIVAÇÃO', title: 'O que me motiva', text: 'Não quero impactar o mundo inteiro com um produto nem fazer TED talks em nome de uma big tech. Quero me divertir, trabalhar com o que gosto e dar o meu melhor nisso. O feedback de gestores e colegas sempre indica que estou no caminho certo.' },
      ],
      journey: '// JORNADA',
      milestones: [
        'Full-stack Developer @ Linx',
        'Voluntário no primeiro evento tech (Codecon)',
        'Senior Software Engineer @ ArcTouch',
        'Frontend Developer @ Halborn',
        'Senior Frontend Developer @ Halborn',
        'Halborn, Codecon, Side Projects',
      ],
    },
    projects: {
      eyebrow: '// TRABALHOS SELECIONADOS',
      title: 'Da ideia',
      titleHighlight: 'ao produto.',
      intro: 'Ferramentas, experimentos e produtos criados ao longo de mais de uma década aprendendo em público.',
      visit: 'Visitar projeto',
      source: 'Código',
      choose: 'Escolha um projeto',
      show: (title) => `Mostrar ${title}`,
      preview: (title) => `Prévia do projeto ${title}`,
      hoverPreview: 'Passe o mouse para rolar a prévia',
      scroll: 'Role para explorar',
      keepScrolling: 'Continue rolando',
      items: portugueseProjects,
    },
    stack: {
      eyebrow: '// FERRAMENTAS DO OFÍCIO',
      title: 'Minha constelação',
      titleHighlight: 'técnica.',
      intro: 'Ferramentas diferentes para trabalhos diferentes—escolhidas pelo problema, não pela tendência.',
      assemble: 'Role para montar',
      groups: ['Frontend', 'Backend', 'Onchain', 'Ferramentas'],
    },
    now: {
      eyebrow: 'CRIANDO AGORA',
      items: [
        'Criando sistemas de hábitos com incentivos significativos',
        'Explorando fluxos de produto assistidos por IA',
        'Mantendo ferramentas open source e projetos comunitários',
        'Lançando pequenos experimentos que ensinam algo',
      ],
      updated: 'Atualizado em agosto de 2026',
    },
    contact: {
      eyebrow: '// VAMOS CONVERSAR',
      title: 'Tem um problema',
      titleHighlight: 'interessante para resolver?',
      intro: 'Estou sempre interessado em produtos bem pensados, colaboração open source e sistemas que tornam o trabalho ou a vida mais recompensadores.',
      linkedin: 'Iniciar uma conversa',
      github: 'Explorar mais de 98 repositórios',
      allLinks: 'Todos os links',
      allLinksDescription: 'Projetos e perfis',
    },
    footer: { built: 'Projetado e desenvolvido por Mark · markkop.dev' },
    links: {
      back: 'Voltar para markkop.dev',
      eyebrow: '// LINKS',
      summary: 'Engenheiro de software criando produtos úteis, divertidos e abertos.',
      ai: 'IA',
      openSource: 'Código aberto',
      connect: 'Conecte-se',
      selectedWork: 'Trabalhos selecionados',
      github: 'Projetos e experimentos open source',
      linkedin: 'Perfil profissional e contato',
    },
    notFound: { title: 'Esta rota se perdeu.', text: 'A página não existe, mas o restante do sistema continua online.', home: 'Voltar ao início' },
    error: { title: 'Algo deu errado.', text: 'Ocorreu um erro inesperado. Tente renderizar esta página novamente.', retry: 'Tentar novamente' },
  },
}
