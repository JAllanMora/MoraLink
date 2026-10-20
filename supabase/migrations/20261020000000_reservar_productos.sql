-- "productos" es ahora una ruta del sitio de MoraLink (moralink.app/productos/...)
alter table public.tenants
  add constraint tenants_slug_not_reserved check (slug not in ('productos'));
