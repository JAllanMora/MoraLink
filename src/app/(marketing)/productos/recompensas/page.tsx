import type { Metadata } from "next";
import { PhoneMockup } from "../../_components/phone-mockup";
import { ProductHero } from "../../_components/product-hero";
import { FeatureGrid, FinalCta, Steps } from "../../_components/sections";
import { DEMO_URL } from "../../_components/site";

export const metadata: Metadata = {
  title: "Programa de recompensas · MoraLink",
  description: "Tarjeta de lealtad digital con sellos o puntos para cualquier tipo de negocio.",
};

const FEATURES = [
  { icon: "users", title: "Fideliza a tus clientes", body: "Convierte visitas ocasionales en clientes frecuentes." },
  { icon: "gift", title: "Recompensas personalizadas", body: "Productos gratis, descuentos o promociones especiales." },
  { icon: "qr", title: "Fácil de usar", body: "Tus clientes escanean un código QR y empiezan a acumular." },
  { icon: "chart", title: "Adaptado a tu negocio", body: "Diseñamos el programa según tus productos y objetivos." },
] as const;

const MODES = [
  {
    title: "Tarjeta de sellos",
    body: "Un sello por visita o compra. Al completar la tarjeta, recompensa.",
    example: "5 cafés = 1 café gratis",
  },
  {
    title: "Puntos por compra",
    body: "Tus clientes acumulan puntos según lo que gastan y los cambian por premios.",
    example: "$10 = 1 punto · 100 puntos = postre gratis",
  },
];

const STEPS = [
  { title: "Tu cliente se une", body: "Escanea tu QR y se registra con su correo, sin descargar nada." },
  { title: "Acumula en cada compra", body: "Le sumas un sello o puntos desde tu celular escaneando su código." },
  { title: "Canjea y regresa", body: "Al completar su tarjeta canjea su recompensa y empieza otra." },
];

export default function RewardsProduct() {
  return (
    <>
      <ProductHero
        eyebrow="Programa de recompensas"
        before="Tus clientes frecuentes"
        highlight="merecen recompensas"
        intro="Una tarjeta de lealtad digital con tu marca, para cualquier tipo de negocio. Sin apps, sin tarjetas de cartón que se pierden y sin complicaciones para tu personal."
        message="Hola, me interesa el programa de recompensas de MoraLink"
        demo={DEMO_URL ? { href: DEMO_URL, label: "Ver un ejemplo" } : undefined}
        visual={<PhoneMockup />}
      />

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <FeatureGrid features={[...FEATURES]} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-center font-serif text-4xl font-bold">Tú decides cómo premiar</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {MODES.map((mode) => (
            <div key={mode.title} className="rounded-[2rem] bg-white p-7 shadow-sm">
              <h3 className="font-serif text-2xl font-bold">{mode.title}</h3>
              <p className="mt-2 text-ink/75">{mode.body}</p>
              <p className="mt-4 inline-block rounded-full bg-paper-dark px-4 py-1.5 text-sm font-semibold text-violet">
                {mode.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Steps title="Así funciona" steps={STEPS} />

      <FinalCta message="Hola, quiero el programa de recompensas de MoraLink">
        Haz que tus clientes <span className="font-script text-5xl text-violet">siempre regresen</span>
      </FinalCta>
    </>
  );
}
