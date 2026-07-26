import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllProductsForAdmin, getDeletedProductsForAdmin } from "@/lib/getProdutos";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { MAX_IMAGE_UPLOAD_SIZE, uploadImage } from "@/lib/uploadImage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const trash = new URL(req.url).searchParams.get("trash") === "1";
    const products = trash ? await getDeletedProductsForAdmin() : await getAllProductsForAdmin();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos (admin):", error);
    return NextResponse.json({ error: "Erro ao listar produtos" }, { status: 500 });
  }
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

    if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "Imagem muito grande. Tamanho máximo: 4MB." },
        { status: 400 }
      );
    }

    const imagemURL = await uploadImage(file, "products");

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
