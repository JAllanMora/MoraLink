import Link from "next/link";
import { Logo } from "./_components/logo";
import { PRODUCTS, whatsappUrl } from "./_components/site";

// Marco del sitio de MoraLink: inicio y páginas de producto
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <Link href="/" aria-label="MoraLink inicio">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {PRODUCTS.map((product) => (
            <Link key={product.href} href={product.href} className="hover:text-violet">
              {product.title}
            </Link>
          ))}
          <Link href="/#nosotros" className="hover:text-violet">
            Nosotros
          </Link>
        </nav>
        <a
          href={whatsappUrl("Hola, quiero información de MoraLink")}
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-violet"
        >
          Contáctanos
        </a>
      </header>

      <main>{children}</main>

      <footer className="border-t border-ink/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-sm text-ink/60">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold text-ink/80">
            {PRODUCTS.map((product) => (
              <Link key={product.href} href={product.href} className="hover:text-violet">
                {product.title}
              </Link>
            ))}
          </nav>
          <p>© 2026 MoraLink · Recompensas, páginas web y catálogos para tu negocio</p>
        </div>
      </footer>
    </div>
  );
}
