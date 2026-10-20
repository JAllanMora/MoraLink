import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { isTenantStaff } from "@/lib/tenant/customer";
import { isOrderStatus, ORDER_STATUS } from "@/lib/tenant/orders";
import { getTenantSite } from "@/lib/tenant/queries";
import { setOrderStatus } from "../actions";
import { AutoRefresh } from "../_components/auto-refresh";

const FILTERS = {
  activos: { label: "Por surtir", statuses: ["nuevo", "preparando", "listo"] },
  entregados: { label: "Entregados", statuses: ["entregado"] },
  cancelados: { label: "Cancelados", statuses: ["cancelado"] },
} as const;

type Filter = keyof typeof FILTERS;

const BADGE: Record<string, string> = {
  nuevo: "bg-amber-100 text-amber-900",
  preparando: "bg-sky-100 text-sky-900",
  listo: "bg-emerald-100 text-emerald-900",
  entregado: "bg-brand-muted/15 text-brand-muted",
  cancelado: "bg-red-100 text-red-800",
};

const time = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Mexico_City",
});

// Panel del negocio: pedidos en línea por surtir
export default function OrdersPage({ params, searchParams }: PageProps<"/[tenant]/pedidos">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-brand bg-brand-surface" />}>
      <Orders params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Orders({ params, searchParams }: Pick<PageProps<"/[tenant]/pedidos">, "params" | "searchParams">) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();

  if (!(await isTenantStaff(site.id))) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-3xl font-bold">Pedidos</h1>
        <p className="text-brand-muted">Entra con la cuenta del negocio para ver los pedidos.</p>
        <ButtonLink href={`/${site.slug}/entrar`}>Entrar</ButtonLink>
      </div>
    );
  }

  const { estado } = await searchParams;
  const filter: Filter = typeof estado === "string" && estado in FILTERS ? (estado as Filter) : "activos";

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, number, status, customer_name, customer_phone, delivery, address, notes, total, created_at, order_items (name, price, quantity)",
    )
    .eq("tenant_id", site.id)
    .in("status", [...FILTERS[filter].statuses])
    .order("created_at", { ascending: filter === "activos" })
    .limit(100);

  return (
    <div className="space-y-6">
      <AutoRefresh seconds={30} />
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-bold">Pedidos</h1>
        <Link href={`/${site.slug}/caja`} className="text-sm font-semibold text-brand">
          Ir a caja
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto">
        {(Object.keys(FILTERS) as Filter[]).map((key) => (
          <Link
            key={key}
            href={`/${site.slug}/pedidos?estado=${key}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold ${
              key === filter ? "bg-brand text-brand-foreground" : "bg-brand-surface text-brand-muted"
            }`}
          >
            {FILTERS[key].label}
          </Link>
        ))}
      </nav>

      {!orders?.length && (
        <p className="rounded-brand bg-brand-surface p-6 text-center text-brand-muted">
          {filter === "activos" ? "No hay pedidos por surtir." : "No hay pedidos aquí todavía."}
        </p>
      )}

      <ul className="space-y-4">
        {orders?.map((order) => {
          const status = isOrderStatus(order.status) ? ORDER_STATUS[order.status] : null;
          const active = filter === "activos";
          return (
            <li key={order.id} className="rounded-brand bg-brand-surface p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-bold">#{order.number}</p>
                  <p className="text-xs text-brand-muted">{time.format(new Date(order.created_at))}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${BADGE[order.status] ?? ""}`}>
                  {status?.label ?? order.status}
                </span>
              </div>

              <div className="mt-3 text-sm">
                <p className="font-semibold">{order.customer_name}</p>
                <p>
                  <a href={`tel:${order.customer_phone}`} className="text-brand underline">
                    {order.customer_phone}
                  </a>
                  {" · "}
                  <a
                    href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                    className="text-[#1F7A45] underline"
                  >
                    WhatsApp
                  </a>
                </p>
                <p className="mt-1 text-brand-muted">
                  {order.delivery === "delivery" ? `Envío a: ${order.address}` : "Pasa a recoger"}
                </p>
              </div>

              <ul className="mt-3 space-y-1 border-t border-brand-muted/15 pt-3 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.name} className="flex justify-between gap-3">
                    <span>
                      <span className="font-bold">{item.quantity} ×</span> {item.name}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <p className="mt-2 rounded-brand bg-amber-50 p-2 text-sm text-amber-900">Nota: {order.notes}</p>
              )}
              <p className="mt-2 flex justify-between border-t border-brand-muted/15 pt-2 font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </p>

              {active && status?.next && (
                <div className="mt-3 flex gap-2">
                  <form action={setOrderStatus.bind(null, site.slug, order.id, status.next)} className="flex-1">
                    <button className="w-full rounded-brand bg-brand px-4 py-2.5 font-semibold text-brand-foreground active:scale-[0.98]">
                      {status.action}
                    </button>
                  </form>
                  <form action={setOrderStatus.bind(null, site.slug, order.id, "cancelado")}>
                    <button className="rounded-brand border-2 border-red-200 px-3 py-2 text-sm font-semibold text-red-700">
                      Cancelar
                    </button>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
