import { NextResponse } from "next/server";
import crypto from "crypto";
import { buildSessionCookie, signSession } from "@/lib/adminSession";

export const runtime = "nodejs";

function passwordsMatch(input: string, expected: string) {
  const inputBuf = Buffer.from(input);
  const expectedBuf = Buffer.from(expected);
  if (inputBuf.length !== expectedBuf.length) {
    // Ainda faz uma comparação de tamanho fixo para não vazar o tamanho da senha via timing.
    crypto.timingSafeEqual(inputBuf, inputBuf);
    return false;
  }
  return crypto.timingSafeEqual(inputBuf, expectedBuf);
}

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD não configurada");
    return NextResponse.json({ error: "Painel admin não configurado" }, { status: 500 });
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  if (typeof password !== "string" || !passwordsMatch(password, adminPassword)) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const session = await signSession();
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildSessionCookie(session));
  return response;
}
