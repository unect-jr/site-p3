import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getFirestoreAdmin, getStorageBucket } from "@/lib/firebase-admin";
import { extractStoragePathFromDownloadUrl } from "@/lib/storagePath";

export const runtime = "nodejs";

async function uploadProductImage(file: File): Promise<string> {
  const bucket = getStorageBucket();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `products/${randomUUID()}.${ext}`;
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

async function deleteImageBestEffort(imagemURL: string | undefined) {
  if (!imagemURL) return;
  const path = extractStoragePathFromDownloadUrl(imagemURL);
  if (!path) return;
  try {
    await getStorageBucket().file(path).delete();
  } catch (error) {
    console.error("Falha ao remover imagem antiga do Storage (ignorado):", error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const form = await req.formData();
    const docRef = getFirestoreAdmin().collection("products").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    const nome = form.get("nome")?.toString().trim();
    if (nome) updates.nome = nome;

    const precoRaw = form.get("preco")?.toString();
    if (precoRaw !== undefined) {
      const preco = Number(precoRaw);
      if (!Number.isFinite(preco)) {
        return NextResponse.json({ error: "Preço inválido" }, { status: 400 });
      }
      updates.preco = preco;
    }

    const ativoRaw = form.get("ativo")?.toString();
    if (ativoRaw !== undefined) {
      updates.ativo = ativoRaw === "true";
    }

    const file = form.get("imagem") as File | null;
    if (file && file.size > 0) {
      const MAX_SIZE = 4 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Imagem muito grande. Tamanho máximo: 4MB." },
          { status: 400 }
        );
      }
      updates.imagemURL = await uploadProductImage(file);
      await deleteImageBestEffort(existing.data()?.imagemURL);
    }

    await docRef.update(updates);

    revalidatePath("/api/products");
    revalidatePath("/servicos");

    return NextResponse.json({ id, ...existing.data(), ...updates });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const docRef = getFirestoreAdmin().collection("products").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    await docRef.delete();
    await deleteImageBestEffort(existing.data()?.imagemURL);

    revalidatePath("/api/products");
    revalidatePath("/servicos");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 });
  }
}
