import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySession } from "@/lib/adminSession";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicAdminRoute =
    pathname === "/admin/login" || pathname === "/api/admin/login";

  if (isPublicAdminRoute) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifySession(sessionCookie);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}
