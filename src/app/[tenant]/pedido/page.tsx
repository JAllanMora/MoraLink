import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTenantSite } from "@/lib/tenant/queries";
import { CheckoutForm } from "./checkout-form";

export default function CheckoutPage({ params }: PageProps<"/[tenant]/pedido">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-brand bg-brand-surface" />}>
      <Checkout params={params} />
    </Suspense>
  );
}

async function Checkout({ params }: { params: PageProps<"/[tenant]/pedido">["params"] }) {
  const site = await getTenantSite((await params).tenant);
  if (!site || !site.orders_enabled) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Tu pedido</h1>
      <CheckoutForm slug={site.slug} deliveryEnabled={site.delivery_enabled} address={site.address} />
    </div>
  );
}
