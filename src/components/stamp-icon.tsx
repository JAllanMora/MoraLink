// Íconos de sello para la tarjeta. loyalty_programs.stamp_icon elige uno.
const ICONS: Record<string, React.ReactNode> = {
  pizza: (
    <>
      <path d="M12 21 3.5 6.5a15 15 0 0 1 17 0Z" />
      <path d="M5.2 9.3a12 12 0 0 1 13.6 0" />
      <circle cx="10" cy="11.5" r="1.2" />
      <circle cx="13.8" cy="13" r="1.2" />
      <circle cx="12" cy="16.5" r="1" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3v3M12 3v3" />
    </>
  ),
  burger: (
    <>
      <path d="M4 11a8 8 0 0 1 16 0Z" />
      <path d="M3 14h18" />
      <path d="M4 17h16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-9-9a4.7 4.7 0 0 1 9-2.5A4.7 4.7 0 0 1 21 11c-2 4.6-9 9-9 9Z" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z" />,
};

export function StampIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[name] ?? ICONS.star}
    </svg>
  );
}
