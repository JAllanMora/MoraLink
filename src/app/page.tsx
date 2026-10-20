import Link from "next/link";
import { Icon, type IconName } from "./_landing/icons";
import { Logo } from "./_landing/logo";
import { PhoneMockup } from "./_landing/phone-mockup";

// Landing de MoraLink en moralink.app
const WHATSAPP = (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "+52 55 1732 7009").trim();
const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
const DEMO_URL = "/la-pizzeria";

const BUSINESSES = ["Restaurantes", "Cafeterías", "Barberías", "Estéticas", "Tiendas", "Gimnasios", "Panaderías", "Taquerías"];

const FEATURES: { icon: IconName; color: string; title: string; body: string }[] = [
  {
    icon: "users",
    color: "bg-[#F7D9EC] text-[#A3307A]",
    title: "Fideliza a tus clientes",
    body: "Convierte visitas ocasionales en clientes frecuentes.",
  },
  {
    icon: "gift",
    color: "bg-[#E6DAF8] text-violet",
    title: "Recompensas personalizadas",
    body: "Productos gratis, descuentos o promociones especiales.",
  },
  {
    icon: "qr",
    color: "bg-[#FCEBC7] text-[#9A5B00]",
    title: "Fácil de usar",
    body: "Tus clientes escanean un código QR y empiezan a acumular.",
  },
  {
    icon: "chart",
    color: "bg-[#D8EFE6] text-[#1F6B52]",
    title: "Adaptado a tu negocio",
    body: "Diseñamos el programa según tus productos y objetivos.",
  },
];

const PRODUCTS: { icon: IconName; title: string; body: string; points: string[] }[] = [
  {
    icon: "gift",
    title: "Programa de recompensas",
    body: "Una tarjeta de lealtad digital para cualquier negocio, sin apps ni tarjetas de cartón.",
    points: [
      "Tarjeta de sellos o puntos con tu marca",
      "Código QR personal para cada cliente",
      "Caja desde el celular para sumar y canjear",
      "Recompensas que tú decides",
    ],
  },
  {
    icon: "store",
    title: "Página web",
    body: "Tu negocio en internet con tu propio enlace, listo para compartir en redes y en WhatsApp.",
    points: [
      "Tu página en moralink.app/tu-negocio",
      "Tu logo, tus colores y tus fotos",
      "Ubicación, horario y redes sociales",
      "Botón directo a tu WhatsApp",
    ],
  },
  {
    icon: "catalog",
    title: "Catálogo de productos",
    body: "Tu menú o tus productos siempre al día, para que tus clientes vean todo lo que ofreces.",
    points: [
      "Productos por categorías con fotos y precios",
      "Ideal para menús, tiendas y servicios",
      "Lo actualizamos cuando cambies precios",
      "Compártelo con un enlace o un QR",
    ],
  },
];

const STEPS = [
  { title: "Nos mandas tu marca", body: "Logo, colores, tus productos y la recompensa que quieres dar." },
  { title: "Armamos tu página", body: "En pocos días queda lista con tu enlace propio y tu código QR." },
  { title: "Tus clientes regresan", body: "Escanean, acumulan y vuelven por su recompensa." },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" aria-label="MoraLink">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <a href="#servicios" className="hover:text-violet">Servicios</a>
          <a href="#como-funciona" className="hover:text-violet">Cómo funciona</a>
          <Link href={DEMO_URL} className="hover:text-violet">Ver demo</Link>
        </nav>
        <a
          href={whatsappUrl("Hola, quiero información de MoraLink")}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-basil"
        >
          Contáctanos
        </a>
      </header>

      <main>
        {/* Portada */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-6 md:grid-cols-[1.15fr_1fr] md:pt-12">
          <div>
            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Tus clientes frecuentes
              <span className="relative mt-3 block w-fit">
                <span className="absolute inset-x-[-0.4em] inset-y-[0.05em] -rotate-2 rounded-[1.2rem_0.6rem_1.4rem_0.5rem] bg-violet" />
                <span className="relative whitespace-nowrap font-script text-[2.6rem] font-bold text-white sm:text-7xl">
                  merecen recompensas
                </span>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-ink/80">
              Programa de recompensas, página web y catálogo de productos para tu negocio. Con tu marca, en tu
              propio enlace y sin que tus clientes descarguen nada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl("Hola, quiero MoraLink para mi negocio")}
                className="flex items-center justify-center gap-2 rounded-full bg-basil px-6 py-3.5 font-semibold text-white shadow-lg shadow-basil/25 transition hover:brightness-110"
              >
                <Icon name="whatsapp" className="size-5" />
                Quiero MoraLink
              </a>
              <Link
                href={DEMO_URL}
                className="flex items-center justify-center rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:bg-ink hover:text-paper"
              >
                Ver un ejemplo
              </Link>
            </div>
            <p className="mt-10 max-w-sm -rotate-2 font-script text-3xl leading-tight text-ink/90">
              Más clientes, más pedidos y una comunidad que siempre regresa{" "}
              <span className="text-violet">♥</span>
            </p>
          </div>
          <PhoneMockup />
        </section>

        {/* Tipos de negocio */}
        <section className="border-y border-ink/10 bg-paper-dark/60 py-5">
          <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-5 text-sm font-semibold text-ink/70">
            <li className="text-ink">Para cualquier negocio:</li>
            {BUSINESSES.map((business) => (
              <li key={business}>{business}</li>
            ))}
          </ul>
        </section>

        {/* Productos */}
        <section id="servicios" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-20">
          <h2 className="text-center font-serif text-4xl font-bold">Tres formas de hacer crecer tu negocio</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-ink/75">
            Contrata uno o combínalos. Pagas una mensualidad y nosotros nos encargamos de todo.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PRODUCTS.map((product, index) => {
              const featured = index === 0;
              return (
                <article
                  key={product.title}
                  className={`rounded-[2rem] p-7 shadow-sm ${featured ? "bg-violet text-white" : "bg-white"}`}
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-full ${
                      featured ? "bg-white text-violet" : "bg-paper-dark text-violet"
                    }`}
                  >
                    <Icon name={product.icon} className="size-6" />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-bold">{product.title}</h3>
                  <p className={`mt-2 ${featured ? "text-white/85" : "text-ink/75"}`}>{product.body}</p>
                  <ul className="mt-6 space-y-3">
                    {product.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 font-medium">
                        <Icon
                          name="check"
                          className={`mt-0.5 size-5 shrink-0 ${featured ? "text-mango" : "text-violet"}`}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Beneficios */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm">
                <span className={`flex size-14 shrink-0 items-center justify-center rounded-full ${feature.color}`}>
                  <Icon name={feature.icon} className="size-7" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold leading-tight">{feature.title}</h3>
                  <p className="mt-1 text-sm text-ink/75">{feature.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="scroll-mt-6 bg-ink py-20 text-paper">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-center font-serif text-4xl font-bold">Así de fácil</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="text-center">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet font-serif text-2xl font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-paper/75">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Llamado final */}
        <section className="mx-auto max-w-6xl px-5 py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-bold">
            Haz que tus clientes <span className="font-script text-5xl text-violet">siempre regresen</span>
          </h2>
          <a
            href={whatsappUrl("Hola, quiero MoraLink para mi negocio")}
            className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full bg-basil px-7 py-4 text-left text-white shadow-lg shadow-basil/25 transition hover:brightness-110"
          >
            <Icon name="whatsapp" className="size-8" />
            <span>
              <span className="block text-lg font-bold leading-tight">¡Escríbenos!</span>
              <span className="block text-sm opacity-90">{WHATSAPP}</span>
            </span>
          </a>
        </section>
      </main>

      <footer className="flex flex-col items-center gap-3 border-t border-ink/10 py-8 text-sm text-ink/60">
        <Logo />
        <p>© 2026 MoraLink · Recompensas, páginas web y catálogos para tu negocio</p>
      </footer>
    </div>
  );
}
