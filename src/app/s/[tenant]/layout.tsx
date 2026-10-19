import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTenantSite } from "@/lib/tenant/queries";
import { themeStyle } from "@/lib/tenant/theme";

export async function generateMetadata({ params }: LayoutProps<"/s/[tenant]">): Promise<Metadata> {
  const site = await getTenantSite((await params).tenant);
  if (!site) return {};
  return { title: site.name, description: site.program?.description ?? site.tagline ?? undefined };
}

export default function TenantLayout({ children, params }: LayoutProps<"/s/[tenant]">) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <TenantFrame params={params}>{children}</TenantFrame>
    </Suspense>
  );
}

async function TenantFrame({
  params,
  children,
}: {
  params: LayoutProps<"/s/[tenant]">["params"];
  children: React.ReactNode;
}) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();

  return (
    <div style={themeStyle(site.theme)} className="min-h-screen bg-brand-background text-brand-ink">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            {site.logo_url ? (
              <Image src={site.logo_url} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-brand-foreground">
                {site.name.charAt(0)}
              </span>
            )}
            <span className="font-display text-xl font-bold">{site.name}</span>
          </Link>
          <Link href="/mi-tarjeta" className="text-sm font-semibold text-brand">
            Mi tarjeta
          </Link>
        </header>

        <main className="flex-1 px-5 pb-28">{children}</main>

        {site.whatsapp && (
          <a
            href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
            className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#1F7A45] px-5 py-3 font-semibold text-white shadow-lg"
          >
            Escríbenos por WhatsApp
          </a>
        )}

        <footer className="px-5 pb-24 text-center text-xs text-brand-muted">
          Programa de lealtad por <span className="font-semibold">MoraLink</span>
        </footer>
      </div>
    </div>
  );
}
