import { auth } from "./auth";
import { NextResponse } from "next/server";
import doesRoleHaveAccessToURL from "./lib/doesRoleHaveAccessToURL";
import roleAccessMap from "./lib/roleAccessMap";

const BUFFER_TIME = 30;

type Role = keyof typeof roleAccessMap;

export default auth((req) => {
  const isPublicRoute = doesRoleHaveAccessToURL(
    "non-user",
    req.nextUrl.pathname,
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

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
    // exclude all nextjs internal routes
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
