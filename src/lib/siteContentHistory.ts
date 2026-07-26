import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { deleteImageBestEffort } from "@/lib/uploadImage";
import { SITE_CONTENT_FIELDS } from "@/lib/siteContentFields";
import type { SiteContentPageKey } from "@/lib/siteContent";

export const MAX_LIVE_HISTORY_ENTRIES = 9;

export interface SiteContentHistoryEntry {
  id: string;
  createdAt: string;
  changedFields: string[];
  snapshot: Record<string, string>;
}

function revalidatePublicPaths(page: SiteContentPageKey) {
  switch (page) {
    case "home":
      revalidatePath("/");
      break;
    case "quemSomos":
      revalidatePath("/quem-somos");
      break;
    case "servicos":
      revalidatePath("/servicos");
      revalidatePath("/api/site-content/servicos");
      break;
    case "contatos":
      revalidatePath("/contatos");
      break;
    case "trabalheConosco":
      revalidatePath("/trabalhe-conosco");
      break;
    case "headerFooter":
      revalidatePath("/", "layout");
      break;
  }
}

// Aplica uma atualização no conteúdo de uma página, arquivando o estado
// anterior em siteContent/{page}/history antes de sobrescrever o doc ao vivo.
// Usada tanto pelo salvar normal (PATCH) quanto pelo restaurar (que só passa
// um snapshot antigo como se fosse uma edição nova).
export async function writeSiteContentUpdate(
  page: SiteContentPageKey,
  updates: Record<string, string>
): Promise<void> {
  const docRef = getFirestoreAdmin().collection("siteContent").doc(page);
  const existingSnap = await docRef.get();
  const existingData = (existingSnap.data() ?? {}) as Record<string, string>;

  const changedFields = Object.keys(updates).filter(
    (key) => existingData[key] !== updates[key]
  );

  const shouldArchive = existingSnap.exists && changedFields.length > 0;

  if (shouldArchive) {
    await docRef.collection("history").add({
      snapshot: existingData,
      changedFields,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await docRef.set(updates, { merge: true });

  if (shouldArchive) {
    try {
      await pruneSiteContentHistory(page);
    } catch (error) {
      console.error(`Falha ao podar histórico de conteúdo (${page}), ignorado:`, error);
    }
  }

  revalidatePublicPaths(page);
}

// Mantém só as MAX_LIVE_HISTORY_ENTRIES entradas mais recentes por página,
// apagando do Storage as imagens de entradas removidas que não estão mais
// referenciadas em nenhuma versão mantida (nem no doc ao vivo).
async function pruneSiteContentHistory(page: SiteContentPageKey): Promise<void> {
  const docRef = getFirestoreAdmin().collection("siteContent").doc(page);
  const historyRef = docRef.collection("history");

  const snap = await historyRef.orderBy("createdAt", "desc").limit(MAX_LIVE_HISTORY_ENTRIES + 1).get();
  if (snap.size <= MAX_LIVE_HISTORY_ENTRIES) return;

  const kept = snap.docs.slice(0, MAX_LIVE_HISTORY_ENTRIES);
  const pruned = snap.docs.slice(MAX_LIVE_HISTORY_ENTRIES);

  const imageKeys = SITE_CONTENT_FIELDS[page]
    .filter((field) => field.type === "image")
    .map((field) => field.key);

  const liveDoc = ((await docRef.get()).data() ?? {}) as Record<string, string>;

  const stillInUse = new Set<string>();
  for (const key of imageKeys) {
    if (liveDoc[key]) stillInUse.add(liveDoc[key]);
  }
  for (const doc of kept) {
    const snapshot = (doc.data().snapshot ?? {}) as Record<string, string>;
    for (const key of imageKeys) {
      if (snapshot[key]) stillInUse.add(snapshot[key]);
    }
  }

  const toDelete = new Set<string>();
  for (const doc of pruned) {
    const snapshot = (doc.data().snapshot ?? {}) as Record<string, string>;
    for (const key of imageKeys) {
      const value = snapshot[key];
      if (value && !stillInUse.has(value)) {
        toDelete.add(value);
      }
    }
  }

  for (const url of toDelete) {
    await deleteImageBestEffort(url);
  }

  for (const doc of pruned) {
    await doc.ref.delete();
  }
}

export async function listSiteContentHistory(
  page: SiteContentPageKey
): Promise<SiteContentHistoryEntry[]> {
  const snap = await getFirestoreAdmin()
    .collection("siteContent")
    .doc(page)
    .collection("history")
    .orderBy("createdAt", "desc")
    .limit(MAX_LIVE_HISTORY_ENTRIES)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate?.() as Date | undefined;
    return {
      id: doc.id,
      createdAt: (createdAt ?? new Date()).toISOString(),
      changedFields: (data.changedFields ?? []) as string[],
      snapshot: (data.snapshot ?? {}) as Record<string, string>,
    };
  });
}

export async function getSiteContentHistorySnapshot(
  page: SiteContentPageKey,
  versionId: string
): Promise<Record<string, string> | null> {
  const doc = await getFirestoreAdmin()
    .collection("siteContent")
    .doc(page)
    .collection("history")
    .doc(versionId)
    .get();

  if (!doc.exists) return null;
  return (doc.data()?.snapshot ?? {}) as Record<string, string>;
}
