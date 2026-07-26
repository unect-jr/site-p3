import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { deleteImageBestEffort } from "@/lib/uploadImage";
import { MAX_LIVE_HISTORY_ENTRIES } from "@/lib/siteContentHistory";

export { MAX_LIVE_HISTORY_ENTRIES };

export interface ProductContentFields {
  nome: string;
  preco: number;
  imagemURL: string;
  ativo: boolean;
}

const CONTENT_FIELD_KEYS = ["nome", "preco", "imagemURL", "ativo"] as const;

export interface ProductHistoryEntry {
  id: string;
  createdAt: string;
  changedFields: string[];
  snapshot: Partial<ProductContentFields>;
}

function revalidateProductPaths() {
  revalidatePath("/api/products");
  revalidatePath("/servicos");
}

function pickContentFields(data: Record<string, unknown>): Partial<ProductContentFields> {
  const picked: Partial<ProductContentFields> = {};
  for (const key of CONTENT_FIELD_KEYS) {
    if (data[key] !== undefined) {
      (picked as Record<string, unknown>)[key] = data[key];
    }
  }
  return picked;
}

// Aplica uma atualização de conteúdo num produto, arquivando o estado
// anterior em products/{id}/history antes de sobrescrever o doc ao vivo.
// Nunca lê nem escreve `deletedAt` — histórico de conteúdo e lixeira são
// eixos independentes, pra restaurar uma versão antiga nunca tirar (ou
// colocar) um produto da lixeira sem querer.
export async function writeProductUpdate(
  id: string,
  updates: Partial<ProductContentFields>
): Promise<void> {
  const docRef = getFirestoreAdmin().collection("products").doc(id);
  const existingSnap = await docRef.get();
  const existingData = pickContentFields(existingSnap.data() ?? {});

  const changedFields = Object.keys(updates).filter(
    (key) => existingData[key as keyof ProductContentFields] !== updates[key as keyof ProductContentFields]
  );

  const shouldArchive = existingSnap.exists && changedFields.length > 0;

  if (shouldArchive) {
    await docRef.collection("history").add({
      snapshot: existingData,
      changedFields,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await docRef.update(updates);

  if (shouldArchive) {
    try {
      await pruneProductHistory(id);
    } catch (error) {
      console.error(`Falha ao podar histórico do produto (${id}), ignorado:`, error);
    }
  }

  revalidateProductPaths();
}

async function pruneProductHistory(id: string): Promise<void> {
  const docRef = getFirestoreAdmin().collection("products").doc(id);
  const historyRef = docRef.collection("history");

  const snap = await historyRef.orderBy("createdAt", "desc").limit(MAX_LIVE_HISTORY_ENTRIES + 1).get();
  if (snap.size <= MAX_LIVE_HISTORY_ENTRIES) return;

  const kept = snap.docs.slice(0, MAX_LIVE_HISTORY_ENTRIES);
  const pruned = snap.docs.slice(MAX_LIVE_HISTORY_ENTRIES);

  const liveDoc = pickContentFields((await docRef.get()).data() ?? {});

  const stillInUse = new Set<string>();
  if (liveDoc.imagemURL) stillInUse.add(liveDoc.imagemURL);
  for (const doc of kept) {
    const snapshot = (doc.data().snapshot ?? {}) as Partial<ProductContentFields>;
    if (snapshot.imagemURL) stillInUse.add(snapshot.imagemURL);
  }

  const toDelete = new Set<string>();
  for (const doc of pruned) {
    const snapshot = (doc.data().snapshot ?? {}) as Partial<ProductContentFields>;
    if (snapshot.imagemURL && !stillInUse.has(snapshot.imagemURL)) {
      toDelete.add(snapshot.imagemURL);
    }
  }

  for (const url of toDelete) {
    await deleteImageBestEffort(url);
  }

  for (const doc of pruned) {
    await doc.ref.delete();
  }
}

export async function listProductHistory(id: string): Promise<ProductHistoryEntry[]> {
  const snap = await getFirestoreAdmin()
    .collection("products")
    .doc(id)
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
      snapshot: (data.snapshot ?? {}) as Partial<ProductContentFields>,
    };
  });
}

export async function getProductHistorySnapshot(
  id: string,
  versionId: string
): Promise<Partial<ProductContentFields> | null> {
  const doc = await getFirestoreAdmin()
    .collection("products")
    .doc(id)
    .collection("history")
    .doc(versionId)
    .get();

  if (!doc.exists) return null;
  return (doc.data()?.snapshot ?? {}) as Partial<ProductContentFields>;
}

// --- Lixeira (eixo de existência, independente do histórico de conteúdo) ---

export async function softDeleteProduct(id: string): Promise<void> {
  const docRef = getFirestoreAdmin().collection("products").doc(id);
  await docRef.update({ deletedAt: FieldValue.serverTimestamp() });
  revalidateProductPaths();
}

export async function undeleteProduct(id: string): Promise<void> {
  const docRef = getFirestoreAdmin().collection("products").doc(id);
  await docRef.update({ deletedAt: null });
  revalidateProductPaths();
}

// Exclusão definitiva: só permitida se o produto já estiver na lixeira.
// Apaga do Storage toda imagem distinta referenciada pelo doc ao vivo e por
// todo o histórico (nada mais vai referenciá-las depois disso), depois
// apaga o histórico e o próprio documento.
export async function purgeProduct(id: string): Promise<void> {
  const docRef = getFirestoreAdmin().collection("products").doc(id);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error("Produto não encontrado");
  }
  if (!snap.data()?.deletedAt) {
    throw new Error("Produto precisa estar na lixeira antes de ser excluído permanentemente");
  }

  const historySnap = await docRef.collection("history").get();

  const imageUrls = new Set<string>();
  const liveImagemURL = snap.data()?.imagemURL as string | undefined;
  if (liveImagemURL) imageUrls.add(liveImagemURL);
  for (const doc of historySnap.docs) {
    const snapshot = (doc.data().snapshot ?? {}) as Partial<ProductContentFields>;
    if (snapshot.imagemURL) imageUrls.add(snapshot.imagemURL);
  }

  for (const url of imageUrls) {
    await deleteImageBestEffort(url);
  }

  for (const doc of historySnap.docs) {
    await doc.ref.delete();
  }

  await docRef.delete();

  revalidateProductPaths();
}
