import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];

const REDIRECT_URL = "/";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = REDIRECT_URL;
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  if (!token) {
    return NextResponse.redirect(redirectUrl);
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
