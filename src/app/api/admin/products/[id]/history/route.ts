import { NextResponse } from "next/server";
import { listProductHistory } from "@/lib/productHistory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entries = await listProductHistory(id);
  return NextResponse.json(entries);
}
