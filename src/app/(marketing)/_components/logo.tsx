import Image from "next/image";

// Logo de MoraLink: una mora. El mismo dibujo está en src/app/icon.svg (favicon).
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/logo-mora.svg" alt="" width={64} height={64} className={className} unoptimized />;
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark className="size-9" />
      <span className={`font-serif text-2xl font-extrabold ${inverted ? "text-white" : "text-ink"}`}>
        Mora<span className={inverted ? "text-lilac" : "text-violet"}>Link</span>
      </span>
    </span>
  );
}
