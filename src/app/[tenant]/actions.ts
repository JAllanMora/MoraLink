"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { requestOrigin } from "@/lib/origin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, pluralize } from "@/lib/format";
import { isOrderStatus } from "@/lib/tenant/orders";
import { getTenantSite } from "@/lib/tenant/queries";

export type FormState = { ok: boolean; message: string } | null;

async function requireTenant(slug: string) {
  const site = await getTenantSite(slug);
  if (!site) throw new Error("Negocio no encontrado");
  return site;
}

export async function requestLogin(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireTenant(slug);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
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
  let amount = Number(formData.get("amount") ?? 1);
  let note: string | undefined;

  // Sellos por monto: 1 sello por cada spend_per_stamp de compra
  const spendPerStamp = site.program?.type === "stamps" ? site.program.spend_per_stamp : null;
  if (spendPerStamp) {
    const purchase = Number(formData.get("purchase") ?? 0);
    amount = Math.floor(purchase / spendPerStamp);
    if (!(amount > 0)) {
      return {
        ok: false,
        message: `La compra no alcanza para un sello (es 1 por cada ${formatPrice(spendPerStamp)}).`,
      };
    }
    note = `Compra de ${formatPrice(purchase)}`;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_loyalty", {
    p_tenant_id: site.id,
    p_customer_code: code,
    p_amount: amount,
    p_note: note,
  });
  if (error) return { ok: false, message: RPC_ERRORS[error.code] ?? "No se pudo registrar." };
  refresh();
  const added = spendPerStamp ? `Se ${amount === 1 ? "sumó 1 sello" : `sumaron ${amount} sellos`}. ` : "";
  const [one, many] = site.program?.type === "points" ? ["punto", "puntos"] : ["sello", "sellos"];
  return { ok: true, message: `Listo. ${added}${code.toUpperCase()} ahora tiene ${pluralize(data, one, many)}.` };
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

export type OrderState = { ok: false; message: string } | { ok: true; token: string } | null;

const ORDER_ERRORS: Record<string, string> = {
  P0002: "Este negocio no está recibiendo pedidos en línea por ahora.",
  "23514": "Revisa tu nombre y tu teléfono.",
};

export async function placeOrder(slug: string, _prev: OrderState, formData: FormData): Promise<OrderState> {
  const site = await requireTenant(slug);
  let items: { product_id: string; quantity: number }[];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }
  if (!Array.isArray(items) || items.length === 0) return { ok: false, message: "Tu pedido está vacío." };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name) return { ok: false, message: "Escribe tu nombre." };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, message: "Escribe tu teléfono a 10 dígitos." };
  const delivery = site.delivery_enabled && formData.get("delivery") === "delivery" ? "delivery" : "pickup";

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("place_order", {
      p_tenant_slug: slug,
      p_items: items.map((i) => ({ product_id: String(i.product_id), quantity: Number(i.quantity) })),
      p_customer_name: name,
      p_customer_phone: phone,
      p_delivery: delivery,
      p_address: String(formData.get("address") ?? ""),
      p_notes: String(formData.get("notes") ?? ""),
    })
    .single();
  if (error || !data) {
    // Los mensajes de validación de place_order ya vienen en español
    const message = error?.code === "22023" ? error.message : ORDER_ERRORS[error?.code ?? ""];
    return { ok: false, message: message ?? "No pudimos enviar tu pedido. Intenta de nuevo." };
  }
  return { ok: true, token: data.token };
}

export async function setOrderStatus(slug: string, orderId: string, status: string) {
  const site = await requireTenant(slug);
  if (!isOrderStatus(status)) throw new Error("Estado inválido");
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("tenant_id", site.id);
  if (error) throw new Error("No se pudo actualizar el pedido");
  refresh();
}
