import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StampIcon } from "@/components/stamp-icon";
import { pluralize } from "@/lib/format";
import { getCurrentCard } from "@/lib/tenant/customer";
import { getTenantSite, type TenantSite } from "@/lib/tenant/queries";

export default function RewardsPage({ params }: PageProps<"/s/[tenant]/recompensas">) {
  return (
    <Suspense>
      <Rewards params={params} />
    </Suspense>
  );
}

async function Rewards({ params }: { params: PageProps<"/s/[tenant]/recompensas">["params"] }) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Recompensas</h1>
      {site.program?.description && <p className="text-brand-muted">{site.program.description}</p>}
      <Suspense fallback={<RewardList site={site} balance={null} />}>
        <RewardListWithBalance site={site} />
      </Suspense>
    </div>
  );
}

async function RewardListWithBalance({ site }: { site: TenantSite }) {
  const current = await getCurrentCard(site.id);
  return <RewardList site={site} balance={current?.card?.balance ?? null} />;
}

function RewardList({ site, balance }: { site: TenantSite; balance: number | null }) {
  const [one, many] = site.program?.type === "points" ? ["punto", "puntos"] : ["sello", "sellos"];

  return (
    <>
      {balance != null && (
        <p className="rounded-brand bg-brand p-4 text-center font-semibold text-brand-foreground">
          Tienes {pluralize(balance, one, many)}
        </p>
      )}
      <ul className="space-y-3">
        {site.rewards.map((reward) => {
          const unlocked = balance != null && balance >= reward.cost;
          return (
            <li key={reward.id} className="flex items-center gap-4 rounded-brand bg-brand-surface p-4 shadow-sm">
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                  unlocked ? "bg-brand text-brand-foreground" : "bg-brand-background text-brand"
                }`}
              >
                <StampIcon name={site.program?.stamp_icon ?? "star"} className="size-7" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">{reward.name}</p>
                {reward.description && <p className="text-sm text-brand-muted">{reward.description}</p>}
              </div>
              <span className={`text-sm font-semibold ${unlocked ? "text-brand-accent" : "text-brand-muted"}`}>
                {unlocked ? "¡Disponible!" : pluralize(reward.cost, one, many)}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
