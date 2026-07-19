import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { MAX_IMAGE_UPLOAD_SIZE, deleteImageBestEffort, uploadImage } from "@/lib/uploadImage";

export const runtime = "nodejs";

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
      if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
        return NextResponse.json(
          { error: "Imagem muito grande. Tamanho máximo: 4MB." },
          { status: 400 }
        );
      }
      updates.imagemURL = await uploadImage(file, "products");
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
