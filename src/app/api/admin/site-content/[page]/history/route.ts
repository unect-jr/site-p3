import { NextResponse } from "next/server";
import { isSiteContentPageKey } from "@/lib/siteContent";
import { listSiteContentHistory } from "@/lib/siteContentHistory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  if (!isSiteContentPageKey(page)) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 });
  }

  const entries = await listSiteContentHistory(page);
  return NextResponse.json(entries);
}
