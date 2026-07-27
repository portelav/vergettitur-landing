"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { WHATSAPP_HREF } from "@/lib/links";
import { ALAGOAS_MUNICIPIOS } from "@/data/alagoas-municipios";
import { AL_SVG_VIEWBOX } from "@/data/alagoas-geo";

const wordmarkContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.25, staggerChildren: 0.1 } },
};

const wordmarkWord: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const wordmarkReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden bg-surface-2 px-4 pb-20 pt-32 text-foreground sm:px-6 sm:pb-24"
    >
      {/* Camadas de fundo — sem fotos ainda (nenhuma disponível), tratamento
          gráfico: gradiente + linhas de rota pontilhadas, não placeholder cinza.
          Usa --surface-2 nas pontas do gradiente (não --lagoon-deep fixo) pra
          se adaptar ao tema, mantendo contraste com Sobre/Roteiros (bg-background). */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-2 via-surface-2 to-lagoon" />
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

        {/* Elemento gráfico de assinatura — silhueta de Alagoas (mesmos dados
            do mapa interativo) sangrando pela borda direita, bem grande e
            bem sutil. Faz o papel que uma foto faria: dá ao hero uma âncora
            visual grande que só esse site tem. */}
        <svg
          viewBox={`0 0 ${AL_SVG_VIEWBOX.width} ${AL_SVG_VIEWBOX.height}`}
          className="absolute -right-[14%] top-1/2 h-[135%] w-auto -translate-y-1/2 text-foreground/[0.05] sm:-right-[8%] sm:h-[150%]"
          aria-hidden
        >
          {ALAGOAS_MUNICIPIOS.map((muni) => (
            <path key={muni.id} d={muni.path} fill="currentColor" />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-clay sm:text-sm"
        >
          Guia local · Alagoas, Brasil
        </motion.p>

        {/* Wordmark tratado como marca, não como frase: "Tur" ganha cor
            própria pra deixar claro que a fusão é proposital (como
            "Vergetti Turismo" virando um nome só), não erro de digitação. */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={wordmarkContainer}
          className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="sr-only">VergettiTur</span>
          {/* pb-[0.15em] no wrapper: sem essa folga, o overflow-hidden da
              máscara de reveal corta a descendente do "g" de "Vergetti" —
              leading apertado (0.95) não sobra espaço embaixo da linha de
              base pra a Fraunces desenhar o rabinho do g inteiro. */}
          <span aria-hidden className="inline-block overflow-hidden pb-[0.15em] align-bottom">
            <motion.span
              className="inline-block"
              variants={reduce ? wordmarkReduced : wordmarkWord}
            >
              Vergetti
            </motion.span>
          </span>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.15em] align-bottom text-lagoon">
            <motion.span
              className="inline-block"
              variants={reduce ? wordmarkReduced : wordmarkWord}
            >
              Tur
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-3 font-heading text-lg uppercase tracking-[0.15em] text-accent-contrast sm:text-xl"
        >
          Adriano Vergetti
        </motion.p>

        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg"
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
            className="rounded-full border border-foreground/25 px-8 py-3 font-heading text-sm font-bold uppercase tracking-widest transition-colors hover:bg-foreground/10"
          >
            Ver roteiros
          </a>
        </motion.div>
      </div>
    </section>
  );
}
