#!/usr/bin/env node
// Carga o actualiza un negocio a partir de su archivo en clientes/<slug>.json.
//
//   npm run cliente:cargar -- clientes/la-pizzeria.json
//   npm run cliente:cargar -- clientes/la-pizzeria.json --duenio correo@negocio.com
//
// Es idempotente: se puede correr cada vez que el negocio cambie su marca,
// menú o recompensas. Productos, categorías y recompensas se identifican por
// nombre; los que ya no estén en el archivo se marcan como no disponibles.
// Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SECRET_KEY (llave service role).
// Con MORALINK_APP_URL y REVALIDATE_SECRET además refresca el sitio publicado.

import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { duenio: { type: "string" } },
});

const file = positionals[0];
if (!file) {
  console.error("Uso: npm run cliente:cargar -- clientes/<slug>.json [--duenio correo]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en el entorno (.env.local).");
  process.exit(1);
}

const db = createClient(url, secret, { auth: { persistSession: false } });
const client = JSON.parse(await readFile(file, "utf8"));

function check(result, what) {
  if (result.error) {
    console.error(`Error al guardar ${what}:`, result.error.message);
    process.exit(1);
  }
  return result.data;
}

const tenant = check(
  await db
    .from("tenants")
    .upsert(
      {
        slug: client.slug,
        name: client.name,
        tagline: client.tagline ?? null,
        logo_url: client.logo_url ?? null,
        cover_url: client.cover_url ?? null,
        theme: client.theme ?? {},
        whatsapp: client.whatsapp ?? null,
        instagram: client.instagram ?? null,
        address: client.address ?? null,
        // "orders": { "enabled": true, "delivery": true } activa los pedidos en línea
        orders_enabled: client.orders?.enabled ?? false,
        delivery_enabled: client.orders?.delivery ?? false,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single(),
  "el negocio",
);

if (client.program) {
  check(
    await db
      .from("loyalty_programs")
      .upsert({ tenant_id: tenant.id, ...client.program }, { onConflict: "tenant_id" }),
    "el programa",
  );
}

const rewards = (client.rewards ?? []).map((reward, position) => ({
  tenant_id: tenant.id,
  active: true,
  position,
  description: null,
  image_url: null,
  ...reward,
}));
check(await db.from("rewards").update({ active: false }).eq("tenant_id", tenant.id), "las recompensas");
if (rewards.length) {
  check(await db.from("rewards").upsert(rewards, { onConflict: "tenant_id,name" }), "las recompensas");
}

check(await db.from("products").update({ available: false }).eq("tenant_id", tenant.id), "los productos");
let productCount = 0;
for (const [position, section] of (client.catalog ?? []).entries()) {
  const category = check(
    await db
      .from("categories")
      .upsert(
        { tenant_id: tenant.id, name: section.category, image_url: section.image_url ?? null, position },
        { onConflict: "tenant_id,name" },
      )
      .select("id")
      .single(),
    `la categoría ${section.category}`,
  );

  const products = (section.products ?? []).map((product, index) => ({
    tenant_id: tenant.id,
    category_id: category.id,
    available: true,
    position: index,
    description: null,
    price: null,
    image_url: null,
    ...product,
  }));
  productCount += products.length;
  if (products.length) {
    check(await db.from("products").upsert(products, { onConflict: "tenant_id,name" }), "los productos");
  }
}

if (values.duenio) {
  const email = values.duenio.toLowerCase();
  let userId = await findUserId(email);
  if (!userId) {
    const created = check(
      await db.auth.admin.createUser({ email, email_confirm: true }),
      "el usuario del dueño",
    );
    userId = created.user.id;
  }
  check(
    await db
      .from("tenant_members")
      .upsert({ tenant_id: tenant.id, user_id: userId, role: "owner" }, { onConflict: "tenant_id,user_id" }),
    "la membresía del dueño",
  );
  console.log(`Dueño: ${email}`);
}

// Pide a la app desplegada que refresque el caché de este negocio
const appUrl = process.env.MORALINK_APP_URL;
if (appUrl && process.env.REVALIDATE_SECRET) {
  const res = await fetch(new URL("/api/revalidate", appUrl), {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.REVALIDATE_SECRET}`, "content-type": "application/json" },
    body: JSON.stringify({ slug: client.slug }),
  });
  console.log(res.ok ? "Caché del sitio actualizado." : `No se pudo refrescar el caché (${res.status}).`);
}

console.log(
  `Listo: ${client.name} (${client.slug}) con ${productCount} productos y ${rewards.length} recompensas.`,
);

async function findUserId(email) {
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const user = data.users.find((u) => u.email?.toLowerCase() === email);
    if (user) return user.id;
    if (data.users.length < 1000) return null;
  }
}
