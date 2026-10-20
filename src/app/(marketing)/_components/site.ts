import type { IconName } from "@/components/icons";

export const WHATSAPP = (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "+52 55 1732 7009").trim();

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

// Negocio que se muestra como ejemplo en las páginas de producto (null = sin ejemplo)
export const DEMO_URL: string | null = "/la-dolce-vita";

export const PRODUCTS: { href: string; icon: IconName; title: string; summary: string }[] = [
  {
    href: "/productos/recompensas",
    icon: "gift",
    title: "Programa de recompensas",
    summary: "Tarjeta de lealtad digital con sellos o puntos para que tus clientes regresen.",
  },
  {
    href: "/productos/pagina-web",
    icon: "store",
    title: "Página web",
    summary: "Tu negocio en internet con tu marca, tu propio enlace y botón a WhatsApp.",
  },
  {
    href: "/productos/catalogo",
    icon: "catalog",
    title: "Catálogo de productos",
    summary: "Tu menú o tus productos con fotos y precios, siempre al día y fácil de compartir.",
  },
];
