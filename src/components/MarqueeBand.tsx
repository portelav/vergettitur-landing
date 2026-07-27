import { LOCATIONS } from "@/data/locations";

/**
 * Faixa horizontal infinita com os nomes dos roteiros — mesma técnica do
 * hero-marquee de referência: duas cópias do conteúdo lado a lado, container
 * anima -50% em X via `@keyframes marquee-x` (globals.css), loop sem corte.
 * Pausa (fica estática) em `prefers-reduced-motion` via CSS puro.
 */

const Diamond = (
  <span aria-hidden className="mx-6 inline-block size-[6px] rotate-45 bg-clay sm:mx-9" />
);

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center whitespace-nowrap font-heading uppercase">
      <span className="flex items-center text-[10px] tracking-[0.55em] text-mute/80 sm:text-xs">
        Roteiros Vergetti Turismo
      </span>
      {Diamond}
      {LOCATIONS.map((location, idx) => (
        <span key={location.id} className="flex items-center">
          <span className="text-sm font-semibold tracking-[0.28em] text-foreground/85 sm:text-base">
            {location.name}
          </span>
          {idx < LOCATIONS.length - 1 ? Diamond : null}
        </span>
      ))}
      {Diamond}
    </div>
  );
}

export function MarqueeBand() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent sm:w-28" />

      <div className="flex w-max [animation:marquee-x_32s_linear_infinite]">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}
