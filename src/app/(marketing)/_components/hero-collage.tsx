import { StampIcon } from "@/components/stamp-icon";
import { Icon } from "@/components/icons";

// Ilustración del inicio: los tres productos como tarjetas superpuestas
export function HeroCollage() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[420px]">
      {/* Página web */}
      <div className="absolute left-0 top-4 w-[78%] -rotate-3 rounded-3xl bg-white p-4 shadow-xl shadow-ink/10">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#F7A8C8]" />
          <span className="size-2.5 rounded-full bg-mango" />
          <span className="size-2.5 rounded-full bg-[#7FD1A7]" />
        </div>
        <div className="mt-3 rounded-2xl bg-paper-dark p-4">
          <p className="font-serif text-lg font-bold">Barbería Don Leo</p>
          <p className="text-xs text-ink/60">Cortes clásicos y modernos · Abierto hoy</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-violet px-3 py-1 text-[11px] font-semibold text-white">Agendar</span>
            <span className="rounded-full bg-basil px-3 py-1 text-[11px] font-semibold text-white">WhatsApp</span>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-violet">
          <Icon name="store" className="size-4" /> Página web
        </p>
      </div>

      {/* Catálogo */}
      <div className="absolute right-0 top-32 w-[62%] rotate-3 rounded-3xl bg-white p-4 shadow-xl shadow-ink/10">
        {[
          ["Pan de muerto", "$45"],
          ["Concha de vainilla", "$18"],
          ["Café de olla", "$30"],
        ].map(([name, price]) => (
          <div key={name} className="flex items-center gap-3 border-b border-ink/5 py-2 last:border-0">
            <span className="size-9 shrink-0 rounded-xl bg-[#FCEBC7]" />
            <span className="flex-1 text-xs font-semibold">{name}</span>
            <span className="text-xs font-bold text-violet">{price}</span>
          </div>
        ))}
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-violet">
          <Icon name="catalog" className="size-4" /> Catálogo
        </p>
      </div>

      {/* Recompensas */}
      <div className="absolute bottom-0 left-6 w-[70%] -rotate-1 rounded-3xl bg-violet p-4 text-white shadow-xl shadow-violet/30">
        <p className="font-serif text-base font-bold">Tu progreso</p>
        <div className="mt-2 flex justify-center gap-1.5 rounded-full bg-white px-2 py-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <StampIcon key={i} name="star" className={`size-6 ${i < 3 ? "text-violet" : "text-ink/20"}`} />
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
          <Icon name="gift" className="size-4" /> Programa de recompensas
        </p>
      </div>
    </div>
  );
}
