import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

function requestOrigin(req: { nextUrl: URL; headers: Headers }) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "")
    .split(",")[0]
    ?.trim();
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) return `${proto}://${host}`;
  return req.nextUrl.origin;
}

function isPublicPath(pathname: string) {
  if (
    pathname === "/" ||
    pathname.startsWith("/sobre") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/cadastro") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/marketing")
  ) {
    return true;
  }
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (isPublicPath(pathname)) {
    if (req.auth && (pathname.startsWith("/login") || pathname.startsWith("/cadastro"))) {
      return NextResponse.redirect(new URL("/app", requestOrigin(req)));
    }
    return NextResponse.next();
  }
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", requestOrigin(req)));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
