# MoraLink

Producción: <https://moralink.app>

Programas de lealtad y catálogo digital para negocios (restaurantes, cafeterías, tiendas), con la marca de cada negocio y en su propio enlace: `https://moralink.app/<negocio>`.

Todo corre en **un solo proyecto de Supabase y un solo proyecto de Vercel**: los negocios son filas de la tabla `tenants`, y cada menú, recompensa y cliente final lleva el `tenant_id` del negocio al que pertenece.

Cada negocio paga una mensualidad y recibe:

- **Su página con su marca**: logo, colores y tipografía.
- **Su menú o catálogo** por categorías.
- **Su programa de recompensas**: tarjeta de sellos (ej. 5 pizzas = 1 gratis) o puntos por compra.
- **Tarjeta digital para sus clientes** con código QR, sin descargar apps.
- **Caja** para que el personal sume sellos y canjee recompensas.
- **Pedidos en línea** (opcional): el cliente arma su pedido desde el menú, recibe un número y un enlace para seguirlo, y el negocio los surte desde su panel.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) desplegado en [Vercel](https://vercel.com)
- [Supabase](https://supabase.com): Postgres con RLS y Auth (enlace mágico por correo)
- Tailwind CSS 4

## Cómo funciona el multi-negocio

```
moralink.app                   landing de MoraLink
moralink.app/la-dolce-vita       inicio del negocio
moralink.app/la-dolce-vita/menu  su menú
```

- `src/app/[tenant]/` es el sitio de cada negocio; el primer segmento de la ruta es su `slug`.
- `src/proxy.ts` mantiene viva la sesión de Supabase en cada petición.
- `getTenantSite(slug)` (`src/lib/tenant/queries.ts`) trae marca, menú, programa y recompensas en una lectura cacheada.
- El layout del negocio aplica sus colores como variables CSS (`src/lib/tenant/theme.ts`), y los componentes usan clases `bg-brand`, `text-brand-ink`, `rounded-brand`, `font-display`, etc.
- Todo dato lleva `tenant_id` y está protegido con RLS (`supabase/migrations/`).

## Estructura

```
clientes/                 Un JSON por negocio: marca, programa, recompensas y menú
scripts/cargar-cliente.mjs  Carga o actualiza un negocio desde su JSON
supabase/migrations/      Esquema de base de datos
src/proxy.ts              Refresco de sesión de Supabase
src/app/page.tsx          Landing de MoraLink
src/app/[tenant]/         Sitio de cada negocio
  page.tsx                Inicio: progreso, recompensa principal, categorías
  menu/                   Catálogo
  recompensas/            Recompensas y cuáles ya puede canjear el cliente
  entrar/                 Acceso con enlace por correo
  mi-tarjeta/             QR y código del cliente
  caja/                   Panel del personal (sumar sellos, canjear)
  pedido/                 Carrito y envío del pedido
  pedido/[token]/         Seguimiento del pedido (enlace que recibe el cliente)
  pedidos/                Panel de pedidos del negocio
  auth/callback/          Destino del enlace de acceso
src/lib/tenant/           Tema, lecturas del negocio y del cliente
src/lib/supabase/         Clientes de Supabase y tipos generados
```

## Desarrollo local

Requiere Node 22 y Docker.

```bash
npm install
npx supabase start            # Postgres, Auth y Mailpit locales
cp .env.example .env.local    # pega las llaves que imprime `npx supabase status`
npm run cliente:cargar -- clientes/<slug>.json --duenio tu@correo.com
npm run dev
```

- Abre <http://localhost:3000/<slug>>.
- Los correos de acceso llegan a Mailpit: <http://127.0.0.1:54324>.
- Entra con el correo del dueño y ve a `/<slug>/caja` para sumar sellos.
- Tras cambiar el esquema: `npx supabase migration new <nombre>`, `npx supabase db reset` y `npm run db:types`.

## Dar de alta un negocio

1. Copia `clientes/plantilla.json` a `clientes/<slug>.json` y llénalo con la marca del negocio. El `slug` será su ruta (`moralink.app/<slug>`).
2. Sube su logo y fotos a Supabase Storage (bucket público) y pega las URLs.
3. Ejecuta con las llaves de producción:
   ```bash
   npm run cliente:cargar -- clientes/<slug>.json --duenio dueño@negocio.com
   ```
   Es idempotente: vuelve a correrlo cada vez que cambie su menú o recompensas. Con `MORALINK_APP_URL` y `REVALIDATE_SECRET` definidos, el sitio se actualiza al momento.
4. El dueño entra en `https://moralink.app/<slug>/entrar` con ese correo y ya puede usar `/<slug>/caja`.

Para recibir pedidos en línea agrega `"orders": { "enabled": true, "delivery": true }` al JSON (`delivery` permite envío a domicilio además de recoger en tienda).

Campos del tema (`theme`): `primary`, `primaryForeground`, `background`, `surface`, `foreground`, `muted`, `accent`, `radius` y `fontDisplay` (`fraunces`, `playfair`, `poppins` o `inter`). Íconos de sello (`stamp_icon`): `pizza`, `coffee`, `burger`, `heart`, `star`.

## Despliegue

**Supabase**

1. Crea el proyecto y enlázalo: `npx supabase link --project-ref <ref>`, luego `npx supabase db push`.
2. En Authentication → URL Configuration: *Site URL* `https://moralink.app` y *Redirect URLs* `https://moralink.app/**`.
3. Configura un SMTP propio (Resend, SES, etc.): el de Supabase solo manda unos cuantos correos por hora.

**Vercel**

1. Importa el repo. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `REVALIDATE_SECRET` y opcionalmente `NEXT_PUBLIC_CONTACT_WHATSAPP`.
2. Agrega el dominio `moralink.app`. Mientras no lo tengas, funciona igual con la dirección gratis de Vercel (`<proyecto>.vercel.app/<slug>`); en ese caso usa esa dirección en las URLs de Supabase.

## Siguientes pasos

- Cobro mensual a los negocios (Stripe o Mercado Pago) usando `tenants.plan` y `tenants.billing_status`.
- Panel para que el dueño edite su menú y recompensas sin pasar por el JSON.
- Acceso por teléfono (OTP por SMS o WhatsApp) en lugar de correo.
- Escaneo del QR desde la cámara dentro de `/caja` (hoy el QR abre `/<slug>/caja?codigo=…` con la cámara del teléfono).
- Subdominios o dominios propios por negocio (`lealtad.lapizzeria.com`).
