// middleware.ts (root)
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // exclude _next, image, favicon, **api**, and common assets
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/auth/:path*",
    "/dashboard/:path*",
  ],
};
