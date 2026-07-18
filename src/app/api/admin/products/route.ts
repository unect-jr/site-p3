import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getAllProductsForAdmin } from "@/lib/getProdutos";
import { getFirestoreAdmin, getStorageBucket } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProductsForAdmin();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos (admin):", error);
    return NextResponse.json({ error: "Erro ao listar produtos" }, { status: 500 });
  }
}

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

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const nome = form.get("nome")?.toString().trim() ?? "";
    const precoRaw = form.get("preco")?.toString() ?? "";
    const ativo = form.get("ativo")?.toString() === "true";
    const file = form.get("imagem") as File | null;

    const preco = Number(precoRaw);

    if (!nome || !Number.isFinite(preco) || !file || file.size === 0) {
      return NextResponse.json(
        { error: "Nome, preço e imagem são obrigatórios" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 4 * 1024 * 1024; // 4MB (limite de body do Vercel)
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Imagem muito grande. Tamanho máximo: 4MB." },
        { status: 400 }
      );
    }

    const imagemURL = await uploadProductImage(file);

    const docRef = await getFirestoreAdmin().collection("products").add({
      nome,
      preco,
      imagemURL,
      ativo,
    });

    revalidatePath("/api/products");
    revalidatePath("/servicos");

    return NextResponse.json({ id: docRef.id, nome, preco, imagemURL, ativo });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
