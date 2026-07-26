import { NextResponse } from "next/server";
import { getProductHistorySnapshot, writeProductUpdate } from "@/lib/productHistory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  const { id, versionId } = await params;

  try {
    const snapshot = await getProductHistorySnapshot(id, versionId);
    if (!snapshot) {
      return NextResponse.json({ error: "Versão não encontrada" }, { status: 404 });
    }

    await writeProductUpdate(id, snapshot);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Erro ao restaurar versão do produto (${id}):`, error);
    return NextResponse.json({ error: "Erro ao restaurar versão" }, { status: 500 });
  }
}
