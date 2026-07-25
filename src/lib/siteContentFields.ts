import type { SiteContentPageKey } from "@/lib/siteContent";

export type SiteContentFieldType = "text" | "textarea" | "image";

export interface SiteContentFieldDescriptor {
  key: string;
  label: string;
  type: SiteContentFieldType;
  group?: string;
}

export const SITE_CONTENT_PAGE_LABELS: Record<SiteContentPageKey, string> = {
  home: "Página Inicial",
  quemSomos: "Quem Somos",
  servicos: "Serviços & Produtos",
  contatos: "Contatos",
  trabalheConosco: "Trabalhe Conosco",
  headerFooter: "Cabeçalho e Rodapé",
};

export const SITE_CONTENT_FIELDS: Record<SiteContentPageKey, SiteContentFieldDescriptor[]> = {
  home: [
    { key: "bannerTitle", label: "Título do banner", type: "text", group: "Banner" },
    { key: "bannerSubtitle", label: "Subtítulo do banner", type: "textarea", group: "Banner" },
    { key: "bannerImage", label: "Imagem de fundo do banner", type: "image", group: "Banner" },
  ],
  quemSomos: [
    { key: "bannerTitle", label: "Título do banner", type: "text", group: "Banner" },
    { key: "bannerImage", label: "Imagem de fundo do banner", type: "image", group: "Banner" },
    { key: "subtitle1", label: "Primeiro parágrafo", type: "textarea", group: "Texto" },
    { key: "subtitle2", label: "Segundo parágrafo", type: "textarea", group: "Texto" },
  ],
  servicos: [
    { key: "bannerTitle", label: "Título do banner", type: "text", group: "Banner" },
    { key: "bannerSubtitle", label: "Subtítulo do banner", type: "textarea", group: "Banner" },
    { key: "bannerImage", label: "Imagem de fundo do banner", type: "image", group: "Banner" },
    { key: "servicosHeading", label: "Título da seção", type: "text", group: "Seção Serviços" },
    { key: "servico1Titulo", label: "Título", type: "text", group: "Card 1: Monitores" },
    { key: "servico1Texto", label: "Texto", type: "textarea", group: "Card 1: Monitores" },
    { key: "servico1DesktopImg", label: "Imagem (desktop)", type: "image", group: "Card 1: Monitores" },
    { key: "servico1MobileImg", label: "Imagem (celular)", type: "image", group: "Card 1: Monitores" },
    { key: "servico2Titulo", label: "Título", type: "text", group: "Card 2: Antenas GPS" },
    { key: "servico2Texto", label: "Texto", type: "textarea", group: "Card 2: Antenas GPS" },
    { key: "servico2DesktopImg", label: "Imagem (desktop)", type: "image", group: "Card 2: Antenas GPS" },
    { key: "servico2MobileImg", label: "Imagem (celular)", type: "image", group: "Card 2: Antenas GPS" },
    { key: "servico3Titulo", label: "Título", type: "text", group: "Card 3: Piloto Automático" },
    { key: "servico3Texto", label: "Texto", type: "textarea", group: "Card 3: Piloto Automático" },
    { key: "servico3DesktopImg", label: "Imagem (desktop)", type: "image", group: "Card 3: Piloto Automático" },
    { key: "servico3MobileImg", label: "Imagem (celular)", type: "image", group: "Card 3: Piloto Automático" },
    { key: "equipamentosHeading", label: "Título da seção", type: "text", group: "Seção Equipamentos" },
    { key: "equipamentosSubheading", label: "Subtítulo da seção", type: "text", group: "Seção Equipamentos" },
    { key: "equip1Img", label: "Imagem", type: "image", group: "Equipamento 1" },
    { key: "equip1Texto", label: "Texto", type: "textarea", group: "Equipamento 1" },
    { key: "equip2Img", label: "Imagem", type: "image", group: "Equipamento 2" },
    { key: "equip2Texto", label: "Texto", type: "textarea", group: "Equipamento 2" },
    { key: "equip3Img", label: "Imagem", type: "image", group: "Equipamento 3" },
    { key: "equip3Texto", label: "Texto", type: "textarea", group: "Equipamento 3" },
    { key: "produtosSectionTitle", label: "Título da seção", type: "text", group: "Seção Produtos" },
    { key: "produtosSectionSubtitle", label: "Subtítulo da seção", type: "text", group: "Seção Produtos" },
  ],
  contatos: [
    { key: "bannerTitle", label: "Título do banner", type: "text", group: "Banner" },
    { key: "bannerImage", label: "Imagem de fundo do banner", type: "image", group: "Banner" },
    { key: "introTitle", label: "Título de introdução", type: "text", group: "Introdução" },
    { key: "introParagraph", label: "Texto de introdução", type: "textarea", group: "Introdução" },
    { key: "testimonialsHeading", label: "Título da seção de depoimentos", type: "text", group: "Depoimentos" },
    { key: "testimonial1", label: "Depoimento 1", type: "textarea", group: "Depoimentos" },
    { key: "testimonial2", label: "Depoimento 2", type: "textarea", group: "Depoimentos" },
    { key: "testimonial3", label: "Depoimento 3", type: "textarea", group: "Depoimentos" },
    { key: "closingText", label: "Texto final", type: "textarea", group: "Encerramento" },
  ],
  trabalheConosco: [
    { key: "bannerTitle", label: "Título do banner", type: "text", group: "Banner" },
    { key: "bannerSubtitle", label: "Subtítulo do banner", type: "text", group: "Banner" },
    { key: "bannerImage", label: "Imagem de fundo do banner", type: "image", group: "Banner" },
    { key: "section1Title", label: "Título", type: "text", group: "Seção 1: A P3 Agro" },
    { key: "section1Paragraph1", label: "Parágrafo 1", type: "textarea", group: "Seção 1: A P3 Agro" },
    { key: "section1Paragraph2", label: "Parágrafo 2", type: "textarea", group: "Seção 1: A P3 Agro" },
    { key: "section1Paragraph3", label: "Parágrafo 3", type: "textarea", group: "Seção 1: A P3 Agro" },
    { key: "section2Title", label: "Título", type: "text", group: "Seção 2: Por que escolher" },
    { key: "section2Intro", label: "Texto de introdução", type: "textarea", group: "Seção 2: Por que escolher" },
    { key: "section2Image", label: "Imagem", type: "image", group: "Seção 2: Por que escolher" },
    { key: "section2SubTitle", label: "Subtítulo", type: "text", group: "Seção 2: Por que escolher" },
    { key: "section2Paragraph1", label: "Parágrafo 1", type: "textarea", group: "Seção 2: Por que escolher" },
    { key: "section2Paragraph2", label: "Parágrafo 2", type: "textarea", group: "Seção 2: Por que escolher" },
    { key: "ctaTitle", label: "Título acima do formulário", type: "text", group: "Chamada final" },
  ],
  headerFooter: [
    { key: "logoImage", label: "Logo do cabeçalho", type: "image", group: "Cabeçalho" },
    { key: "contactEmail", label: "E-mail de contato", type: "text", group: "Rodapé" },
    { key: "whatsappPhoneDigits", label: "Número do WhatsApp (só números, com DDI 55)", type: "text", group: "Rodapé" },
    { key: "whatsappPhoneDisplay", label: "Número do WhatsApp (texto exibido)", type: "text", group: "Rodapé" },
    { key: "instagramUrl", label: "Link do Instagram", type: "text", group: "Rodapé" },
    { key: "facebookUrl", label: "Link do Facebook", type: "text", group: "Rodapé" },
  ],
};
