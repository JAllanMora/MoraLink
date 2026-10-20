-- Presentaciones y reglas de compra del catálogo:
-- * group_name + variant: un producto con varias presentaciones, cada una con su
--   precio (ej. "Cuernitos Naturales" en "4 en bolsa" o "4 en caja").
-- * min_quantity / max_quantity: piezas mínimas y máximas por pedido.
-- * coming_soon: se muestra como "Próximamente", sin precio ni compra.
-- * categories.description: frase corta bajo el nombre de la categoría.

alter table public.categories add column description text;

alter table public.products
  add column group_name text,
  add column variant text,
  add column min_quantity int not null default 1 check (min_quantity between 1 and 99),
  add column max_quantity int not null default 99 check (max_quantity between 1 and 99),
  add column coming_soon boolean not null default false,
  add constraint products_quantity_range check (min_quantity <= max_quantity);

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
  v_bad record;
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
    select p.id as product_id, p.name, p.price, sum(i.quantity)::int as quantity, p.min_quantity, p.max_quantity
    from jsonb_to_recordset(p_items) as i (product_id uuid, quantity int)
    join public.products p on p.id = i.product_id and p.tenant_id = v_tenant.id
      and p.available and not p.coming_soon and p.price is not null
    where i.quantity between 1 and 99
    group by p.id, p.name, p.price, p.min_quantity, p.max_quantity
  ) l;
  if v_count <> (select count(distinct (i ->> 'product_id')) from jsonb_array_elements(p_items) i) then
    raise exception 'Algún producto ya no está disponible' using errcode = '22023';
  end if;

  -- Cantidades mínimas y máximas por producto (ej. brownies desde 4 piezas)
  select l.name, l.quantity, l.min_quantity, l.max_quantity into v_bad
  from jsonb_to_recordset(v_lines) as l (name text, quantity int, min_quantity int, max_quantity int)
  where l.quantity < l.min_quantity or l.quantity > l.max_quantity
  limit 1;
  if found then
    if v_bad.quantity < v_bad.min_quantity then
      raise exception '%: el mínimo es % piezas', v_bad.name, v_bad.min_quantity using errcode = '22023';
    end if;
    raise exception '%: máximo % por pedido', v_bad.name, v_bad.max_quantity using errcode = '22023';
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

