import { StampIcon } from "@/components/stamp-icon";

// Celular de ejemplo con la tarjeta de un negocio (solo ilustración)
export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] rotate-2 rounded-[2.6rem] border-[10px] border-ink bg-ink shadow-2xl shadow-ink/30 sm:w-[290px]">
      <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink" />
      <div className="overflow-hidden rounded-[2rem] bg-paper px-4 pb-6 pt-8 text-ink">
        <div className="flex flex-col items-center gap-1">
          <span className="flex size-10 items-center justify-center rounded-full bg-violet text-white">
            <StampIcon name="coffee" className="size-6" />
          </span>
          <p className="font-serif text-lg font-bold">Café Aurora</p>
        </div>

        <div className="mt-4 rounded-2xl bg-violet p-4 text-center text-white">
          <p className="font-serif text-base font-bold">Tu progreso</p>
          <div className="mt-3 flex justify-center gap-1.5 rounded-full bg-white px-2 py-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <StampIcon key={i} name="coffee" className={`size-7 ${i < 4 ? "text-violet" : "text-ink/25"}`} />
            ))}
          </div>
          <p className="mt-2 text-xs font-medium">¡Te falta 1 café para tu recompensa!</p>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-violet">
            <StampIcon name="coffee" className="size-6" />
          </span>
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/60">Recompensa</p>
            <p className="text-sm font-bold">1 café de especialidad ¡gratis!</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-violet py-2.5 text-center text-sm font-semibold text-white">
          Ver mis recompensas
        </div>
        <div className="mt-2 rounded-xl border-2 border-violet py-2 text-center text-sm font-semibold text-violet">
          Conocer el menú
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
          {["Cafés", "Postres", "Bebidas"].map((name) => (
            <div key={name}>
              <div className="flex aspect-square items-center justify-center rounded-xl bg-white font-serif text-lg font-bold text-violet shadow-sm">
                {name.charAt(0)}
              </div>
              <p className="mt-1">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
