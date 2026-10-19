import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button";
import { StampIcon } from "@/components/stamp-icon";
import { getTenantSite } from "@/lib/tenant/queries";
import { ProgressCard, ProgressCardSkeleton } from "./_components/progress-card";

export default function TenantHome({ params }: PageProps<"/[tenant]">) {
  return (
    <Suspense fallback={<ProgressCardSkeleton />}>
      <Home params={params} />
    </Suspense>
  );
}

async function Home({ params }: { params: PageProps<"/[tenant]">["params"] }) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();
  // La recompensa principal: la más alta del programa
  const featured = site.rewards.at(-1);

  return (
    <div className="space-y-5">
      {site.tagline && <p className="text-center text-brand-muted">{site.tagline}</p>}

      <Suspense fallback={<ProgressCardSkeleton />}>
        <ProgressCard site={site} />
      </Suspense>

      {featured && (
        <section className="flex items-center gap-4 rounded-brand bg-brand-surface p-4 shadow-sm">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-background text-brand">
            <StampIcon name={site.program?.stamp_icon ?? "star"} className="size-8" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Recompensa</p>
            <p className="font-display text-lg font-bold">{featured.name}</p>
            {featured.description && <p className="text-sm text-brand-muted">{featured.description}</p>}
          </div>
        </section>
      )}

      <div className="space-y-3">
        <ButtonLink href={`/${site.slug}/recompensas`}>Ver mis recompensas</ButtonLink>
        <ButtonLink href={`/${site.slug}/menu`} variant="outline">
          Conocer el menú
        </ButtonLink>
      </div>

      {site.menu.length > 0 && (
        <section className="grid grid-cols-3 gap-3">
          {site.menu.map((category) => (
            <Link key={category.id} href={`/${site.slug}/menu#${category.id}`} className="text-center">
              <span
                className="flex aspect-square items-center justify-center rounded-brand bg-brand-surface bg-cover bg-center font-display text-2xl font-bold text-brand shadow-sm"
                style={category.image_url ? { backgroundImage: `url(${category.image_url})` } : undefined}
              >
                {!category.image_url && category.name.charAt(0)}
              </span>
              <span className="mt-1 block text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
