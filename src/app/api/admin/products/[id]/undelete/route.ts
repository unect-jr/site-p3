import { NextResponse } from "next/server";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { undeleteProduct } from "@/lib/productHistory";

export const runtime = "nodejs";

export async function POST(
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

    await undeleteProduct(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Erro ao restaurar produto da lixeira (${id}):`, error);
    return NextResponse.json({ error: "Erro ao restaurar produto" }, { status: 500 });
  }
}
