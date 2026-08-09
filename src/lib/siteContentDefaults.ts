// Tipos e valores padrão do conteúdo do site. Este módulo NÃO importa nada
// do Admin SDK (ao contrário de siteContent.ts) — pode ser importado com
// segurança tanto de Server Components quanto de Client Components (ex: a
// página /servicos usa DEFAULT_SERVICOS como placeholder enquanto carrega).

export const SITE_CONTENT_PAGE_KEYS = [
  "home",
  "quemSomos",
  "servicos",
  "contatos",
  "trabalheConosco",
  "headerFooter",
] as const;

export type SiteContentPageKey = (typeof SITE_CONTENT_PAGE_KEYS)[number];

export function isSiteContentPageKey(value: string): value is SiteContentPageKey {
  return (SITE_CONTENT_PAGE_KEYS as readonly string[]).includes(value);
}

export interface HomeContent {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
}

export interface QuemSomosContent {
  bannerTitle: string;
  subtitle1: string;
  subtitle2: string;
  bannerImage: string;
}

export interface ServicosContent {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  servicosHeading: string;
  servico1Titulo: string;
  servico1Texto: string;
  servico1DesktopImg: string;
  servico1MobileImg: string;
  servico2Titulo: string;
  servico2Texto: string;
  servico2DesktopImg: string;
  servico2MobileImg: string;
  servico3Titulo: string;
  servico3Texto: string;
  servico3DesktopImg: string;
  servico3MobileImg: string;
  equipamentosHeading: string;
  equipamentosSubheading: string;
  equip1Img: string;
  equip1Texto: string;
  equip2Img: string;
  equip2Texto: string;
  equip3Img: string;
  equip3Texto: string;
  produtosSectionTitle: string;
  produtosSectionSubtitle: string;
}

export interface ContatosContent {
  bannerTitle: string;
  bannerImage: string;
  introTitle: string;
  introParagraph: string;
  testimonialsHeading: string;
  testimonial1: string;
  testimonial2: string;
  testimonial3: string;
  closingText: string;
}

export interface TrabalheConoscoContent {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  section1Title: string;
  section1Paragraph1: string;
  section1Paragraph2: string;
  section1Paragraph3: string;
  section2Title: string;
  section2Intro: string;
  section2Image: string;
  section2SubTitle: string;
  section2Paragraph1: string;
  section2Paragraph2: string;
  ctaTitle: string;
}

export interface HeaderFooterContent {
  logoImage: string;
  contactEmail: string;
  whatsappPhoneDigits: string;
  whatsappPhoneDisplay: string;
  instagramUrl: string;
  facebookUrl: string;
}

export interface SiteContentByPage {
  home: HomeContent;
  quemSomos: QuemSomosContent;
  servicos: ServicosContent;
  contatos: ContatosContent;
  trabalheConosco: TrabalheConoscoContent;
  headerFooter: HeaderFooterContent;
}

export const DEFAULT_HOME: HomeContent = {
  bannerTitle: "AGRICULTURA DE PRECISÃO",
  bannerSubtitle:
    "Empresa especialista que fornece soluções tecnológicas avançadas que ajudam a cultivar de maneira mais eficiente e sustentável.",
  bannerImage: "/Home_background.png",
};

export const DEFAULT_QUEM_SOMOS: QuemSomosContent = {
  bannerTitle: "QUEM SOMOS",
  subtitle1:
    "Bem-vindo à P3Agro: A P3Agro é uma empresa inovadora em agricultura de precisão, fundada em 2020.",
  subtitle2:
    "Nossa missão é mais do que apenas fornecer ferramentas e conhecimentos aos agricultores. É sobre capacitar os agricultores para alimentar o mundo de uma maneira que seja sustentável para o nosso planeta. Acreditamos que a tecnologia certa pode transformar a agricultura e nos ajudar a construir um futuro mais verde.",
  bannerImage: "/Home_background.png",
};

export const DEFAULT_SERVICOS: ServicosContent = {
  bannerTitle: "Serviços & Produtos",
  bannerSubtitle: "Uma gama diversificada de produtos e serviços de qualidade.",
  bannerImage: "/Home_background.png",
  servicosHeading: "Serviços",
  servico1Titulo: "MONITORES",
  servico1Texto:
    "Dispositivo que monitora em tempo real todas as atividades. Na agricultura, também são chamados de GPS, são verdadeiros amigos do produtor quando se trata de produção no campo, principalmente se você quer começar a implementar a agricultura de precisão na sua propriedade.",
  servico1DesktopImg: "/monitor.png",
  servico1MobileImg: "/monitor_carousel.png",
  servico2Titulo: "ANTENAS GPS",
  servico2Texto: "São dispositivos que recebem sinais dos satélites GPS.",
  servico2DesktopImg: "/antena.png",
  servico2MobileImg: "/antena_carousel.png",
  servico3Titulo: "PILOTO AUTOMATICO",
  servico3Texto:
    "O piloto automático na agricultura de precisão permite a automação de veículos agrícolas, melhorando a precisão nas operações de plantio, colheita e pulverização.",
  servico3DesktopImg: "/piloto_automatico.png",
  servico3MobileImg: "/piloto_carousel.png",
  equipamentosHeading: "Equipamentos e inovações",
  equipamentosSubheading: "Com alta tecnologia, oferecemos o melhor do AGRO para você!",
  equip1Img: "/tablet.png",
  equip1Texto: "Desligamento linha à linha para todas plantadeiras sistema Isobus",
  equip2Img: "/repotenciamento.png",
  equip2Texto: "Repotenciamento de motores, especialista na linha agrícola.",
  equip3Img: "/plantio.png",
  equip3Texto: "Projeto de linhas de plantio para sistema linha a linha",
  produtosSectionTitle: "CONFIRA NOSSOS PRODUTOS",
  produtosSectionSubtitle: "Descubra o novo padrão de qualidade.",
};

export const DEFAULT_CONTATOS: ContatosContent = {
  bannerTitle: "Contatos",
  bannerImage: "/Home_background.png",
  introTitle: "Estamos sempre aqui para você.",
  introParagraph:
    "Seja para ouvir suas necessidades, responder às suas perguntas ou ajudá-lo a alcançar seus objetivos agrícolas, estamos apenas a um contato de distância.",
  testimonialsHeading: "O que os nossos clientes dizem sobre nós:",
  testimonial1: "A P3 Agro revolucionou a minha empresa com suas ferramentas de última geração!",
  testimonial2: "Inovação em veículos automotores é com a P3 Agro, muito satisfeito com o serviço.",
  testimonial3: "Me arrependo por não ter procurado a P3 Agro antes, equipamentos de alta qualidade!!",
  closingText:
    "Entre em contato conosco hoje mesmo para descobrir como podemos ajudá-lo a prosperar na agricultura.",
};

export const DEFAULT_TRABALHE_CONOSCO: TrabalheConoscoContent = {
  bannerTitle: "Trabalhe conosco",
  bannerSubtitle: "Vem construir o novo na p3 agro!",
  bannerImage: "/image 19.png",
  section1Title: "a p3 agro",
  section1Paragraph1:
    "Na P3Agro, enxergamos um futuro agrícola impulsionado pela inovação e sustentabilidade. Buscamos ser líderes na transformação da agricultura de precisão, proporcionando soluções tecnológicas avançadas que redefinem os padrões de eficiência e sustentabilidade.",
  section1Paragraph2:
    "Nossa missão vai além de simplesmente fornecer ferramentas e conhecimentos aos agricultores. Comprometemo-nos a capacitar os agricultores para alimentar o mundo de maneira sustentável, utilizando tecnologias avançadas.",
  section1Paragraph3:
    "Acreditamos que a aplicação correta da tecnologia pode não apenas revolucionar a agricultura, mas também contribuir para a construção de um futuro mais verde e equilibrado.",
  section2Title: "Porque escolher a p3 agro?",
  section2Intro:
    "Neste ambiente, você enfrentará diversos desafios em um cenário de aprendizado, colaboração, respeito e diversidade.",
  section2Image: "/escolherP3.png",
  section2SubTitle: "nosso objetivo e o jeito de ser",
  section2Paragraph1:
    "Atuar na P3 Agro é sobre capacitar os agricultores para alimentar o mundo de uma maneira que seja sustentável para o nosso planeta.",
  section2Paragraph2:
    "Acreditamos que a tecnologia certa pode transformar a agricultura e nos ajudar a construir um futuro mais verde. Com o objetivo de alcançar isso, incentivamos a aprendizagem e o autodesenvolvimento de nossos colaboradores, capacitando-os a serem protagonistas de suas trajetórias profissionais.",
  ctaTitle: "Candidate-se:",
};

export const DEFAULT_HEADER_FOOTER: HeaderFooterContent = {
  logoImage: "/Imagem1.png",
  contactEmail: "agriculturadeprecisao@p3agro.com.br",
  whatsappPhoneDigits: "5543996481850",
  whatsappPhoneDisplay: "(43) 99648-1850 / (43) 99150-1850",
  instagramUrl: "https://www.instagram.com/p3agro/",
  facebookUrl: "https://www.facebook.com/profile.php?id=100076567544982",
};

export const SITE_CONTENT_DEFAULTS: SiteContentByPage = {
  home: DEFAULT_HOME,
  quemSomos: DEFAULT_QUEM_SOMOS,
  servicos: DEFAULT_SERVICOS,
  contatos: DEFAULT_CONTATOS,
  trabalheConosco: DEFAULT_TRABALHE_CONOSCO,
  headerFooter: DEFAULT_HEADER_FOOTER,
};

export function getSiteContentDefaults<K extends SiteContentPageKey>(
  page: K
): SiteContentByPage[K] {
  return SITE_CONTENT_DEFAULTS[page];
}
