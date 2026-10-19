"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { requestOrigin } from "@/lib/origin";
import { createClient } from "@/lib/supabase/server";
import { getTenantSite } from "@/lib/tenant/queries";

export type FormState = { ok: boolean; message: string } | null;

async function requireTenant(slug: string) {
  const site = await getTenantSite(slug);
  if (!site) throw new Error("Negocio no encontrado");
  return site;
}

export async function requestLogin(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireTenant(slug);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Escribe un correo válido." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await requestOrigin()}/${slug}/auth/callback?next=/${slug}/mi-tarjeta` },
  });
  if (error) return { ok: false, message: "No pudimos enviar el correo. Intenta de nuevo en un momento." };
  return { ok: true, message: `Te enviamos un enlace a ${email}. Ábrelo desde este mismo teléfono.` };
}

export async function signOut(slug: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${slug}`);
}

// Crea la tarjeta del cliente en este negocio si aún no la tiene
export async function joinProgram(slug: string) {
  const site = await requireTenant(slug);
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) redirect(`/${slug}/entrar`);

  const { error } = await supabase.from("customers").insert({ tenant_id: site.id });
  if (error && error.code !== "23505") throw new Error("No pudimos crear tu tarjeta");
  redirect(`/${slug}/mi-tarjeta`);
}

const RPC_ERRORS: Record<string, string> = {
  "42501": "Tu cuenta no tiene permiso de caja en este negocio.",
  P0002: "No encontramos ese código o recompensa.",
  "22023": "El cliente no tiene saldo suficiente.",
};

export async function addLoyalty(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const site = await requireTenant(slug);
  const code = String(formData.get("code") ?? "");
  const amount = Number(formData.get("amount") ?? 1);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_loyalty", {
    p_tenant_id: site.id,
    p_customer_code: code,
    p_amount: amount,
  });
  if (error) return { ok: false, message: RPC_ERRORS[error.code] ?? "No se pudo registrar." };
  refresh();
  return { ok: true, message: `Listo. ${code.toUpperCase()} ahora tiene ${data}.` };
}

export async function redeemReward(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const site = await requireTenant(slug);
  const code = String(formData.get("code") ?? "");
  const rewardId = String(formData.get("reward") ?? "");
  const reward = site.rewards.find((r) => r.id === rewardId);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("redeem_reward", {
    p_tenant_id: site.id,
    p_customer_code: code,
    p_reward_id: rewardId,
  });
  if (error) return { ok: false, message: RPC_ERRORS[error.code] ?? "No se pudo canjear." };
  refresh();
  return { ok: true, message: `Canjeado: ${reward?.name}. Saldo restante: ${data}.` };
}
