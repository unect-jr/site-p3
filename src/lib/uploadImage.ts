import { randomUUID } from "crypto";
import { getStorageBucket } from "@/lib/firebase-admin";
import { extractStoragePathFromDownloadUrl } from "@/lib/storagePath";

// Faz upload de um arquivo pro Firebase Storage e retorna a URL de download
// pública no mesmo formato que o Console/SDK do Firebase produzem
// (https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media&token=...),
// compatível com o remotePatterns já configurado em next.config.ts.
export async function uploadImage(file: File, folder: string): Promise<string> {
  const bucket = getStorageBucket();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${folder}/${randomUUID()}.${ext}`;
  const token = randomUUID();

  const buffer = Buffer.from(await file.arrayBuffer());

  await bucket.file(storagePath).save(buffer, {
    contentType: file.type || "application/octet-stream",
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    storagePath
  )}?alt=media&token=${token}`;
}

// Remove (best-effort) a imagem antiga do Storage ao substituí-la ou ao excluir
// o registro que a referenciava. Não lança erro — uma falha aqui nunca deve
// impedir a escrita no Firestore que já aconteceu.
export async function deleteImageBestEffort(imageUrl: string | undefined | null) {
  if (!imageUrl) return;
  const path = extractStoragePathFromDownloadUrl(imageUrl);
  if (!path) return;
  try {
    await getStorageBucket().file(path).delete();
  } catch (error) {
    console.error("Falha ao remover imagem antiga do Storage (ignorado):", error);
  }
}

export const MAX_IMAGE_UPLOAD_SIZE = 4 * 1024 * 1024; // 4MB (limite de body do Vercel)
