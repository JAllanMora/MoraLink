import type { CSSProperties } from "react";

// Identidad de marca que cada negocio entrega. Se guarda en tenants.theme.
export type TenantTheme = {
  primary: string;
  primaryForeground: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  accent: string;
  fontDisplay: Font;
  // Texto corrido y botones
  fontBody: Font;
  // Nombres de productos y categorías (si no se da, la de títulos)
  fontAccent?: Font;
  radius: string;
};

export const FONTS = ["fraunces", "playfair", "cormorant", "poppins", "montserrat", "inter"] as const;
export type Font = (typeof FONTS)[number];

export const DEFAULT_THEME: TenantTheme = {
  primary: "#1F2937",
  primaryForeground: "#FFFFFF",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  foreground: "#111827",
  muted: "#6B7280",
  accent: "#059669",
  fontDisplay: "inter",
  fontBody: "inter",
  radius: "1rem",
};

export function resolveTheme(raw: unknown): TenantTheme {
  const theme = { ...DEFAULT_THEME, ...(raw && typeof raw === "object" ? raw : {}) } as TenantTheme;
  if (!FONTS.includes(theme.fontDisplay)) theme.fontDisplay = DEFAULT_THEME.fontDisplay;
  if (!FONTS.includes(theme.fontBody)) theme.fontBody = DEFAULT_THEME.fontBody;
  if (theme.fontAccent && !FONTS.includes(theme.fontAccent)) delete theme.fontAccent;
  return theme;
}

// Variables CSS que consumen las clases brand-* definidas en globals.css
export function themeStyle(theme: TenantTheme): CSSProperties {
  return {
    "--brand-primary": theme.primary,
    "--brand-primary-foreground": theme.primaryForeground,
    "--brand-background": theme.background,
    "--brand-surface": theme.surface,
    "--brand-foreground": theme.foreground,
    "--brand-muted": theme.muted,
    "--brand-accent": theme.accent,
    "--brand-radius": theme.radius,
    "--brand-font-display": `var(--font-${theme.fontDisplay})`,
    "--brand-font-body": `var(--font-${theme.fontBody})`,
    "--brand-font-accent": `var(--font-${theme.fontAccent ?? theme.fontDisplay})`,
  } as CSSProperties;
}
