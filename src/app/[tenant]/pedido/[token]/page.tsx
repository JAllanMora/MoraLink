import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatPrice } from "@/lib/format";
import { requestOrigin } from "@/lib/origin";
import { createPublicClient } from "@/lib/supabase/public";
import { isOrderStatus, ORDER_STATUS, ORDER_STEPS } from "@/lib/tenant/orders";
import { getTenantSite } from "@/lib/tenant/queries";
import { AutoRefresh } from "../../_components/auto-refresh";

type Order = {
  number: number;
  status: string;
  customer_name: string;
  delivery: "pickup" | "delivery";
  address: string | null;
  notes: string | null;
  total: number;
  created_at: string;
  tenant_slug: string;
  items: { name: string; price: number; quantity: number }[];
};

// Seguimiento del pedido: el enlace que recibe el cliente al pedir
export default function OrderPage({ params }: PageProps<"/[tenant]/pedido/[token]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-brand bg-brand-surface" />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: { params: PageProps<"/[tenant]/pedido/[token]">["params"] }) {
  const { tenant, token } = await params;
  const site = await getTenantSite(tenant);
  if (!site) notFound();

  const { data } = await createPublicClient().rpc("get_order", { p_token: token });
  const order = data as Order | null;
  if (!order || order.tenant_slug !== site.slug) notFound();

  const status = isOrderStatus(order.status) ? order.status : "nuevo";
  const step = ORDER_STEPS.indexOf(status);
  const link = `${await requestOrigin()}/${site.slug}/pedido/${token}`;
  const message = [
    `Hola, soy ${order.customer_name}. Acabo de hacer el pedido #${order.number}:`,
    ...order.items.map((i) => `• ${i.quantity} × ${i.name}`),
    `Total: ${formatPrice(order.total)}`,
    order.delivery === "delivery" ? `Envío a: ${order.address}` : "Paso a recogerlo.",
    `Seguimiento: ${link}`,
  ].join("\n");

  return (
    <div className="space-y-6">
      {status !== "entregado" && status !== "cancelado" && <AutoRefresh seconds={20} />}

      <div className="rounded-brand bg-brand p-6 text-center text-brand-foreground shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Pedido</p>
        <p className="font-display text-6xl font-bold">#{order.number}</p>
        <p className="mt-2 text-lg font-semibold">
          {status === "cancelado" ? "Pedido cancelado" : `¡Gracias, ${order.customer_name}!`}
        </p>
      </div>

      {status !== "cancelado" && (
        <ol className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          {ORDER_STEPS.map((s, i) => (
            <li key={s} className={i <= step ? "text-brand" : "text-brand-muted/60"}>
              <span className={`mb-1 block h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-brand-muted/20"}`} />
              {ORDER_STATUS[s].label}
            </li>
          ))}
        </ol>
      )}

      <section className="rounded-brand bg-brand-surface p-4 shadow-sm">
        <ul className="divide-y divide-brand-muted/15">
          {order.items.map((item) => (
            <li key={item.name} className="flex justify-between gap-3 py-2">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-brand-muted/15 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="mt-3 text-sm text-brand-muted">
          {order.delivery === "delivery" ? `Envío a: ${order.address}` : `Recoges en ${site.address ?? site.name}`}
        </p>
        {order.notes && <p className="mt-1 text-sm text-brand-muted">Notas: {order.notes}</p>}
      </section>

      {site.whatsapp && (
        <a
          href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
          className="flex w-full items-center justify-center rounded-brand bg-[#1F7A45] px-4 py-3 font-semibold text-white"
        >
          Avisar por WhatsApp
        </a>
      )}
      <p className="text-center text-sm text-brand-muted">
        Guarda este enlace para ver cómo va tu pedido. Esta página se actualiza sola.
      </p>
    </div>
  );
}
