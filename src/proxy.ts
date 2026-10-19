import type { NextRequest } from "next/server";
import { withSession } from "@/lib/supabase/proxy";

// Cada negocio vive en moralink.app/<slug> (src/app/[tenant]).
// El proxy solo mantiene viva la sesión de Supabase.
export async function proxy(request: NextRequest) {
  return withSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
