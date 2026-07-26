import { NextResponse } from "next/server";
import { purgeProduct } from "@/lib/productHistory";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await purgeProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao excluir produto permanentemente";
    const status = message.includes("não encontrado")
      ? 404
      : message.includes("lixeira")
        ? 400
        : 500;
    if (status === 500) {
      console.error(`Erro ao excluir produto permanentemente (${id}):`, error);
    }
    return NextResponse.json({ error: message }, { status });
  }
}
