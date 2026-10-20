-- Pedidos en línea: el cliente arma su pedido desde el catálogo del negocio,
-- recibe un número y un enlace para seguirlo, y el negocio los ve y surte.

alter table public.tenants
  add column orders_enabled boolean not null default false,
  add column delivery_enabled boolean not null default false;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  -- Número consecutivo por negocio (#1, #2, ...)
  number int not null,
  -- Llave secreta del enlace de seguimiento que recibe el cliente
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  customer_name text not null check (length(trim(customer_name)) between 1 and 120),
  customer_phone text not null check (length(trim(customer_phone)) between 7 and 30),
  delivery text not null default 'pickup' check (delivery in ('pickup', 'delivery')),
  address text check (address is null or length(address) <= 400),
  notes text check (notes is null or length(notes) <= 1000),
  status text not null default 'nuevo'
    check (status in ('nuevo', 'preparando', 'listo', 'entregado', 'cancelado')),
  total numeric(10, 2) not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  -- Copia del nombre y precio al momento de pedir
  name text not null,
  price numeric(10, 2) not null default 0,
  quantity int not null check (quantity between 1 and 99)
);

create index on public.orders (tenant_id, created_at desc);
create index on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Solo el personal del negocio ve y actualiza sus pedidos. Los clientes
-- crean y consultan los suyos con las funciones de abajo.
create policy "orders: el negocio ve los suyos" on public.orders
  for select using (public.is_tenant_member(tenant_id));
create policy "orders: el negocio cambia el estado" on public.orders
  for update using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy "order_items: el negocio ve los suyos" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and public.is_tenant_member(o.tenant_id))
  );

revoke insert, update, delete on public.orders, public.order_items from anon, authenticated;
grant update (status, updated_at) on public.orders to authenticated;

-- Crea un pedido. Los precios se toman del catálogo, nunca del navegador.
-- p_items: [{"product_id": "...", "quantity": 2}, ...]
create or replace function public.place_order(
  p_tenant_slug text,
  p_items jsonb,
  p_customer_name text,
  p_customer_phone text,
  p_delivery text default 'pickup',
  p_address text default null,
  p_notes text default null
)
returns table (number int, token text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tenant public.tenants;
  v_order_id uuid;
  v_number int;
  v_token text;
  v_total numeric(10, 2);
  v_count int;
  v_lines jsonb;
begin
  select * into v_tenant from public.tenants
  where slug = p_tenant_slug and active and orders_enabled
  for update;  -- serializa la numeración de pedidos del negocio
  if v_tenant.id is null then
    raise exception 'Este negocio no recibe pedidos en línea' using errcode = 'P0002';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'El pedido está vacío' using errcode = '22023';
  end if;
  if p_delivery = 'delivery' and (not v_tenant.delivery_enabled or coalesce(trim(p_address), '') = '') then
    raise exception 'Falta la dirección de entrega' using errcode = '22023';
  end if;

  -- Une cada renglón con su producto disponible del mismo negocio
  select count(*), coalesce(sum(l.price * l.quantity), 0), jsonb_agg(to_jsonb(l))
  into v_count, v_total, v_lines
  from (
    select p.id as product_id, p.name, coalesce(p.price, 0) as price, sum(i.quantity)::int as quantity
    from jsonb_to_recordset(p_items) as i (product_id uuid, quantity int)
    join public.products p on p.id = i.product_id and p.tenant_id = v_tenant.id and p.available
    where i.quantity between 1 and 99
    group by p.id, p.name, p.price
  ) l;
  if v_count <> (select count(distinct (i ->> 'product_id')) from jsonb_array_elements(p_items) i) then
    raise exception 'Algún producto ya no está disponible' using errcode = '22023';
  end if;

  select coalesce(max(o.number), 0) + 1 into v_number from public.orders o where o.tenant_id = v_tenant.id;

  insert into public.orders (tenant_id, number, customer_name, customer_phone, delivery, address, notes, total, created_by)
  values (
    v_tenant.id, v_number, trim(p_customer_name), trim(p_customer_phone), p_delivery,
    case when p_delivery = 'delivery' then trim(p_address) end, nullif(trim(p_notes), ''), v_total, auth.uid()
  )
  returning id, orders.token into v_order_id, v_token;

  insert into public.order_items (order_id, product_id, name, price, quantity)
  select v_order_id, l.product_id, l.name, l.price, l.quantity
  from jsonb_to_recordset(v_lines) as l (product_id uuid, name text, price numeric, quantity int);

  return query select v_number, v_token;
end;
$$;

-- Consulta pública de un pedido por su enlace de seguimiento
create or replace function public.get_order(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'number', o.number,
    'status', o.status,
    'customer_name', o.customer_name,
    'delivery', o.delivery,
    'address', o.address,
    'notes', o.notes,
    'total', o.total,
    'created_at', o.created_at,
    'tenant_slug', t.slug,
    'items', (
      select coalesce(jsonb_agg(jsonb_build_object('name', i.name, 'price', i.price, 'quantity', i.quantity) order by i.name), '[]')
      from public.order_items i where i.order_id = o.id
    )
  )
  from public.orders o
  join public.tenants t on t.id = o.tenant_id
  where o.token = p_token;
$$;

revoke execute on function public.place_order(text, jsonb, text, text, text, text, text) from public;
revoke execute on function public.get_order(text) from public;
grant execute on function public.place_order(text, jsonb, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_order(text) to anon, authenticated;
