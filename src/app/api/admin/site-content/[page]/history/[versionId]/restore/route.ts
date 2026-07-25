import { NextResponse } from "next/server";
import { isSiteContentPageKey } from "@/lib/siteContent";
import { getSiteContentHistorySnapshot, writeSiteContentUpdate } from "@/lib/siteContentHistory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ page: string; versionId: string }> }
) {
  const { page, versionId } = await params;
  if (!isSiteContentPageKey(page)) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 });
  }

  try {
    const snapshot = await getSiteContentHistorySnapshot(page, versionId);
    if (!snapshot) {
      return NextResponse.json({ error: "Versão não encontrada" }, { status: 404 });
    }

    await writeSiteContentUpdate(page, snapshot);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Erro ao restaurar versão do conteúdo do site (${page}):`, error);
    return NextResponse.json({ error: "Erro ao restaurar versão" }, { status: 500 });
  }
}
