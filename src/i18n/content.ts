import { profile, projects } from '@/data/profile'

export type Language = 'en' | 'pt-BR'

type ProjectCopy = {
  description: string
  category: string
  metric: string
  timeframe: string
  tabs?: Record<string, string>
}

export type SiteContent = {
  language: { label: string; switchLabel: string }
  nav: { home: string; about: string; projects: string; stack: string; contact: string; connect: string; links: string }
  accessibility: { skip: string; backToTop: string; nextSection: string; startupUi: (active: boolean) => string; primaryNav: string; toggleMenu: string; socialProfiles: string; theme: (theme: 'dark' | 'light') => string }
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
    stats: Array<{ prefix: string; label: string }>
    cards: Array<{ label: string; title: string; text: string }>
    journey: string
    careerMilestones: string[]
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
    embedHint: string
    embedBack: string
    embedForward: string
    embedReload: string
    tapToInteract: string
    tapToInteractHint: string
    exitPreview: string
    livePreview: string
    scroll: string
    keepScrolling: string
    items: Record<string, ProjectCopy>
  }
  stack: { eyebrow: string; title: string; titleHighlight: string; intro: string; assemble: string }
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
    ...(project.media ? {
      tabs: Object.fromEntries(project.media.flatMap((item) => item.label ? [[item.id, item.label]] : [])),
    } : {}),
  }]),
)

const portugueseProjects: Record<string, ProjectCopy> = {
  habitchain: {
    description: 'Um rastreador de hábitos com compromisso real, usando incentivos onchain para transformar consistência em responsabilidade.',
    category: 'Produto Onchain',
    metric: 'Hábitos com valor em stake',
    timeframe: '2025–2026',
    tabs: {
      live: 'Prévia ao vivo',
      app: 'App',
      pitch: 'Pitch de um slide',
    },
  },
  prisma: {
    description: 'Um espaço para reunir anúncios de imóveis, comparar propriedades e planejar a compra de uma casa.',
    category: 'Plataforma Imobiliária',
    metric: 'Fluxo assistido por IA',
    timeframe: '2025–2026',
  },
  wedding: {
    description: 'Uma ferramenta focada em organizar convidados, convites, ordenação, detalhes e confirmações de presença.',
    category: 'Ferramenta de Planejamento',
    metric: 'Fluxo de convidados',
    timeframe: '2025–2026',
  },
  'corvo-astral': {
    description: 'Um bot comunitário para Discord que reúne e disponibiliza informações úteis para jogadores de Wakfu.',
    category: 'Bot Comunitário',
    metric: '30 estrelas no GitHub',
    timeframe: '2020–presente',
  },
}

export const content: Record<Language, SiteContent> = {
  en: {
    language: { label: 'English', switchLabel: 'Switch language to Portuguese' },
    nav: { home: 'Home', about: 'About', projects: 'Projects', stack: 'Stack', contact: 'Contact', connect: 'Connect', links: 'Links' },
    accessibility: {
      skip: 'Skip to content',
      backToTop: 'Scroll back to top',
      nextSection: 'Go to next section',
      startupUi: (active) => active ? 'Dismiss startup UI' : 'Replay startup UI',
      primaryNav: 'Primary navigation',
      toggleMenu: 'Toggle menu',
      socialProfiles: 'Social profiles',
      theme: (theme) => `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
    },
    status: { building: 'Building in public', latest: 'Latest activity' },
    hero: {
      lead: 'I build web, blockchain and AI-powered products.',
      highlight: 'Software Engineer. Frontend Specialist.',
      summary: 'Custom landing pages, chatbots and web systems suited for your needs',
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
      stats: profile.stats.map((stat) => ({ prefix: stat.prefix, label: stat.label })),
      cards: profile.about.map((item) => ({ ...item })),
      journey: '// JOURNEY',
      careerMilestones: profile.milestones.map((item) => item.role),
      milestones: profile.journey.map((item) => item.role),
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
      embedHint: 'Scroll to explore',
      embedBack: 'Back to start',
      embedForward: 'Forward',
      embedReload: 'Reload preview',
      tapToInteract: 'Tap to interact',
      tapToInteractHint: 'Scroll outside the preview to continue',
      exitPreview: 'Done',
      livePreview: 'Live preview',
      scroll: 'Scroll to explore',
      keepScrolling: 'Keep scrolling',
      items: englishProjects,
    },
    stack: {
      eyebrow: '// TOOLS OF THE TRADE',
      title: 'My tech',
      titleHighlight: 'stack.',
      intro: 'Different tools for different jobs.',
      assemble: 'Scroll to assemble',
    },
    now: {
      eyebrow: 'Currently doing',
      items: [
        'Building the best enterprise client portal',
        'Launching a home purchase planner product',
        'Participating in web3 and AI hackathons',
        'Attending and volunteering at tech events',
      ],
      updated: 'Updated August 2026',
    },
    contact: {
      eyebrow: 'START A PROJECT',
      title: 'Let\'s Build Your Next',
      titleHighlight: 'Web Project.',
      intro: 'Full-stack developer in Santa Catarina, Brazil. Available for freelance, contracts, and remote collaborations worldwide.',
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
      nextSection: 'Ir para a próxima seção',
      startupUi: (active) => active ? 'Fechar tela inicial' : 'Reexibir tela inicial',
      primaryNav: 'Navegação principal',
      toggleMenu: 'Abrir ou fechar menu',
      socialProfiles: 'Perfis sociais',
      theme: (theme) => `Mudar para o tema ${theme === 'dark' ? 'claro' : 'escuro'}`,
    },
    status: { building: 'Construindo em público', latest: 'Atividade recente' },
    hero: {
      lead: 'Eu crio produtos web, blockchain e com IA.',
      highlight: 'Engenheiro de Software. Especialista em Frontend.',
      summary: 'Landing pages, chatbots e sistemas web sob medida para as suas necessidades',
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
      stats: [
        { prefix: 'Desde', label: 'Programando' },
        { prefix: 'Cerca de', label: 'Seguidores no blog' },
        { prefix: 'Mais de', label: 'Projetos concluídos' },
        { prefix: 'Conquistou', label: 'Vitórias em hackathons' },
      ],
      cards: [
        { label: '// O PORQUÊ', title: 'Por que eu programo', text: 'Programar para mim é como mágica. Ter a habilidade de transformar qualquer ideia em algo útil é um poder enorme, e eu amo isso. O coding com agentes é a varinha mágica que faltava para eu começar a construir produtos que as pessoas realmente vão gostar.' },
        { label: '// VALORES', title: 'O que eu valorizo', text: 'Valorizo proatividade, curiosidade, criatividade, trabalho em equipe, respeito e senso de dono. A mágica acontece quando trabalho com pessoas que compartilham esses mesmos princípios.' },
        { label: '// MOTIVAÇÃO', title: 'O que me motiva', text: 'Quero me divertir, trabalhar com o que gosto e dar o meu melhor nisso. O feedback de gestores e colegas sempre indica que estou no caminho certo.' },
      ],
      journey: '// JORNADA',
      careerMilestones: [
        'Full-stack Developer',
        'Senior Software Engineer',
        'Frontend Developer',
        'Senior Frontend Developer',
        'sites, consultoria e workshops',
      ],
      milestones: [
        'Bot open source para Discord com 1k+ usuários',
        'Voluntário no primeiro evento tech',
        'Graduação em Análise e Desenvolvimento de Sistemas',
        'Múltiplas vitórias em hackathons',
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
      embedHint: 'Role para explorar',
      embedBack: 'Voltar ao início',
      embedForward: 'Avançar',
      embedReload: 'Recarregar prévia',
      tapToInteract: 'Toque para interagir',
      tapToInteractHint: 'Role fora da prévia para continuar',
      exitPreview: 'Concluir',
      livePreview: 'Prévia ao vivo',
      scroll: 'Role para explorar',
      keepScrolling: 'Continue rolando',
      items: portugueseProjects,
    },
    stack: {
      eyebrow: '// FERRAMENTAS DO OFÍCIO',
      title: 'Minha tech',
      titleHighlight: 'stack.',
      intro: 'Ferramentas diferentes para trabalhos diferentes.',
      assemble: 'Role para montar',
    },
    now: {
      eyebrow: 'CRIANDO AGORA',
      items: [
        'Construindo o melhor portal de clientes enterprise',
        'Lançando um produto de planejamento de compra de imóvel',
        'Participando de hackathons de web3 e IA',
        'Voluntariando em eventos de tecnologia',
      ],
      updated: 'Atualizado em agosto de 2026',
    },
    contact: {
      eyebrow: 'COMECE UM PROJETO',
      title: 'Vamos construir seu próximo',
      titleHighlight: 'projeto web.',
      intro: 'Desenvolvedor full-stack em Santa Catarina, Brasil. Disponível para freelance, contratos e colaborações remotas no mundo todo.',
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
