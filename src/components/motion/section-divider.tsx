"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useRef } from "react";

/**
 * SectionDivider — ponte visual entre duas seções. Uma linha (slash) que
 * cresce 0→100% de largura conforme a seção entra no viewport, com um
 * numerador editorial "01 → 02" e um label. Reduced-motion: linha estática.
 */

type Props = {
  label: string;
  numerator?: [string, string];
  className?: string;
};

export function SectionDivider({ label, numerator, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineWidth = useTransform(scrollYProgress, [0.3, 0.7], ["0%", "100%"]);

  if (reduce) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`relative my-4 flex items-center justify-center gap-4 px-4 py-10 ${className ?? ""}`}
      >
        <span className="block h-px flex-1 bg-clay/30" />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-mute">
          {label}
        </span>
        <span className="block h-px flex-1 bg-clay/30" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={`relative flex items-center justify-center gap-6 px-4 py-10 sm:py-14 ${className ?? ""}`}
    >
      {numerator ? (
        <span className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-mute">
          <span className="text-clay">{numerator[0]}</span>
          <span className="block h-px w-6 bg-mute/40" />
          <span>→</span>
          <span className="block h-px w-6 bg-mute/40" />
          <span className="text-lagoon">{numerator[1]}</span>
        </span>
      ) : null}

      <div className="relative flex-1 overflow-hidden">
        <span className="block h-px w-full bg-foreground/10" />
        <motion.span
          style={{ width: lineWidth, transformOrigin: "left center" }}
          className="absolute left-0 top-0 block h-px bg-gradient-to-r from-clay via-gold to-lagoon"
        />
      </div>

      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.4em] text-mute">
        {label}
      </span>
    </div>
  );
}
