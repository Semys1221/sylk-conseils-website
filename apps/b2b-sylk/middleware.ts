import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Subdomain routing
  if (hostname.startsWith("reunion") || hostname.startsWith("reunion.")) {
    return NextResponse.rewrite(new URL("/reunion", request.url));
  }
  if (hostname.startsWith("planification") || hostname.startsWith("planification.")) {
    return NextResponse.rewrite(new URL("/funnel", request.url));
  }
  if (hostname.startsWith("app") || hostname.startsWith("app.")) {
    const url = new URL(request.url);
    const path = url.pathname === "/" ? "/application" : `/application${url.pathname}`;
    return NextResponse.rewrite(new URL(path, request.url));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*", "/", "/reunion", "/funnel", "/application", "/qualification"],
};
