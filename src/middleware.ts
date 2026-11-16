import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "./lib/auth-config";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, nosnippet");
  return response;
}

export async function middleware(req: NextRequest) {
  const session = await verifyAdminToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (req.nextUrl.pathname === "/admin/login") {
    return noStore(session
      ? NextResponse.redirect(new URL("/admin", req.url))
      : NextResponse.next());
  }
  if (!session) return noStore(NextResponse.redirect(new URL("/admin/login", req.url)));
  return noStore(NextResponse.next());
}
export const config = { matcher: ["/admin/:path*"] };
