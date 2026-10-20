import Link from "next/link";
import { BrushTitle, WhatsAppButton } from "./sections";

// Portada de cada página de producto
export function ProductHero({
  eyebrow,
  before,
  highlight,
  intro,
  message,
  demo,
  visual,
}: {
  eyebrow: string;
  before: string;
  highlight: string;
  intro: string;
  message: string;
  demo?: { href: string; label: string };
  visual: React.ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-6 md:grid-cols-[1.15fr_1fr] md:pt-12">
      <div>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-violet">{eyebrow}</p>
        <BrushTitle before={before} highlight={highlight} />
        <p className="mt-8 max-w-xl text-lg text-ink/80">{intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton text={message} />
          {demo && (
            <Link
              href={demo.href}
              className="flex items-center justify-center rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:bg-ink hover:text-paper"
            >
              {demo.label}
            </Link>
          )}
        </div>
      </div>
      {visual}
    </section>
  );
}
