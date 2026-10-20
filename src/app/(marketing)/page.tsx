import Link from "next/link";
import { HeroCollage } from "./_components/hero-collage";
import { Icon, type IconName } from "./_components/icons";
import { BrushTitle, FinalCta, Steps, WhatsAppButton } from "./_components/sections";
import { PRODUCTS } from "./_components/site";

// Inicio de moralink.app: quiénes somos y los tres productos
const BUSINESSES = ["Restaurantes", "Cafeterías", "Barberías", "Estéticas", "Tiendas", "Gimnasios", "Panaderías", "Taquerías"];

const VALUES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "store",
    title: "Hecho para negocios locales",
    body: "Herramientas que antes solo tenían las grandes cadenas, a un precio mensual accesible.",
  },
  {
    icon: "chart",
    title: "Todo con tu marca",
    body: "Tu logo, tus colores y tu estilo. Tus clientes ven tu negocio, no el nuestro.",
  },
  {
    icon: "users",
    title: "Nosotros nos encargamos",
    body: "Lo configuramos, lo actualizamos y te acompañamos. Tú solo atiendes a tus clientes.",
  },
];

const STEPS = [
  { title: "Platicamos", body: "Nos cuentas de tu negocio y eliges los productos que te sirven." },
  { title: "Lo armamos", body: "Con tu logo, colores, productos y precios, en tu propio enlace." },
  { title: "Lo compartes", body: "En redes, en WhatsApp o con un QR en tu mostrador." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-6 md:grid-cols-[1.1fr_1fr] md:pt-12">
        <div>
          <BrushTitle before="Todo tu negocio" highlight="en un solo link" />
          <p className="mt-8 max-w-xl text-lg text-ink/80">
            En MoraLink creamos la presencia digital de tu negocio: un programa de recompensas para que tus clientes
            regresen, tu página web y tu catálogo de productos. Todo con tu marca y listo para compartir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#productos"
              className="flex items-center justify-center rounded-full bg-violet px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet/25 transition hover:brightness-110"
            >
              Conoce los productos
            </a>
            <WhatsAppButton text="Hola, quiero información de MoraLink" label="Escríbenos" />
          </div>
        </div>
        <HeroCollage />
      </section>

      <section className="border-y border-ink/10 bg-paper-dark/60 py-5">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-5 text-sm font-semibold text-ink/70">
          <li className="text-ink">Para cualquier negocio:</li>
          {BUSINESSES.map((business) => (
            <li key={business}>{business}</li>
          ))}
        </ul>
      </section>

      <section id="productos" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-20">
        <h2 className="text-center font-serif text-4xl font-bold">Nuestros productos</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink/75">
          Contrata uno o combínalos. Pagas una mensualidad y nosotros nos encargamos de todo.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group flex flex-col rounded-[2rem] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet/10"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-violet text-white">
                <Icon name={product.icon} className="size-7" />
              </span>
              <h3 className="mt-5 font-serif text-2xl font-bold">{product.title}</h3>
              <p className="mt-2 flex-1 text-ink/75">{product.summary}</p>
              <span className="mt-6 font-semibold text-violet group-hover:underline">Conocer más →</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="nosotros" className="scroll-mt-6 bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-violet">Quiénes somos</p>
            <h2 className="mt-3 font-serif text-4xl font-bold">Conectamos a tu negocio con sus clientes</h2>
            <p className="mt-5 text-lg text-ink/80">
              MoraLink nace para que restaurantes, cafeterías, tiendas y todo tipo de negocios locales tengan su
              lugar en internet sin complicarse. Juntamos en un solo enlace lo que tus clientes buscan: qué vendes,
              cómo encontrarte y una razón para volver.
            </p>
            <p className="mt-4 font-script text-3xl text-violet">Más clientes, más pedidos y una comunidad que siempre regresa ♥</p>
          </div>
          <ul className="space-y-4">
            {VALUES.map((value) => (
              <li key={value.title} className="flex items-start gap-4 rounded-[1.75rem] bg-paper p-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E6DAF8] text-violet">
                  <Icon name={value.icon} className="size-6" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold">{value.title}</h3>
                  <p className="mt-1 text-ink/75">{value.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Steps title="Cómo trabajamos" steps={STEPS} />

      <FinalCta message="Hola, quiero MoraLink para mi negocio">
        Lleva tu negocio a <span className="font-script text-5xl text-violet">un solo link</span>
      </FinalCta>
    </>
  );
}
