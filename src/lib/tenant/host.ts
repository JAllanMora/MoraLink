// Dominio raíz donde viven los negocios: <slug>.<ROOT_DOMAIN>.
// En local: <slug>.localhost:3000 (Chrome y Firefox lo resuelven solos).
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

// Subdominios que nunca son negocios
const RESERVED = new Set(["www", "app", "admin", "api"]);

export function tenantSlugFromHost(host: string | null): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  const root = ROOT_DOMAIN.split(":")[0].toLowerCase();

  if (!hostname.endsWith(`.${root}`)) return null;
  const subdomain = hostname.slice(0, -(root.length + 1));
  if (!subdomain || subdomain.includes(".") || RESERVED.has(subdomain)) return null;
  return subdomain;
}

export function tenantUrl(slug: string, path = "/") {
  const protocol = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${slug}.${ROOT_DOMAIN}${path}`;
}
