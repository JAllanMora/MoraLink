import { Icon, type IconName } from "./icons";
import { WHATSAPP, whatsappUrl } from "./site";

// Bloques que comparten el inicio y las páginas de producto

export function WhatsAppButton({ text, label = "Quiero MoraLink" }: { text: string; label?: string }) {
  return (
    <a
      href={whatsappUrl(text)}
      className="flex items-center justify-center gap-2 rounded-full bg-basil px-6 py-3.5 font-semibold text-white shadow-lg shadow-basil/25 transition hover:brightness-110"
    >
      <Icon name="whatsapp" className="size-5" />
      {label}
    </a>
  );
}

const PASTELS = [
  "bg-[#F7D9EC] text-[#A3307A]",
  "bg-[#E6DAF8] text-violet",
  "bg-[#FCEBC7] text-[#9A5B00]",
  "bg-[#D8EFE6] text-[#1F6B52]",
];

export function FeatureGrid({ features }: { features: { icon: IconName; title: string; body: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <li key={feature.title} className="flex items-start gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm">
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-full ${PASTELS[index % PASTELS.length]}`}
          >
            <Icon name={feature.icon} className="size-7" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-bold leading-tight">{feature.title}</h3>
            <p className="mt-1 text-sm text-ink/75">{feature.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ title, steps }: { title: string; steps: { title: string; body: string }[] }) {
  return (
    <section className="bg-ink py-20 text-paper">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-center font-serif text-4xl font-bold">{title}</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
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
  );
}

export function FinalCta({ children, message }: { children: React.ReactNode; message: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 text-center">
      <h2 className="mx-auto max-w-2xl font-serif text-4xl font-bold">{children}</h2>
      <a
        href={whatsappUrl(message)}
        className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full bg-basil px-7 py-4 text-left text-white shadow-lg shadow-basil/25 transition hover:brightness-110"
      >
        <Icon name="whatsapp" className="size-8" />
        <span>
          <span className="block text-lg font-bold leading-tight">¡Escríbenos!</span>
          <span className="block text-sm opacity-90">{WHATSAPP}</span>
        </span>
      </a>
    </section>
  );
}

// Título con la palabra resaltada en "pincelada" morada
export function BrushTitle({ before, highlight }: { before: string; highlight: string }) {
  return (
    <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
      {before}
      <span className="relative mt-3 block w-fit">
        <span className="absolute inset-x-[-0.4em] inset-y-[0.05em] -rotate-2 rounded-[1.2rem_0.6rem_1.4rem_0.5rem] bg-violet" />
        <span className="relative whitespace-nowrap font-script text-[2.6rem] font-bold text-white sm:text-7xl">
          {highlight}
        </span>
      </span>
    </h1>
  );
}
