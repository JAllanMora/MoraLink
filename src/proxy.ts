import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withSession } from "@/lib/supabase/proxy";
import { tenantSlugFromHost } from "@/lib/tenant/host";

// <slug>.moralink.app/menu  ->  /s/<slug>/menu
// moralink.app/...          ->  sitio de MoraLink (landing)
export async function proxy(request: NextRequest) {
  const slug = tenantSlugFromHost(request.headers.get("host"));
  const { pathname } = request.nextUrl;

  if (!slug) {
    // Las rutas internas de los negocios solo se sirven por su subdominio
    if (pathname === "/s" || pathname.startsWith("/s/")) {
      return new NextResponse(null, { status: 404 });
    }
    return withSession(request);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/s/${slug}${pathname === "/" ? "" : pathname}`;
  return withSession(request, url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
