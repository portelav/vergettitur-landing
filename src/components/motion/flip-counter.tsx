"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";

/**
 * FlipCounter — conta de 0 até `value` com cada dígito girando em 3D
 * (split-flap / airport board), disparado ao entrar na viewport.
 */

type Props = {
  value: number;
  /** Sufixo depois do número, ex: "+". Não entra na contagem. */
  suffix?: string;
  duration?: number;
  className?: string;
};

export function FlipCounter({ value, suffix = "", duration = 1.2, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView) return;

    function tick(t: number) {
      if (startRef.current === null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.round(value * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [reduce, inView, value, duration]);

  const digits = useMemo(
    () => String(reduce ? value : current).split(""),
    [reduce, value, current]
  );

  if (reduce) {
    return (
      <span ref={ref} className={className}>
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex", perspective: 600 }}>
      {digits.map((digit, idx) => (
        <motion.span
          key={`${idx}-${digit}`}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "inline-block",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {digit}
        </motion.span>
      ))}
      {suffix}
    </span>
  );
}
