import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatPrice } from "@/lib/format";
import { getTenantSite } from "@/lib/tenant/queries";

export default function MenuPage({ params }: PageProps<"/[tenant]/menu">) {
  return (
    <Suspense>
      <Menu params={params} />
    </Suspense>
  );
}

async function Menu({ params }: { params: PageProps<"/[tenant]/menu">["params"] }) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Menú</h1>

      {site.menu.length === 0 && <p className="text-brand-muted">Pronto publicaremos nuestro menú.</p>}

      {site.menu.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-4">
          <h2 className="mb-3 font-display text-xl font-bold text-brand">{category.name}</h2>
          <ul className="space-y-3">
            {category.products.map((product) => (
              <li key={product.id} className="flex gap-4 rounded-brand bg-brand-surface p-4 shadow-sm">
                {product.image_url && (
                  <span
                    className="size-20 shrink-0 rounded-brand bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.image_url})` }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{product.name}</p>
                    {product.price != null && (
                      <p className="shrink-0 font-semibold text-brand">{formatPrice(product.price)}</p>
                    )}
                  </div>
                  {product.description && <p className="mt-1 text-sm text-brand-muted">{product.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
