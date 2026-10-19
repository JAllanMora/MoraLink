# MoraLink

Programas de lealtad y catálogo digital para negocios (restaurantes, cafeterías, tiendas), con la marca de cada negocio y en su propio enlace: `https://<negocio>.moralink.app`.

Cada negocio paga una mensualidad y recibe:

- **Su página con su marca**: logo, colores y tipografía.
- **Su menú o catálogo** por categorías.
- **Su programa de recompensas**: tarjeta de sellos (ej. 5 pizzas = 1 gratis) o puntos por compra.
- **Tarjeta digital para sus clientes** con código QR, sin descargar apps.
- **Caja** para que el personal sume sellos y canjee recompensas.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) desplegado en [Vercel](https://vercel.com)
- [Supabase](https://supabase.com): Postgres con RLS y Auth (enlace mágico por correo)
- Tailwind CSS 4

## Cómo funciona el multi-negocio

```
la-pizzeria.moralink.app/menu  ──proxy──▶  /s/la-pizzeria/menu
moralink.app                   ─────────▶  landing de MoraLink
```

- `src/proxy.ts` lee el subdominio y reescribe la ruta a `src/app/s/[tenant]/…`. También refresca la sesión de Supabase.
- `getTenantSite(slug)` (`src/lib/tenant/queries.ts`) trae marca, menú, programa y recompensas en una lectura cacheada.
- El layout del negocio aplica sus colores como variables CSS (`src/lib/tenant/theme.ts`), y los componentes usan clases `bg-brand`, `text-brand-ink`, `rounded-brand`, `font-display`, etc.
- Todo dato lleva `tenant_id` y está protegido con RLS (`supabase/migrations/`).

## Estructura

```
clientes/                 Un JSON por negocio: marca, programa, recompensas y menú
scripts/cargar-cliente.mjs  Carga o actualiza un negocio desde su JSON
supabase/migrations/      Esquema de base de datos
src/proxy.ts              Subdominio → negocio
src/app/page.tsx          Landing de MoraLink
src/app/s/[tenant]/       Sitio de cada negocio
  page.tsx                Inicio: progreso, recompensa principal, categorías
  menu/                   Catálogo
  recompensas/            Recompensas y cuáles ya puede canjear el cliente
  entrar/                 Acceso con enlace por correo
  mi-tarjeta/             QR y código del cliente
  caja/                   Panel del personal (sumar sellos, canjear)
  auth/callback/          Destino del enlace de acceso
src/lib/tenant/           Subdominios, tema, lecturas del negocio y del cliente
src/lib/supabase/         Clientes de Supabase y tipos generados
```

## Desarrollo local

Requiere Node 22 y Docker.

```bash
npm install
npx supabase start            # Postgres, Auth y Mailpit locales
cp .env.example .env.local    # pega las llaves que imprime `npx supabase status`
npm run cliente:cargar -- clientes/la-pizzeria.json --duenio tu@correo.com
npm run dev
```

- Abre <http://la-pizzeria.localhost:3000> (Chrome y Firefox resuelven `*.localhost` solos).
- Los correos de acceso llegan a Mailpit: <http://127.0.0.1:54324>.
- Entra con el correo del dueño y ve a `/caja` para sumar sellos.
- Tras cambiar el esquema: `npx supabase migration new <nombre>`, `npx supabase db reset` y `npm run db:types`.

## Dar de alta un negocio

1. Copia `clientes/la-pizzeria.json` a `clientes/<slug>.json` y llénalo con la marca del negocio. El `slug` será su subdominio.
2. Sube su logo y fotos a Supabase Storage (bucket público) y pega las URLs.
3. Ejecuta con las llaves de producción:
   ```bash
   npm run cliente:cargar -- clientes/<slug>.json --duenio dueño@negocio.com
   ```
   Es idempotente: vuelve a correrlo cada vez que cambie su menú o recompensas. Con `MORALINK_APP_URL` y `REVALIDATE_SECRET` definidos, el sitio se actualiza al momento.
4. El dueño entra en `https://<slug>.moralink.app/entrar` con ese correo y ya puede usar `/caja`.

Campos del tema (`theme`): `primary`, `primaryForeground`, `background`, `surface`, `foreground`, `muted`, `accent`, `radius` y `fontDisplay` (`fraunces`, `playfair`, `poppins` o `inter`). Íconos de sello (`stamp_icon`): `pizza`, `coffee`, `burger`, `heart`, `star`.

## Despliegue

**Supabase**

1. Crea el proyecto y enlázalo: `npx supabase link --project-ref <ref>`, luego `npx supabase db push`.
2. En Authentication → URL Configuration: *Site URL* `https://moralink.app` y *Redirect URLs* `https://*.moralink.app/**`.
3. Configura un SMTP propio (Resend, SES, etc.): el de Supabase solo manda unos cuantos correos por hora.

**Vercel**

1. Importa el repo. Variables: `NEXT_PUBLIC_ROOT_DOMAIN=moralink.app`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `REVALIDATE_SECRET` y opcionalmente `NEXT_PUBLIC_CONTACT_WHATSAPP`.
2. Agrega los dominios `moralink.app` y `*.moralink.app`. El comodín requiere usar los nameservers de Vercel para el dominio.

## Siguientes pasos

- Cobro mensual a los negocios (Stripe o Mercado Pago) usando `tenants.plan` y `tenants.billing_status`.
- Panel para que el dueño edite su menú y recompensas sin pasar por el JSON.
- Acceso por teléfono (OTP por SMS o WhatsApp) en lugar de correo.
- Escaneo del QR desde la cámara dentro de `/caja` (hoy el QR abre `/caja?codigo=…` con la cámara del teléfono).
- Dominios propios por negocio (`lealtad.lapizzeria.com`).
