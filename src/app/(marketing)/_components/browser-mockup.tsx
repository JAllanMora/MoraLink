import { Icon } from "@/components/icons";

// Navegador con la página web de un negocio (solo ilustración)
export function BrowserMockup() {
  return (
    <div className="mx-auto w-full max-w-[460px] -rotate-1 overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink/15">
      <div className="flex items-center gap-3 bg-paper-dark px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#F7A8C8]" />
          <span className="size-2.5 rounded-full bg-mango" />
          <span className="size-2.5 rounded-full bg-[#7FD1A7]" />
        </div>
        <span className="flex-1 truncate rounded-full bg-white px-3 py-1 text-xs text-ink/60">
          moralink.app/barberia-don-leo
        </span>
      </div>
      <div className="bg-gradient-to-br from-ink to-violet px-6 py-8 text-white">
        <p className="font-serif text-2xl font-bold">Barbería Don Leo</p>
        <p className="mt-1 text-sm text-white/80">Cortes clásicos y modernos desde 1998</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink">Ver servicios</span>
          <span className="flex items-center gap-1 rounded-full bg-basil px-4 py-1.5 text-xs font-semibold">
            <Icon name="whatsapp" className="size-3.5" /> WhatsApp
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5 text-center text-[11px] font-semibold">
        {["Corte", "Barba", "Paquete"].map((name) => (
          <div key={name}>
            <div className="aspect-square rounded-2xl bg-paper-dark" />
            <p className="mt-1.5">{name}</p>
          </div>
        ))}
      </div>
      <div className="mx-5 mb-5 flex items-center justify-between rounded-2xl bg-paper p-3 text-xs">
        <span className="font-semibold">📍 Av. Juárez 120, Centro</span>
        <span className="text-ink/60">Lun a Sáb · 10 a 20 h</span>
      </div>
    </div>
  );
}
