import type { Metadata } from "next";
import { BrowserMockup } from "../../_components/browser-mockup";
import { ProductHero } from "../../_components/product-hero";
import { FeatureGrid, FinalCta, Steps } from "../../_components/sections";

export const metadata: Metadata = {
  title: "Página web · MoraLink",
  description: "La página de tu negocio con tu marca, tu propio enlace y botón directo a WhatsApp.",
};

const FEATURES = [
  { icon: "store", title: "Tu propio enlace", body: "moralink.app/tu-negocio, fácil de recordar y de compartir." },
  { icon: "chart", title: "Con tu marca", body: "Tu logo, tus colores y tus fotos en cada sección." },
  { icon: "qr", title: "Perfecta en celular", body: "Se ve bien en cualquier teléfono, que es donde te buscan." },
  { icon: "whatsapp", title: "Directo a WhatsApp", body: "Tus clientes te escriben con un toque, sin guardar tu número." },
] as const;

const INCLUDES = [
  "Portada con tu logo, tu frase y fotos de tu negocio",
  "Tus servicios o productos principales",
  "Ubicación con mapa, horario y teléfono",
  "Tus redes sociales y botón de WhatsApp",
  "Cambios cuando los necesites, nosotros los hacemos",
];

const STEPS = [
  { title: "Nos mandas tu información", body: "Logo, fotos, horario, ubicación y lo que quieras contar." },
  { title: "La diseñamos", body: "Armamos tu página con tu identidad y te la mostramos para que la apruebes." },
  { title: "La compartes", body: "Ponla en tu Instagram, en tu Google Maps y en tu estado de WhatsApp." },
];

export default function WebsiteProduct() {
  return (
    <>
      <ProductHero
        eyebrow="Página web"
        before="Tu negocio en internet"
        highlight="con tu marca"
        intro="Una página profesional para que tus clientes te encuentren, sepan qué ofreces y te escriban. Sin pagar hosting, sin aprender a programar y sin preocuparte por el mantenimiento."
        message="Hola, me interesa la página web de MoraLink"
        visual={<BrowserMockup />}
      />

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <FeatureGrid features={[...FEATURES]} />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <div className="rounded-[2rem] bg-violet p-8 text-white">
          <h2 className="font-serif text-3xl font-bold">Qué incluye tu página</h2>
          <ul className="mt-6 space-y-3">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 font-medium">
                <span className="mt-1 size-2.5 shrink-0 rounded-full bg-mango" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Steps title="Así de fácil" steps={STEPS} />

      <FinalCta message="Hola, quiero mi página web con MoraLink">
        Que te encuentren <span className="font-script text-5xl text-violet">a la primera</span>
      </FinalCta>
    </>
  );
}
