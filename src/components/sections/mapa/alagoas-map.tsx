"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { ALAGOAS_MUNICIPIOS } from "@/data/alagoas-municipios";
import { AL_SVG_VIEWBOX, projectLatLon } from "@/data/alagoas-geo";
import { LOCATIONS, type Location } from "@/data/locations";
import { useMapa } from "./mapa-context";

const HOST_MUNICIPIOS = new Set(LOCATIONS.map((l) => l.municipio));

type PinPopover = {
  location: Location;
  x: number;
  y: number;
};

function buildArcPath(ax: number, ay: number, bx: number, by: number, curvature: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = mx + nx * dist * curvature;
  const cy = my + ny * dist * curvature;
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

export function AlagoasMap() {
  const reduce = useReducedMotion();
  const { hoveredId, activeId, popoverRequest, setHoveredId, setActiveId, isHighlighted } =
    useMapa();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePopover, setActivePopover] = useState<PinPopover | null>(null);

  const pins = useMemo(
    () =>
      LOCATIONS.map((location, i) => ({
        location,
        order: i + 1,
        ...projectLatLon(location.lat, location.lon),
      })),
    []
  );

  const pinById = useMemo(() => new Map(pins.map((p) => [p.location.id, p])), [pins]);
  const hoveredMunicipio = hoveredId ? pinById.get(hoveredId)?.location.municipio ?? null : null;

  // Reage a clique num item da lista (fora do mapa): abre o popover
  // programaticamente, como se o pino correspondente tivesse sido clicado.
  useEffect(() => {
    if (!popoverRequest) return;
    const pin = pinById.get(popoverRequest.id);
    if (!pin) return;
    setActivePopover({ location: pin.location, x: pin.x, y: pin.y });
  }, [popoverRequest, pinById]);

  const routeArcs = useMemo(() => {
    return pins.slice(0, -1).map((from, i) => {
      const to = pins[i + 1];
      return {
        id: `${from.location.id}-${to.location.id}`,
        d: buildArcPath(from.x, from.y, to.x, to.y, i % 2 === 0 ? 0.18 : -0.15),
        delay: 1.4 + i * 0.15,
      };
    });
  }, [pins]);

  return (
    <div ref={containerRef} className="relative">
      <svg
        viewBox={`0 0 ${AL_SVG_VIEWBOX.width} ${AL_SVG_VIEWBOX.height}`}
        role="img"
        aria-label={`Mapa de Alagoas com ${LOCATIONS.length} roteiros marcados`}
        className="h-[60svh] min-h-[22rem] w-full cursor-default sm:h-[min(70svh,44rem)] lg:h-[22rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="al-map-glow" cx="72%" cy="35%" r="65%">
            <stop offset="0%" stopColor="var(--lagoon-bright)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--lagoon-bright)" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect
          width={AL_SVG_VIEWBOX.width}
          height={AL_SVG_VIEWBOX.height}
          fill="url(#al-map-glow)"
        />

        {/* Municípios */}
        <g aria-hidden="true">
          {ALAGOAS_MUNICIPIOS.map((muni, index) => {
            const isHost = HOST_MUNICIPIOS.has(muni.name);
            const isHovered = hoveredMunicipio === muni.name;
            const enterDelay = reduce ? 0 : 0.08 + index * 0.005;

            return (
              <g key={muni.id}>
                <motion.path
                  d={muni.path}
                  initial={
                    reduce ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }
                  }
                  animate={{
                    opacity: 1,
                    pathLength: 1,
                    fill: isHovered
                      ? "color-mix(in oklch, var(--lagoon-bright), transparent 30%)"
                      : isHost
                        ? "color-mix(in oklch, var(--lagoon), transparent 55%)"
                        : "color-mix(in oklch, var(--mute), transparent 84%)",
                    stroke: isHost ? "var(--lagoon)" : "color-mix(in oklch, var(--mute), transparent 55%)",
                    strokeWidth: isHost ? 1.3 : 0.5,
                  }}
                  transition={{
                    opacity: { duration: 0.4, delay: enterDelay },
                    pathLength: reduce
                      ? { duration: 0 }
                      : { duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: enterDelay },
                    fill: { duration: 0.15 },
                  }}
                  strokeLinejoin="round"
                  onMouseEnter={() => {
                    if (!isHost) return;
                    const pin = pins.find((p) => p.location.municipio === muni.name);
                    if (pin) setHoveredId(pin.location.id);
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: isHost ? "pointer" : "default" }}
                />

                {isHost ? (
                  <motion.text
                    x={muni.centroid.x}
                    y={muni.centroid.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none font-mono"
                    fontSize={9}
                    fontWeight={600}
                    fill="var(--foreground)"
                    style={{ letterSpacing: "0.05em" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.9 : 0.55 }}
                    transition={{ duration: 0.3, delay: reduce ? 0 : enterDelay + 0.3 }}
                  >
                    {muni.name.toUpperCase()}
                  </motion.text>
                ) : null}
              </g>
            );
          })}
        </g>

        {/* Rotas pontilhadas ligando os roteiros em sequência */}
        <g aria-hidden="true">
          {routeArcs.map((arc) => (
            <motion.path
              key={arc.id}
              d={arc.d}
              fill="none"
              stroke="var(--clay)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="5 7"
              opacity={0.85}
              initial={reduce ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: arc.delay }
              }
            />
          ))}
        </g>

        {/* Pinos dos roteiros */}
        <g aria-label="Roteiros">
          {pins.map((pin, i) => {
            const highlighted = isHighlighted(pin.location.id);
            return (
              <g key={pin.location.id} transform={`translate(${pin.x}, ${pin.y})`}>
                <motion.g
                  initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: highlighted ? 1.22 : 1 }}
                  whileHover={{ scale: 1.22 }}
                  whileTap={{ scale: 0.96 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 320, damping: 22, delay: 1 + i * 0.12 }
                  }
                  onMouseEnter={() => setHoveredId(pin.location.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: "pointer", transformOrigin: "center", transformBox: "fill-box" }}
                >
                  {!reduce ? (
                    <circle
                      r={16}
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth={1.6}
                      opacity={0.85}
                      style={{
                        animation: "pin-pulse 2.2s ease-out infinite",
                        animationDelay: `${i * 0.3}s`,
                        transformOrigin: "center",
                        transformBox: "fill-box",
                      }}
                    />
                  ) : null}
                  <circle r={11} fill="oklch(0.05 0 0)" opacity={0.25} cy={1.5} />
                  <circle r={12} fill="var(--sand)" />
                  <circle
                    r={9.5}
                    fill={highlighted ? "var(--lagoon)" : "var(--clay)"}
                    stroke="var(--sand)"
                    strokeWidth={1.5}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    y={0.5}
                    className="select-none font-mono"
                    fontSize={10}
                    fontWeight={700}
                    fill="var(--sand)"
                  >
                    {pin.order}
                  </text>

                  <circle
                    r={20}
                    fill="transparent"
                    role="button"
                    tabIndex={0}
                    aria-label={`${pin.location.name}, ${pin.location.municipio}`}
                    onClick={() => {
                      setActiveId(pin.location.id);
                      setActivePopover({ location: pin.location, x: pin.x, y: pin.y });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveId(pin.location.id);
                        setActivePopover({ location: pin.location, x: pin.x, y: pin.y });
                      }
                    }}
                    style={{ outline: "none" }}
                  />
                </motion.g>

                {/* Preview instantâneo no hover — antes de clicar pro popover completo */}
                <AnimatePresence>
                  {hoveredId === pin.location.id && activePopover?.location.id !== pin.location.id ? (
                    <motion.g
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ pointerEvents: "none" }}
                    >
                      <text
                        x={0}
                        y={-24}
                        textAnchor="middle"
                        className="select-none font-heading"
                        fontSize={11}
                        fontWeight={700}
                        fill="var(--lagoon-deep)"
                        style={{ paintOrder: "stroke", stroke: "var(--sand)", strokeWidth: 4 }}
                      >
                        {pin.location.name}
                      </text>
                    </motion.g>
                  ) : null}
                </AnimatePresence>
              </g>
            );
          })}
        </g>
      </svg>

      <AnimatePresence>
        {activePopover ? (
          <div
            key={activePopover.location.id}
            className="pointer-events-none absolute inset-0"
          >
            <motion.aside
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: `${(activePopover.x / AL_SVG_VIEWBOX.width) * 100}%`,
                top: `${(activePopover.y / AL_SVG_VIEWBOX.height) * 100}%`,
              }}
              className={cn(
                "pointer-events-auto absolute z-10 w-64 -translate-x-1/2 -translate-y-[calc(100%+18px)]",
                "rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                    {activePopover.location.municipio} · AL
                  </p>
                  <h4 className="mt-1 font-heading text-base font-bold uppercase tracking-wide">
                    {activePopover.location.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePopover(null)}
                  aria-label="Fechar"
                  className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-mute hover:text-foreground"
                >
                  ×
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                {activePopover.location.description}
              </p>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <p className="sr-only">
        Mapa de Alagoas com os {LOCATIONS.length} roteiros oferecidos pela
        Vergetti Turismo, ligados por uma rota pontilhada.
      </p>
    </div>
  );
}
