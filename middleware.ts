// middleware.ts (root)
import { type NextRequest } from "next/server";
import { updateSession } from "./lib/middleware";

// Runs on the Edge Runtime
export async function middleware(request: NextRequest) {
  // Delegate to our lib helper (handles Supabase cookies + redirects)
  return updateSession(request);
}

// Adjust matchers as needed. This skips Next.js internals and static assets,
// but applies middleware to your auth and dashboard routes as well.
export const config = {
  matcher: [
    // Match everything except Next static/image assets, favicon, and common images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Explicitly include these sections
    "/auth/:path*",
    "/dashboard/:path*",
  ],
};
