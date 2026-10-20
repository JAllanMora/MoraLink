import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTenantSite, type TenantSite } from "@/lib/tenant/queries";
import { ProductCard, type ProductGroup } from "./product-card";

export default function MenuPage({ params }: PageProps<"/[tenant]/menu">) {
  return (
    <Suspense>
      <Menu params={params} />
    </Suspense>
  );
}

// Junta las presentaciones de un mismo producto en una sola tarjeta
function groupProducts(products: TenantSite["menu"][number]["products"]): ProductGroup[] {
  const groups = new Map<string, ProductGroup>();
  for (const p of products) {
    const key = p.group_name ?? p.id;
    const group = groups.get(key) ?? {
      key,
      name: p.group_name ?? p.name,
      description: p.description,
      imageUrl: p.image_url,
      comingSoon: p.coming_soon,
      options: [],
    };
    group.imageUrl ??= p.image_url;
    group.options.push({
      id: p.id,
      name: p.name,
      label: p.variant,
      price: p.price,
      min: p.min_quantity,
      max: p.max_quantity,
    });
    groups.set(key, group);
  }
  return [...groups.values()];
}

async function Menu({ params }: { params: PageProps<"/[tenant]/menu">["params"] }) {
  const site = await getTenantSite((await params).tenant);
  if (!site) notFound();
  const icon = site.program?.stamp_icon ?? "star";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Menú</h1>
        {site.orders_enabled && (
          <p className="mt-1 text-brand-muted">Agrega lo que se te antoje y envíanos tu pedido.</p>
        )}
      </div>

      {site.menu.length === 0 && <p className="text-brand-muted">Pronto publicaremos nuestro menú.</p>}

      {site.menu.length > 1 && (
        <nav className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {site.menu.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="whitespace-nowrap rounded-full bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-ink shadow-sm"
            >
              {category.name}
            </a>
          ))}
        </nav>
      )}

      {site.menu.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-4">
          <h2 className="font-accent text-3xl font-bold text-brand">{category.name}</h2>
          {category.description && <p className="mt-1 text-sm text-brand-muted">{category.description}</p>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {groupProducts(category.products).map((product) => (
              <ProductCard
                key={product.key}
                product={product}
                ordersEnabled={site.orders_enabled}
                icon={icon}
                logoUrl={site.logo_url}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
