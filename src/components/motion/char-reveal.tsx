"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";

/**
 * CharReveal — revela texto letra a letra via clip/slide + stagger.
 *
 * `trigger="mount"` anima assim que o componente monta — usar em conteúdo
 * já visível no load (ex: headline do hero), onde `whileInView` não dispara
 * de forma confiável (o elemento já está na viewport antes do primeiro
 * IntersectionObserver callback ter efeito visível, e sem scroll real não
 * há um segundo callback que force a checagem).
 * `trigger="viewport"` (default) anima quando entra na viewport — usar em
 * conteúdo abaixo da dobra.
 */

type Props = {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  trigger?: "mount" | "viewport";
  delay?: number;
  /** Stagger entre palavras (segundos). */
  stagger?: number;
  className?: string;
};

const wordVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export function CharReveal({
  text,
  as = "span",
  trigger = "viewport",
  delay = 0,
  stagger = 0.07,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);
  const MotionTag = motion[as] as typeof motion.span;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: reduce ? 0 : stagger },
    },
  };

  const triggerProps =
    trigger === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: { once: true, amount: 0.4 } };

  return (
    <MotionTag
      initial="hidden"
      variants={containerVariants}
      aria-label={text}
      className={className}
      {...triggerProps}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={reduce ? reducedVariants : wordVariants}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
