import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import doesRoleHaveAccessToURL from "./lib/doesRoleHaveAccessToURL";
import roleAccessMap from "./lib/roleAccessMap";

type Role = keyof typeof roleAccessMap;

export default withAuth((req) => {
  if (!req.nextauth.token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = req.nextauth.token.role as Role;
  const haveAccess = doesRoleHaveAccessToURL(role, req.nextUrl.pathname);

  if (!haveAccess) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
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
    "/((?!login|register|403|api/login|api/register|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
