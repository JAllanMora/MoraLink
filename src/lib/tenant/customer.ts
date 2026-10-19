import "server-only";
import { createClient } from "@/lib/supabase/server";

// Tarjeta del visitante en este negocio. Lee la sesión: usar dentro de <Suspense>.
// Devuelve null si no ha iniciado sesión; card es null si aún no se une.
export async function getCurrentCard(tenantId: string) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return null;

  const { data: customer } = await supabase
    .from("customers")
    .select("id, code, name")
    .eq("tenant_id", tenantId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!customer) return { email: claims.claims.email as string | undefined, card: null };

  const { data: balance } = await supabase
    .from("customer_balances")
    .select("balance, lifetime_earned")
    .eq("customer_id", customer.id)
    .maybeSingle();

  return {
    email: claims.claims.email as string | undefined,
    card: { ...customer, balance: balance?.balance ?? 0, lifetimeEarned: balance?.lifetime_earned ?? 0 },
  };
}

export async function isTenantStaff(tenantId: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_tenant_member", { p_tenant_id: tenantId });
  return data === true;
}
