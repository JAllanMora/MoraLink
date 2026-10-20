// Logo de MoraLink: una "m" de dos arcos enlazados y un punto de recompensa.
// La misma figura está en src/app/icon.svg (favicon).
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="16" className="fill-violet" />
      <path
        d="M15 44V27a8.5 8.5 0 0 1 17 0v17M32 27a8.5 8.5 0 0 1 17 0v17"
        fill="none"
        stroke="#fff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="14" r="5" className="fill-mango" />
    </svg>
  );
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
