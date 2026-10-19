import Link from "next/link";
import { StampIcon } from "@/components/stamp-icon";
import { getCurrentCard } from "@/lib/tenant/customer";
import type { TenantSite } from "@/lib/tenant/queries";
import { pluralize } from "@/lib/format";
import { joinProgram } from "../actions";
import { Button } from "@/components/button";

// Tarjeta "Tu progreso". Lee la sesión: va dentro de <Suspense>.
export async function ProgressCard({ site }: { site: TenantSite }) {
  const program = site.program;
  if (!program) return null;

  const current = await getCurrentCard(site.id);
  const [one, many] = program.type === "stamps" ? ["sello", "sellos"] : ["punto", "puntos"];

  if (!current?.card) {
    return (
      <section className="rounded-brand bg-brand p-5 text-brand-foreground">
        <h2 className="font-display text-xl font-bold">{program.name}</h2>
        {program.description && <p className="mt-1 text-sm opacity-90">{program.description}</p>}
        <div className="mt-4">
          {current ? (
            <form action={joinProgram.bind(null, site.slug)}>
              <Button className="bg-brand-surface text-brand">Activar mi tarjeta</Button>
            </form>
          ) : (
            <Link
              href={`/${site.slug}/entrar`}
              className="flex w-full justify-center rounded-brand bg-brand-surface px-4 py-3 font-semibold text-brand"
            >
              Únete gratis
            </Link>
          )}
        </div>
      </section>
    );
  }

  const balance = current.card.balance;
  const nextReward = site.rewards.find((r) => r.cost > balance);
  const required = program.type === "stamps" ? program.stamps_required : nextReward?.cost ?? 0;
  const filled = Math.min(balance, required);
  const missing = required - filled;

  return (
    <section className="rounded-brand bg-brand p-5 text-brand-foreground">
      <h2 className="text-center font-display text-xl font-bold">Tu progreso</h2>

      {program.type === "stamps" ? (
        <div className="mt-4 flex justify-center gap-2 rounded-full bg-brand-surface/95 px-3 py-2">
          {Array.from({ length: required }, (_, i) => (
            <StampIcon
              key={i}
              name={program.stamp_icon}
              className={`size-9 ${i < filled ? "text-brand" : "text-brand-muted opacity-40"}`}
            />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-center font-display text-4xl font-bold">{pluralize(balance, one, many)}</p>
      )}

      <p className="mt-3 text-center text-sm font-medium">
        {missing > 0
          ? `¡Te ${missing === 1 ? "falta" : "faltan"} ${pluralize(missing, one, many)} para tu recompensa!`
          : "¡Ya puedes canjear una recompensa! Muéstrale tu tarjeta al personal."}
      </p>

      <Link
        href={`/${site.slug}/mi-tarjeta`}
        className="mt-4 flex w-full justify-center rounded-brand border-2 border-brand-foreground px-4 py-3 font-semibold"
      >
        Mostrar mi código
      </Link>
    </section>
  );
}

export function ProgressCardSkeleton() {
  return <div className="h-44 animate-pulse rounded-brand bg-brand opacity-60" />;
}
