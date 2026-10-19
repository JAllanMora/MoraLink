import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/button";
import { pluralize } from "@/lib/format";
import { getCurrentCard } from "@/lib/tenant/customer";
import { requestOrigin } from "@/lib/origin";
import { getTenantSite } from "@/lib/tenant/queries";
import { joinProgram, signOut } from "../actions";

export default function CardPage({ params }: PageProps<"/[tenant]/mi-tarjeta">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-brand bg-brand-surface" />}>
      <Card params={params} />
    </Suspense>
  );
}

async function Card({ params }: { params: PageProps<"/[tenant]/mi-tarjeta">["params"] }) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();

  const current = await getCurrentCard(site.id);
  if (!current) redirect(`/${site.slug}/entrar`);

  if (!current.card) {
    return (
      <form action={joinProgram.bind(null, site.slug)} className="space-y-4 text-center">
        <h1 className="font-display text-3xl font-bold">Activa tu tarjeta</h1>
        <p className="text-brand-muted">Entraste como {current.email}.</p>
        <Button>Activar mi tarjeta</Button>
      </form>
    );
  }

  const { card } = current;
  const [one, many] = site.program?.type === "points" ? ["punto", "puntos"] : ["sello", "sellos"];
  // El QR abre la caja del negocio con el código ya escrito
  const qr = await QRCode.toString(`${await requestOrigin()}/${site.slug}/caja?codigo=${card.code}`, {
    type: "svg",
    margin: 1,
    color: { dark: site.theme.foreground, light: "#0000" },
  });

  return (
    <div className="space-y-5 text-center">
      <h1 className="font-display text-3xl font-bold">Mi tarjeta</h1>
      <div className="rounded-brand bg-brand-surface p-6 shadow-sm">
        <div className="mx-auto w-56" dangerouslySetInnerHTML={{ __html: qr }} />
        <p className="mt-3 font-mono text-2xl font-bold tracking-[0.3em]">{card.code}</p>
        <p className="mt-1 text-sm text-brand-muted">Muestra este código en caja para sumar o canjear.</p>
      </div>
      <p className="rounded-brand bg-brand p-4 font-semibold text-brand-foreground">
        Tienes {pluralize(card.balance, one, many)}
      </p>
      <form action={signOut.bind(null, site.slug)}>
        <button className="text-sm text-brand-muted underline">Cerrar sesión ({current.email})</button>
      </form>
    </div>
  );
}
