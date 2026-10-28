import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token    = request.cookies.get("qarta_token")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
