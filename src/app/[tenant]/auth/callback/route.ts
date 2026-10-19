import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTenantSite } from "@/lib/tenant/queries";

// Destino del enlace de acceso que llega por correo. Abre la sesión y,
// si es la primera vez, crea la tarjeta del cliente en este negocio.
export async function GET(request: NextRequest, { params }: RouteContext<"/[tenant]/auth/callback">) {
  const { tenant } = await params;
  const code = request.nextUrl.searchParams.get("code");
  const next = safePath(request.nextUrl.searchParams.get("next"), `/${tenant}`);
  const origin = request.nextUrl.origin;

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

  return NextResponse.redirect(`${origin}/${tenant}/entrar?error=enlace`);
}

function safePath(path: string | null, fallback: string) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

