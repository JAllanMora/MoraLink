// Estados de un pedido, en el orden en que avanza
export const ORDER_STATUS = {
  nuevo: { label: "Recibido", next: "preparando", action: "Empezar a preparar" },
  preparando: { label: "Preparando", next: "listo", action: "Marcar listo" },
  listo: { label: "Listo", next: "entregado", action: "Marcar entregado" },
  entregado: { label: "Entregado", next: null, action: null },
  cancelado: { label: "Cancelado", next: null, action: null },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

export const ORDER_STEPS: OrderStatus[] = ["nuevo", "preparando", "listo", "entregado"];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && value in ORDER_STATUS;
}
