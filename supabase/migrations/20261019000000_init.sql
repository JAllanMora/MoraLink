-- MoraLink: esquema base multi-cliente (multi-tenant).
-- Cada negocio es un "tenant" identificado por su slug (moralink.app/<slug>).
-- Todo dato de negocio lleva tenant_id y se protege con RLS.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Negocios
-- ---------------------------------------------------------------------------

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$')
    -- Rutas de la propia app que no pueden ser nombre de negocio
    check (slug not in ('api', 'admin', 'app', 'auth', 'login', 'www')),
  name text not null,
  tagline text,
  logo_url text,
  cover_url text,
  -- Identidad de marca: colores y tipografía. Ver src/lib/tenant/theme.ts
  theme jsonb not null default '{}'::jsonb,
  whatsapp text,
  instagram text,
  address text,
  -- Suscripción mensual del negocio con MoraLink
  plan text not null default 'basic' check (plan in ('basic', 'pro')),
  billing_status text not null default 'trial'
    check (billing_status in ('trial', 'active', 'past_due', 'canceled')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Usuarios que administran un negocio (dueño o personal de caja)
create table public.tenant_members (
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  image_url text,
  position int not null default 0,
  unique (tenant_id, name)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  description text,
  price numeric(10, 2),
  image_url text,
  available boolean not null default true,
  position int not null default 0,
  unique (tenant_id, name)
);

-- ---------------------------------------------------------------------------
-- Programa de lealtad
-- ---------------------------------------------------------------------------

-- Un programa activo por negocio. "stamps": tarjeta de sellos (1 sello por
-- visita/compra). "points": puntos según el monto de compra.
create table public.loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants (id) on delete cascade,
  type text not null default 'stamps' check (type in ('stamps', 'points')),
  name text not null default 'Programa de lealtad',
  description text,
  -- Sellos para completar la tarjeta (solo para type = 'stamps')
  stamps_required int not null default 5 check (stamps_required > 0),
  -- Puntos por cada unidad de moneda gastada (solo para type = 'points')
  points_per_currency numeric(10, 2) not null default 1,
  -- Ícono del sello: nombre de un ícono en src/components/stamp-icon.tsx
  stamp_icon text not null default 'star'
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  description text,
  -- Costo en sellos o puntos según el tipo de programa
  cost int not null check (cost > 0),
  image_url text,
  active boolean not null default true,
  position int not null default 0,
  unique (tenant_id, name)
);

-- Clientes finales de cada negocio. Un mismo usuario de auth puede ser
-- cliente de varios negocios con tarjetas independientes.
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text,
  phone text,
  -- Código corto que el personal escanea (QR) o teclea en caja
  code text not null default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id),
  unique (tenant_id, code)
);

-- Libro de movimientos: el saldo de un cliente es la suma de amount.
create table public.loyalty_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  kind text not null check (kind in ('earn', 'redeem', 'adjust')),
  amount int not null,
  reward_id uuid references public.rewards (id) on delete set null,
  note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index on public.categories (tenant_id, position);
create index on public.products (tenant_id, category_id, position);
create index on public.rewards (tenant_id, position);
create index on public.loyalty_events (customer_id, created_at desc);
create index on public.tenant_members (user_id);

create view public.customer_balances
with (security_invoker = true) as
select
  c.id as customer_id,
  c.tenant_id,
  coalesce(sum(e.amount), 0)::int as balance,
  coalesce(sum(e.amount) filter (where e.kind = 'earn'), 0)::int as lifetime_earned
from public.customers c
left join public.loyalty_events e on e.customer_id = c.id
group by c.id, c.tenant_id;

-- ---------------------------------------------------------------------------
-- Seguridad (RLS)
-- ---------------------------------------------------------------------------

create or replace function public.is_tenant_member(p_tenant_id uuid, p_roles text[] default array['owner', 'staff'])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.tenant_members m
    where m.tenant_id = p_tenant_id
      and m.user_id = auth.uid()
      and m.role = any (p_roles)
  );
$$;

alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.loyalty_programs enable row level security;
alter table public.rewards enable row level security;
alter table public.customers enable row level security;
alter table public.loyalty_events enable row level security;

-- Información pública del negocio: cualquiera puede verla si está activo
create policy "tenants: lectura pública" on public.tenants
  for select using (active or public.is_tenant_member(id));
create policy "tenants: el dueño edita" on public.tenants
  for update using (public.is_tenant_member(id, array['owner']));

create policy "members: ver mis membresías" on public.tenant_members
  for select using (user_id = auth.uid() or public.is_tenant_member(tenant_id, array['owner']));

create policy "categories: lectura pública" on public.categories for select using (true);
create policy "categories: el negocio edita" on public.categories
  for all using (public.is_tenant_member(tenant_id, array['owner']))
  with check (public.is_tenant_member(tenant_id, array['owner']));

create policy "products: lectura pública" on public.products for select using (true);
create policy "products: el negocio edita" on public.products
  for all using (public.is_tenant_member(tenant_id, array['owner']))
  with check (public.is_tenant_member(tenant_id, array['owner']));

create policy "programs: lectura pública" on public.loyalty_programs for select using (true);
create policy "programs: el negocio edita" on public.loyalty_programs
  for all using (public.is_tenant_member(tenant_id, array['owner']))
  with check (public.is_tenant_member(tenant_id, array['owner']));

create policy "rewards: lectura pública" on public.rewards for select using (true);
create policy "rewards: el negocio edita" on public.rewards
  for all using (public.is_tenant_member(tenant_id, array['owner']))
  with check (public.is_tenant_member(tenant_id, array['owner']));

-- El cliente ve y crea su propia tarjeta; el personal ve las de su negocio
create policy "customers: ver propia o del negocio" on public.customers
  for select using (user_id = auth.uid() or public.is_tenant_member(tenant_id));
create policy "customers: unirse" on public.customers
  for insert with check (user_id = auth.uid());
create policy "customers: editar propia" on public.customers
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Movimientos: solo lectura. Se escriben con las funciones de abajo.
create policy "events: ver propios o del negocio" on public.loyalty_events
  for select using (
    public.is_tenant_member(tenant_id)
    or exists (select 1 from public.customers c where c.id = customer_id and c.user_id = auth.uid())
  );

-- El cliente no elige su código ni lo cambia, ni se mueve de negocio
revoke insert, update on public.customers from anon, authenticated;
grant insert (tenant_id, name, phone) on public.customers to authenticated;
grant update (name, phone) on public.customers to authenticated;

-- ---------------------------------------------------------------------------
-- Operaciones del personal en caja
-- ---------------------------------------------------------------------------

-- Suma sellos/puntos a un cliente por su código. Devuelve el saldo nuevo.
create or replace function public.add_loyalty(p_tenant_id uuid, p_customer_code text, p_amount int default 1, p_note text default null)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid;
  v_balance int;
begin
  if not public.is_tenant_member(p_tenant_id) then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'La cantidad debe ser mayor a cero' using errcode = '22023';
  end if;

  select id into v_customer_id from public.customers
  where tenant_id = p_tenant_id and code = upper(trim(p_customer_code));
  if v_customer_id is null then
    raise exception 'Cliente no encontrado' using errcode = 'P0002';
  end if;

  insert into public.loyalty_events (tenant_id, customer_id, kind, amount, note, created_by)
  values (p_tenant_id, v_customer_id, 'earn', p_amount, p_note, auth.uid());

  select balance into v_balance from public.customer_balances where customer_id = v_customer_id;
  return v_balance;
end;
$$;

-- Canjea una recompensa si el cliente tiene saldo suficiente. Devuelve el saldo nuevo.
create or replace function public.redeem_reward(p_tenant_id uuid, p_customer_code text, p_reward_id uuid)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid;
  v_cost int;
  v_balance int;
begin
  if not public.is_tenant_member(p_tenant_id) then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  -- Bloquea la tarjeta para evitar dobles canjes simultáneos
  select id into v_customer_id from public.customers
  where tenant_id = p_tenant_id and code = upper(trim(p_customer_code))
  for update;
  if v_customer_id is null then
    raise exception 'Cliente no encontrado' using errcode = 'P0002';
  end if;

  select cost into v_cost from public.rewards
  where id = p_reward_id and tenant_id = p_tenant_id and active;
  if v_cost is null then
    raise exception 'Recompensa no disponible' using errcode = 'P0002';
  end if;

  select balance into v_balance from public.customer_balances where customer_id = v_customer_id;
  if v_balance < v_cost then
    raise exception 'Saldo insuficiente' using errcode = '22023';
  end if;

  insert into public.loyalty_events (tenant_id, customer_id, kind, amount, reward_id, created_by)
  values (p_tenant_id, v_customer_id, 'redeem', -v_cost, p_reward_id, auth.uid());

  return v_balance - v_cost;
end;
$$;

revoke execute on function public.add_loyalty(uuid, text, int, text) from public, anon;
revoke execute on function public.redeem_reward(uuid, text, uuid) from public, anon;
grant execute on function public.add_loyalty(uuid, text, int, text) to authenticated;
grant execute on function public.redeem_reward(uuid, text, uuid) to authenticated;
