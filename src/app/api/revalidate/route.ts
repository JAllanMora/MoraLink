import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { tenantTag } from "@/lib/tenant/queries";

// Refresca la marca/menú/recompensas de un negocio tras cargar cambios.
// POST /api/revalidate  { "slug": "la-dolce-vita" }  con Authorization: Bearer <REVALIDATE_SECRET>
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { slug } = await request.json();
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "Falta slug" }, { status: 400 });
  }
  revalidateTag(tenantTag(slug), "max");
  return NextResponse.json({ revalidated: slug });
}
