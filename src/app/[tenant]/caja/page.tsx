import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button, ButtonLink } from "@/components/button";
import { isTenantStaff } from "@/lib/tenant/customer";
import { getTenantSite } from "@/lib/tenant/queries";
import { addLoyalty, redeemReward } from "../actions";
import { ActionForm } from "../_components/action-form";

// Panel del personal: sumar sellos/puntos y canjear recompensas por código.
export default function StaffPage({ params, searchParams }: PageProps<"/[tenant]/caja">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-brand bg-brand-surface" />}>
      <Staff params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Staff({ params, searchParams }: Pick<PageProps<"/[tenant]/caja">, "params" | "searchParams">) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();

  if (!(await isTenantStaff(site.id))) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-3xl font-bold">Caja</h1>
        <p className="text-brand-muted">Entra con la cuenta del negocio para registrar visitas.</p>
        <ButtonLink href={`/${site.slug}/entrar`}>Entrar</ButtonLink>
      </div>
    );
  }

  const { codigo } = await searchParams;
  const code = typeof codigo === "string" ? codigo : "";
  const isStamps = site.program?.type !== "points";
  const input =
    "w-full rounded-brand border border-brand-muted/30 bg-brand-surface px-4 py-3 font-mono uppercase tracking-widest outline-none focus:border-brand";

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-bold">Caja</h1>
        {site.orders_enabled && (
          <Link href={`/${site.slug}/pedidos`} className="text-sm font-semibold text-brand">
            Ver pedidos
          </Link>
        )}
      </div>

      <section className="rounded-brand bg-brand-surface p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">{isStamps ? "Sumar sello" : "Sumar puntos"}</h2>
        <ActionForm action={addLoyalty.bind(null, site.slug)}>
          <input name="code" defaultValue={code} required placeholder="CÓDIGO" className={input} />
          {isStamps ? (
            <input type="hidden" name="amount" value="1" />
          ) : (
            <input name="amount" type="number" min={1} required placeholder="Puntos" className={input} />
          )}
          <Button type="submit">{isStamps ? "+1 sello" : "Sumar"}</Button>
        </ActionForm>
      </section>

      {site.rewards.length > 0 && (
        <section className="rounded-brand bg-brand-surface p-5 shadow-sm">
          <h2 className="mb-3 font-semibold">Canjear recompensa</h2>
          <ActionForm action={redeemReward.bind(null, site.slug)}>
            <input name="code" defaultValue={code} required placeholder="CÓDIGO" className={input} />
            <select name="reward" required className={input.replace("font-mono uppercase tracking-widest", "")}>
              {site.rewards.map((reward) => (
                <option key={reward.id} value={reward.id}>
                  {reward.name} ({reward.cost})
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              Canjear
            </Button>
          </ActionForm>
        </section>
      )}
    </div>
  );
}
