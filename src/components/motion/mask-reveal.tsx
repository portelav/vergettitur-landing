"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";

/**
 * MaskReveal — revela o conteúdo com uma cortina (clip-path) que desliza,
 * em vez de um fade genérico. Direção configurável.
 */

type Direction = "left" | "right" | "up" | "down";

const CLIP_BY_DIRECTION: Record<Direction, { from: string; to: string }> = {
  left: {
    from: "inset(0 100% 0 0)",
    to: "inset(0 0% 0 0)",
  },
  right: {
    from: "inset(0 0 0 100%)",
    to: "inset(0 0 0 0%)",
  },
  up: {
    from: "inset(100% 0 0 0)",
    to: "inset(0% 0 0 0)",
  },
  down: {
    from: "inset(0 0 100% 0)",
    to: "inset(0 0 0% 0)",
  },
};

type Props = {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
};

export function MaskReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const clip = CLIP_BY_DIRECTION[direction];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: clip.from, opacity: 0.6 }}
      whileInView={{ clipPath: clip.to, opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
