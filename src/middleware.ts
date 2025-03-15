import { auth } from "./auth";
import { NextResponse } from "next/server";
import doesRoleHaveAccessToURL from "./lib/doesRoleHaveAccessToURL";
import roleAccessMap from "./lib/roleAccessMap";

const BUFFER_TIME = 30;
type Role = keyof typeof roleAccessMap;

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow all non-dashboard routes
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // If not authenticated, redirect to login with the current URL as callbackUrl
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);

    // Add the current URL as a callbackUrl parameter
    // Include query parameters if they exist
    const returnTo = pathname + (req.nextUrl.search || "");
    loginUrl.searchParams.set("callbackUrl", returnTo);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  const role = req.auth.user.role as Role;

  // Ensure role exists in roleAccessMap
  if (!(role in roleAccessMap))
    return NextResponse.redirect(new URL("/403", req.url));

  const haveAccess = doesRoleHaveAccessToURL(role, pathname);

  if (!haveAccess) return NextResponse.redirect(new URL("/403", req.url));

  const tokenExpiry = req.auth.user.accessTokenExpires;
  const currentTime = Math.floor(Date.now() / 1000);

  if (tokenExpiry && currentTime >= tokenExpiry - BUFFER_TIME) {
    // For session expiry, we can also preserve where the user was trying to go
    const sessionExpiredUrl = new URL("/session-expired", req.url);
    sessionExpiredUrl.searchParams.set(
      "returnTo",
      pathname + (req.nextUrl.search || ""),
    );
    return NextResponse.redirect(sessionExpiredUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
