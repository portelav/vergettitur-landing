"use client";

import { motion } from "framer-motion";
import { CharReveal } from "@/components/motion/char-reveal";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { WHATSAPP_HREF } from "@/lib/links";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-end overflow-hidden bg-lagoon-deep px-4 pb-16 pt-32 text-sand sm:px-6 sm:pb-24"
    >
      {/* Camadas de fundo — sem fotos ainda (nenhuma disponível), tratamento
          gráfico: gradiente + linhas de rota pontilhadas, não placeholder cinza. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-lagoon-deep via-lagoon-deep to-lagoon" />
        <motion.div
          className="absolute -right-24 top-16 size-[26rem] rounded-full bg-lagoon-bright/20 blur-3xl"
          animate={reduce ? undefined : { y: [0, -16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-16 bottom-0 size-[20rem] rounded-full bg-gold/10 blur-3xl"
          animate={reduce ? undefined : { y: [0, 14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.08]"
          preserveAspectRatio="none"
        >
          <path
            d="M -50 400 Q 300 250 550 420 T 1200 350"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="2 10"
          />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-gold sm:text-sm"
        >
          Guia local · Alagoas, Brasil
        </motion.p>

        <CharReveal
          as="h1"
          text="Adriano Vergetti"
          trigger="mount"
          delay={0.25}
          className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        />

        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-3 font-heading text-lg uppercase tracking-[0.15em] text-lagoon-bright sm:text-xl"
        >
          Vergetti Turismo
        </motion.p>

        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-sand/85 sm:text-lg"
        >
          Praias, piscinas naturais e rios de Alagoas com quem vive a região.
          Roteiros guiados, no seu ritmo, direto pelo WhatsApp.
        </motion.p>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-8 py-3 font-heading text-sm font-bold uppercase tracking-widest text-lagoon-deep transition-transform hover:scale-105"
          >
            Falar no WhatsApp
          </a>
          <a
            href="#roteiros"
            className="rounded-full border border-sand/40 px-8 py-3 font-heading text-sm font-bold uppercase tracking-widest transition-colors hover:bg-sand/10"
          >
            Ver roteiros
          </a>
        </motion.div>
      </div>
    </section>
  );
}
