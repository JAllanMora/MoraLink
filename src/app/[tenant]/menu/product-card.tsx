"use client";

import { useState } from "react";
import { StampIcon } from "@/components/stamp-icon";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "../_components/cart";

// Un producto del catálogo; si tiene varias presentaciones (4 en bolsa / 4 en
// caja), cada una es una opción con su propio precio y reglas.
export type ProductGroup = {
  key: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  comingSoon: boolean;
  options: { id: string; name: string; label: string | null; price: number | null; min: number; max: number }[];
};

function ruleText(option: ProductGroup["options"][number]) {
  if (option.min > 1) return `Mínimo ${option.min} piezas`;
  if (option.max === 1) return "Una pieza por pedido";
  return null;
}

export function ProductCard({
  product,
  ordersEnabled,
  icon,
  logoUrl,
}: {
  product: ProductGroup;
  ordersEnabled: boolean;
  icon: string;
  // Sin foto se muestra el logo del negocio (o su ícono de sello)
  logoUrl: string | null;
}) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const option = product.options[selected] ?? product.options[0];
  const rule = option && ruleText(option);
  const long = (product.description?.length ?? 0) > 90;

  return (
    <article className="flex flex-col overflow-hidden rounded-brand bg-brand-surface shadow-sm">
      <div className="relative aspect-square">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- fotos del negocio, ya optimizadas
          <img src={product.imageUrl} alt={product.name} loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-brand-background text-brand/35">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- logo del negocio
              <img src={logoUrl} alt="" className="w-3/5 rounded-full opacity-90" />
            ) : (
              <StampIcon name={icon} className="size-14" />
            )}
          </div>
        )}
        {product.comingSoon && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-foreground">
            Próximamente
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-accent text-2xl font-semibold leading-tight">{product.name}</h3>
        {product.description && (
          <p className={`mt-1 text-sm text-brand-muted ${expanded ? "" : "line-clamp-3"}`}>{product.description}</p>
        )}
        {long && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1 self-start text-sm font-semibold text-brand"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}

        {!product.comingSoon && option && (
          <div className="mt-auto pt-3">
            {product.options.length > 1 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {product.options.map((o, i) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      i === selected ? "border-brand bg-brand text-brand-foreground" : "border-brand/30 text-brand-ink"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                {option.price != null && <p className="text-lg font-bold text-brand">{formatPrice(option.price)}</p>}
                {rule && <p className="text-xs text-brand-muted">{rule}</p>}
              </div>
              {ordersEnabled && option.price != null && (
                <AddToCart
                  key={option.id}
                  product={{ id: option.id, name: option.name, price: option.price, min: option.min, max: option.max }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
