import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // ✅ Allow login/signup always
  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next();
  }

  // ✅ Protect only dashboard & orders
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*"],
};