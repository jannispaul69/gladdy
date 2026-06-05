import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get("gladdy_admin")?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
