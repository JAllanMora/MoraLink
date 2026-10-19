// Landing de MoraLink en el dominio raíz (moralink.app)
const FEATURES = [
  { title: "Fideliza a tus clientes", body: "Convierte visitas ocasionales en clientes frecuentes." },
  { title: "Recompensas a tu medida", body: "Productos gratis, descuentos o promociones especiales." },
  { title: "Fácil de usar", body: "Tus clientes muestran su código QR y acumulan sellos o puntos." },
  { title: "Con tu marca", body: "Tu logo, tus colores y tu menú en tu propio enlace." },
];

export default function Landing() {
  const whatsapp = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <div className="space-y-4">
        <p className="font-semibold text-emerald-700">MoraLink</p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Tus clientes frecuentes merecen recompensas
        </h1>
        <p className="text-lg text-gray-600">
          Programa de lealtad digital y catálogo para tu negocio, con tu marca y en tu propio enlace.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="rounded-2xl border border-gray-200 p-5">
            <p className="font-semibold text-gray-900">{feature.title}</p>
            <p className="mt-1 text-sm text-gray-600">{feature.body}</p>
          </li>
        ))}
      </ul>

      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          className="self-start rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white"
        >
          Escríbenos por WhatsApp
        </a>
      )}
    </main>
  );
}
