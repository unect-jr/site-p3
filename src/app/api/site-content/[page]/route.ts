import { NextResponse } from "next/server";
import { getSiteContent, isSiteContentPageKey } from "@/lib/siteContent";

export const revalidate = 3600; // Revalida a cada 1 hora (mais rápido via revalidatePath nas escritas do admin)

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  if (!isSiteContentPageKey(page)) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 });
  }

  const content = await getSiteContent(page);
  return NextResponse.json(content);
}
