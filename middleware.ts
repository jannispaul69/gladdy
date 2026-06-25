import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Launch: Sunday June 28, 2026 at 18:00 CEST (UTC+2)
const LAUNCH_TIME = new Date("2026-06-28T18:00:00+02:00").getTime();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: require session token
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get("gladdy_admin")?.value;
    const expected = process.env.ADMIN_SESSION_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Coming-soon page and API routes always pass through
  if (pathname.startsWith("/coming-soon") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Before launch → show coming soon (URL stays clean via rewrite)
  if (Date.now() < LAUNCH_TIME) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\..*).*)"],
};
