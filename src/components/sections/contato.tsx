"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CharReveal } from "@/components/motion/char-reveal";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/lib/links";

function formatBrPhone(digits: string) {
  // "5582988010740" -> "(82) 98801-0740"
  const local = digits.slice(2);
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function Contato() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contato"
      className="relative scroll-mt-20 overflow-hidden bg-surface-2 px-4 py-24 text-foreground sm:px-6 sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M -50 100 Q 250 40 500 120 T 1100 80"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="2 10"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-clay">
          03 · Contato
        </p>

        <CharReveal
          as="h2"
          text="Bora conhecer Alagoas?"
          className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
        />

        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg"
        >
          Chama no WhatsApp e monta seu roteiro direto com o Adriano.
        </motion.p>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-9 py-4 font-heading text-base font-bold uppercase tracking-widest text-lagoon-deep transition-transform hover:scale-105"
          >
            <MessageCircle className="size-5" />
            Chamar no WhatsApp
          </a>
          <span className="font-mono text-sm text-foreground/55">
            {formatBrPhone(WHATSAPP_NUMBER)}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
