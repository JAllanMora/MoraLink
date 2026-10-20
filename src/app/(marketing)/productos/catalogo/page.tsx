import type { Metadata } from "next";
import { CatalogMockup } from "../../_components/phone-mockup";
import { ProductHero } from "../../_components/product-hero";
import { FeatureGrid, FinalCta, Steps } from "../../_components/sections";
import { DEMO_URL } from "../../_components/site";

export const metadata: Metadata = {
  title: "Catálogo de productos · MoraLink",
  description: "Tu menú o tus productos con fotos y precios, siempre al día y fácil de compartir.",
};

const FEATURES = [
  { icon: "catalog", title: "Por categorías", body: "Ordenado como tú vendes: pizzas, bebidas, servicios, tallas." },
  { icon: "gift", title: "Fotos y precios", body: "Cada producto con su foto, descripción y precio claro." },
  { icon: "chart", title: "Siempre al día", body: "¿Cambiaste un precio o se acabó algo? Lo actualizamos." },
  { icon: "qr", title: "Compártelo con un QR", body: "En tus mesas, tu mostrador, tus redes o por WhatsApp." },
] as const;

const USES = [
  { title: "Menú digital", body: "Para restaurantes, cafeterías y taquerías. Adiós a las cartas impresas." },
  { title: "Catálogo de tienda", body: "Para boutiques, papelerías o tiendas de regalos que venden por WhatsApp." },
  { title: "Lista de servicios", body: "Para barberías, estéticas o talleres con sus servicios y precios." },
];

const STEPS = [
  { title: "Nos mandas tu lista", body: "Tus productos con precios, en Excel, foto o como lo tengas." },
  { title: "Lo armamos", body: "Lo ordenamos por categorías con tu marca y tus fotos." },
  { title: "Lo compartes", body: "Con un enlace y un código QR listo para imprimir." },
];

export default function CatalogProduct() {
  return (
    <>
      <ProductHero
        eyebrow="Catálogo de productos"
        before="Todo lo que vendes,"
        highlight="siempre a la mano"
        intro="Tu menú, tus productos o tus servicios con fotos y precios en un solo enlace. Tus clientes lo abren desde su celular y saben qué pedir antes de llegar."
        message="Hola, me interesa el catálogo de productos de MoraLink"
        demo={DEMO_URL ? { href: `${DEMO_URL}/menu`, label: "Ver un ejemplo" } : undefined}
        visual={<CatalogMockup />}
      />

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <FeatureGrid features={[...FEATURES]} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-center font-serif text-4xl font-bold">Para cualquier tipo de negocio</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {USES.map((use) => (
            <div key={use.title} className="rounded-[2rem] bg-white p-7 shadow-sm">
              <h3 className="font-serif text-2xl font-bold">{use.title}</h3>
              <p className="mt-2 text-ink/75">{use.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Steps title="Así de fácil" steps={STEPS} />

      <FinalCta message="Hola, quiero mi catálogo de productos con MoraLink">
        Tus productos, <span className="font-script text-5xl text-violet">a un clic</span>
      </FinalCta>
    </>
  );
}
