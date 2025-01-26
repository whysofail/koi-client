import { auth } from "./auth";
import { NextResponse } from "next/server";
import doesRoleHaveAccessToURL from "./lib/doesRoleHaveAccessToURL";
import roleAccessMap from "./lib/roleAccessMap";

const BUFFER_TIME = 30;

type Role = keyof typeof roleAccessMap;

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const role = req.auth.user.role as Role;
  const haveAccess = doesRoleHaveAccessToURL(role, req.nextUrl.pathname);

  if (!haveAccess) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  const tokenExpiry = req.auth.user.accessTokenExpires;
  const currentTime = Math.floor(Date.now() / 1000);

  if (tokenExpiry && currentTime >= tokenExpiry - BUFFER_TIME) {
    return NextResponse.redirect(new URL("/session-expired", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - /login, /register, and /forbidden (auth and error pages)
     */
    "/((?!login|register|403|api|session-expired|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
