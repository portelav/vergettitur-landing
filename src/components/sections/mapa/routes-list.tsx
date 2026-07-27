"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/data/locations";
import { useMapa } from "./mapa-context";

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export function RoutesList() {
  const reduce = useReducedMotion();
  const { setHoveredId, setActiveId, requestPopoverFor, isHighlighted } = useMapa();

  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={reduce ? undefined : listVariants}
      aria-label={`${LOCATIONS.length} roteiros da Vergetti Turismo`}
      className="flex flex-col gap-4 lg:pt-[6svh]"
    >
      {LOCATIONS.map((location, i) => {
        const highlighted = isHighlighted(location.id);
        return (
          <motion.li
            key={location.id}
            variants={reduce ? undefined : cardVariants}
            onMouseEnter={() => setHoveredId(location.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(location.id)}
            onBlur={() => setHoveredId(null)}
            onClick={() => {
              setActiveId(location.id);
              requestPopoverFor(location.id);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveId(location.id);
                requestPopoverFor(location.id);
              }
            }}
            className={cn(
              "group flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-card p-5 transition-colors duration-200 sm:p-6",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-lagoon-bright",
              highlighted ? "border-lagoon bg-lagoon/10" : "border-border hover:border-lagoon/40"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full font-mono text-xs font-bold",
                  highlighted ? "bg-lagoon text-primary-foreground" : "bg-muted text-mute"
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-heading text-base font-bold uppercase tracking-wide text-card-foreground">
                  {location.name}
                </h3>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                  {location.municipio} · AL
                </p>
                <p className="mt-1.5 hidden text-sm leading-snug text-card-foreground/70 sm:block">
                  {location.description}
                </p>
              </div>
            </div>

            <ChevronRight
              aria-hidden
              className={cn(
                "size-5 shrink-0 text-mute transition-transform duration-200 group-hover:translate-x-1",
                highlighted && "translate-x-1 text-lagoon"
              )}
            />
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
