#!/usr/bin/env node
// Convierte clientes/<slug>.json en SQL para pegar en Supabase > SQL Editor,
// sin llaves ni CLI. Hace lo mismo que cargar-cliente.mjs y es idempotente.
//
//   npm run cliente:sql -- clientes/la-dolce-vita.json > alta.sql
//   npm run cliente:sql -- clientes/la-dolce-vita.json --duenio correo@negocio.com > alta.sql
//
// Con --duenio, el correo queda como dueño del negocio (caja y pedidos). Esa
// persona debe haber entrado antes una vez en /<slug>/entrar para tener cuenta.

import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { productRows } from "./lib/catalogo.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { duenio: { type: "string" } },
});

const file = positionals[0];
if (!file) {
  console.error("Uso: npm run cliente:sql -- clientes/<slug>.json [--duenio correo]");
  process.exit(1);
}

const client = JSON.parse(await readFile(file, "utf8"));

// Literal SQL seguro para texto, números, null y JSON
function lit(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return `${lit(JSON.stringify(value))}::jsonb`;
  return `'${String(value).replaceAll("'", "''")}'`;
}

const tenant = `(select id from public.tenants where slug = ${lit(client.slug)})`;
const sql = [
  `-- Alta o actualización de ${client.name} (${client.slug}). Generado desde ${file}.`,
  "begin;",
  "",
  `insert into public.tenants (slug, name, tagline, logo_url, cover_url, theme, whatsapp, instagram, address, orders_enabled, delivery_enabled)
values (${[
    client.slug,
    client.name,
    client.tagline,
    client.logo_url,
    client.cover_url,
    client.theme ?? {},
    client.whatsapp,
    client.instagram,
    client.address,
    client.orders?.enabled ?? false,
    client.orders?.delivery ?? false,
  ]
    .map(lit)
    .join(", ")})
on conflict (slug) do update set name = excluded.name, tagline = excluded.tagline, logo_url = excluded.logo_url,
  cover_url = excluded.cover_url, theme = excluded.theme, whatsapp = excluded.whatsapp, instagram = excluded.instagram,
  address = excluded.address, orders_enabled = excluded.orders_enabled, delivery_enabled = excluded.delivery_enabled;`,
];

if (client.program) {
  const p = client.program;
  sql.push(`
insert into public.loyalty_programs (tenant_id, type, name, description, stamps_required, points_per_currency, stamp_icon)
values (${tenant}, ${[p.type ?? "stamps", p.name, p.description, p.stamps_required ?? 5, p.points_per_currency ?? 1, p.stamp_icon ?? "star"].map(lit).join(", ")})
on conflict (tenant_id) do update set type = excluded.type, name = excluded.name, description = excluded.description,
  stamps_required = excluded.stamps_required, points_per_currency = excluded.points_per_currency, stamp_icon = excluded.stamp_icon;`);
}

sql.push(`\nupdate public.rewards set active = false where tenant_id = ${tenant};`);
for (const [position, r] of (client.rewards ?? []).entries()) {
  sql.push(`insert into public.rewards (tenant_id, name, description, cost, image_url, position, active)
values (${tenant}, ${[r.name, r.description, r.cost, r.image_url, position].map(lit).join(", ")}, true)
on conflict (tenant_id, name) do update set description = excluded.description, cost = excluded.cost,
  image_url = excluded.image_url, position = excluded.position, active = true;`);
}

sql.push(`\nupdate public.products set available = false where tenant_id = ${tenant};`);
for (const [position, section] of (client.catalog ?? []).entries()) {
  sql.push(`insert into public.categories (tenant_id, name, description, image_url, position)
values (${tenant}, ${[section.category, section.description, section.image_url, position].map(lit).join(", ")})
on conflict (tenant_id, name) do update set description = excluded.description, image_url = excluded.image_url,
  position = excluded.position;`);
  const category = `(select id from public.categories where tenant_id = ${tenant} and name = ${lit(section.category)})`;
  for (const [index, p] of productRows(section).entries()) {
    const columns = [
      "name",
      "description",
      "price",
      "image_url",
      "group_name",
      "variant",
      "min_quantity",
      "max_quantity",
      "coming_soon",
    ];
    sql.push(`insert into public.products (tenant_id, category_id, position, available, ${columns.join(", ")})
values (${tenant}, ${category}, ${index}, true, ${columns.map((c) => lit(p[c])).join(", ")})
on conflict (tenant_id, name) do update set category_id = excluded.category_id, position = excluded.position, available = true,
  ${columns
    .slice(1)
    .map((c) => `${c} = excluded.${c}`)
    .join(", ")};`);
  }
}

if (values.duenio) {
  const email = lit(values.duenio.trim().toLowerCase());
  sql.push(`
-- Dueño: debe haber entrado antes una vez en /<slug>/entrar con este correo
insert into public.tenant_members (tenant_id, user_id, role)
select ${tenant}, id, 'owner' from auth.users where email = ${email}
on conflict (tenant_id, user_id) do update set role = 'owner';`);
}

sql.push("", "commit;", "");
process.stdout.write(sql.join("\n"));
