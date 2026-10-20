"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

// Carrito del cliente final, guardado en su navegador por negocio. Nombre y
// precio son solo para mostrar: el pedido se cobra con los precios del catálogo.
// min/max: piezas mínimas y máximas por pedido de ese producto.
export type CartLine = { id: string; name: string; price: number; quantity: number; min?: number; max?: number };

type Cart = {
  lines: CartLine[];
  count: number;
  total: number;
  setQuantity: (product: Omit<CartLine, "quantity">, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);

export function useCart() {
  const cart = use(CartContext);
  if (!cart) throw new Error("useCart fuera de CartProvider");
  return cart;
}

export function CartProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const key = `moralink:carrito:${slug}`;
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el navegador
      if (Array.isArray(saved)) setLines(saved);
    } catch {}
  }, [key]);

  const save = useCallback(
    (next: CartLine[]) => {
      setLines(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
    },
    [key],
  );

  const cart = useMemo<Cart>(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      total: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      setQuantity: (product, quantity) => {
        const rest = lines.filter((l) => l.id !== product.id);
        // Por debajo del mínimo se quita del carrito; nunca pasa del máximo
        const q = quantity < (product.min ?? 1) ? 0 : Math.min(product.max ?? 99, quantity);
        const index = lines.findIndex((l) => l.id === product.id);
        if (q === 0) return save(rest);
        const line = { ...product, quantity: q };
        save(index === -1 ? [...lines, line] : lines.map((l) => (l.id === product.id ? line : l)));
      },
      clear: () => save([]),
    }),
    [lines, save],
  );

  return <CartContext value={cart}>{children}</CartContext>;
}

export function AddToCart({ product }: { product: Omit<CartLine, "quantity"> }) {
  const { lines, setQuantity } = useCart();
  const quantity = lines.find((l) => l.id === product.id)?.quantity ?? 0;

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => setQuantity(product, product.min ?? 1)}
        className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-brand-foreground active:scale-95"
      >
        Agregar
      </button>
    );
  }
  return (
    <Stepper quantity={quantity} max={product.max} onChange={(q) => setQuantity(product, q)} label={product.name} />
  );
}

export function Stepper({
  quantity,
  max = 99,
  onChange,
  label,
}: {
  quantity: number;
  max?: number;
  onChange: (quantity: number) => void;
  label: string;
}) {
  const button =
    "flex size-8 items-center justify-center rounded-full bg-brand text-lg font-bold text-brand-foreground active:scale-95 disabled:opacity-30";
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(quantity - 1)} className={button} aria-label={`Quitar ${label}`}>
        −
      </button>
      <span className="w-6 text-center font-semibold tabular-nums">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className={button}
        aria-label={`Agregar ${label}`}
      >
        +
      </button>
    </div>
  );
}

// Barra flotante con el total que lleva al pedido
export function CartBar({ slug }: { slug: string }) {
  const { count, total } = useCart();
  const pathname = usePathname();
  if (count === 0 || pathname.startsWith(`/${slug}/pedido`)) return null;
  return (
    <Link
      href={`/${slug}/pedido`}
      className="fixed bottom-5 left-5 right-24 z-10 flex sm:left-1/2 sm:right-auto sm:w-80 sm:-translate-x-1/2 items-center justify-between rounded-full bg-brand px-5 py-3 font-semibold text-brand-foreground shadow-xl"
    >
      <span className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-brand-foreground text-sm text-brand">
          {count}
        </span>
        Ver mi pedido
      </span>
      <span>{formatPrice(total)}</span>
    </Link>
  );
}
