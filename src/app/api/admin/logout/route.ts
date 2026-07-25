import { NextResponse } from "next/server";
import { buildClearSessionCookie } from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildClearSessionCookie());
  return response;
}
