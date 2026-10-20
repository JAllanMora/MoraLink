"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { formatPrice } from "@/lib/format";
import { placeOrder, type OrderState } from "../actions";
import { Stepper, useCart } from "../_components/cart";

const input =
  "w-full rounded-brand border border-brand-muted/30 bg-brand-surface px-4 py-3 outline-none focus:border-brand";

export function CheckoutForm({
  slug,
  deliveryEnabled,
  address,
}: {
  slug: string;
  deliveryEnabled: boolean;
  address: string | null;
}) {
  const router = useRouter();
  const cart = useCart();
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [state, formAction, pending] = useActionState<OrderState, FormData>(placeOrder.bind(null, slug), null);

  useEffect(() => {
    if (state?.ok) {
      cart.clear();
      router.replace(`/${slug}/pedido/${state.token}`);
    }
    // Solo al recibir la respuesta del pedido
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (cart.count === 0 && !state?.ok) {
    return (
      <div className="space-y-4 rounded-brand bg-brand-surface p-6 text-center shadow-sm">
        <p className="text-brand-muted">Aún no agregas nada a tu pedido.</p>
        <Link href={`/${slug}/menu`} className="font-semibold text-brand">
          Ver el menú
        </Link>
      </div>
    );
  }

  const items = JSON.stringify(cart.lines.map((l) => ({ product_id: l.id, quantity: l.quantity })));

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-brand bg-brand-surface p-4 shadow-sm">
        <ul className="divide-y divide-brand-muted/15">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">{line.name}</p>
                <p className="text-sm text-brand-muted">{formatPrice(line.price * line.quantity)}</p>
              </div>
              <Stepper quantity={line.quantity} onChange={(q) => cart.setQuantity(line, q)} label={line.name} />
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-brand-muted/15 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
        <Link href={`/${slug}/menu`} className="mt-2 inline-block text-sm font-semibold text-brand">
          + Agregar más
        </Link>
      </section>

      <fieldset disabled={pending} className="space-y-3">
        <input type="hidden" name="items" value={items} />
        <input name="name" required maxLength={120} autoComplete="name" placeholder="Tu nombre" className={input} />
        <input
          name="phone"
          type="tel"
          required
          maxLength={30}
          autoComplete="tel"
          placeholder="Tu teléfono (WhatsApp)"
          className={input}
        />

        {deliveryEnabled && (
          <div className="grid grid-cols-2 gap-2">
            {(["pickup", "delivery"] as const).map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-brand border-2 px-3 py-3 text-center font-semibold ${
                  delivery === option ? "border-brand bg-brand/10 text-brand" : "border-brand-muted/20"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={option}
                  checked={delivery === option}
                  onChange={() => setDelivery(option)}
                  className="sr-only"
                />
                {option === "pickup" ? "Paso a recoger" : "Envío a domicilio"}
              </label>
            ))}
          </div>
        )}
        {delivery === "pickup" && address && <p className="text-sm text-brand-muted">Recoges en: {address}</p>}
        {delivery === "delivery" && (
          <textarea
            name="address"
            required
            maxLength={400}
            rows={2}
            autoComplete="street-address"
            placeholder="Dirección de entrega"
            className={input}
          />
        )}
        <textarea
          name="notes"
          maxLength={1000}
          rows={2}
          placeholder="Notas (opcional): sin cebolla, hora de entrega…"
          className={input}
        />

        <Button type="submit">{pending ? "Enviando…" : `Enviar pedido · ${formatPrice(cart.total)}`}</Button>
      </fieldset>

      {state && !state.ok && (
        <p role="status" className="rounded-brand bg-red-100 p-3 text-sm font-medium text-red-800">
          {state.message}
        </p>
      )}
    </form>
  );
}
