import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { resolveTheme } from "./theme";

export const tenantTag = (slug: string) => `tenant:${slug}`;

// Todo lo público de un negocio en una sola lectura cacheada: marca,
// programa, recompensas y menú. Se invalida con revalidateTag(tenantTag(slug)).
export async function getTenantSite(slug: string) {
  "use cache";
  cacheTag(tenantTag(slug));
  cacheLife("minutes");

  const db = createPublicClient();
  const { data: tenant } = await db
    .from("tenants")
    .select(
      "id, slug, name, tagline, logo_url, cover_url, theme, whatsapp, instagram, address, orders_enabled, delivery_enabled",
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (!tenant) return null;

  const [program, rewards, categories, products] = await Promise.all([
    db.from("loyalty_programs").select("*").eq("tenant_id", tenant.id).maybeSingle(),
    db.from("rewards").select("*").eq("tenant_id", tenant.id).eq("active", true).order("cost").order("position"),
    db.from("categories").select("*").eq("tenant_id", tenant.id).order("position"),
    db.from("products").select("*").eq("tenant_id", tenant.id).eq("available", true).order("position"),
  ]);

  const menu = (categories.data ?? [])
    .map((category) => ({
      ...category,
      products: (products.data ?? []).filter((p) => p.category_id === category.id),
    }))
    .filter((category) => category.products.length > 0);

  return {
    ...tenant,
    theme: resolveTheme(tenant.theme),
    program: program.data,
    rewards: rewards.data ?? [],
    menu,
  };
}

export type TenantSite = NonNullable<Awaited<ReturnType<typeof getTenantSite>>>;
