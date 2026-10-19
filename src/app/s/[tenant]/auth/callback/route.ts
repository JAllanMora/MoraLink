import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTenantSite } from "@/lib/tenant/queries";

// Destino del enlace de acceso que llega por correo. Abre la sesión y,
// si es la primera vez, crea la tarjeta del cliente en este negocio.
export async function GET(request: NextRequest, { params }: RouteContext<"/s/[tenant]/auth/callback">) {
  const { tenant } = await params;
  const code = request.nextUrl.searchParams.get("code");
  const next = safePath(request.nextUrl.searchParams.get("next"));
  const origin = publicOrigin(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const site = await getTenantSite(tenant);
    if (!error && site) {
      // Ignora el duplicado si ya tenía tarjeta
      await supabase.from("customers").insert({ tenant_id: site.id });
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}

function safePath(path: string | null) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

function publicOrigin(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return `${proto}://${host}`;
}
