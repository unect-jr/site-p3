import { getFirestoreAdmin } from "@/lib/firebase-admin";
import {
  SITE_CONTENT_DEFAULTS,
  type SiteContentByPage,
  type SiteContentPageKey,
} from "@/lib/siteContentDefaults";

export * from "@/lib/siteContentDefaults";

// Busca o conteúdo de uma página, mesclando o que estiver salvo no Firestore
// sobre os valores padrão (o texto/imagem atual do site). Nunca lança erro —
// se o Firestore estiver indisponível ou o documento não existir ainda, o
// site continua renderizando os valores padrão normalmente.
export async function getSiteContent<K extends SiteContentPageKey>(
  page: K
): Promise<SiteContentByPage[K]> {
  const defaults = SITE_CONTENT_DEFAULTS[page];

  try {
    const snap = await getFirestoreAdmin().collection("siteContent").doc(page).get();
    if (!snap.exists) return defaults;
    return { ...defaults, ...snap.data() } as SiteContentByPage[K];
  } catch (error) {
    console.error(`Erro ao buscar conteúdo do site (${page}), usando padrão:`, error);
    return defaults;
  }
}
