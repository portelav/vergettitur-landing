"use client";

import { MaskReveal } from "@/components/motion/mask-reveal";
import { FlipCounter } from "@/components/motion/flip-counter";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";

const STATS = [
  { value: 6, suffix: "+", label: "Roteiros pelo litoral" },
  { value: 102, suffix: "", label: "Municípios de Alagoas" },
  { value: 1, suffix: "", label: "Guia, do início ao fim" },
];

export function Sobre() {
  const reduce = useReducedMotion();

  return (
    <section id="sobre" className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <MaskReveal direction="right">
          {/* PLACEHOLDER: sem foto do Adriano ainda. Tratamento discreto de
              propósito — borda tracejada + tom neutro, pra não competir
              visualmente com o conteúdo real (bio, stats) até a foto chegar. */}
          <div className="relative mx-auto flex aspect-[4/5] w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface-2 text-mute">
            <Camera className="size-7" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
              Foto em breve
            </span>
          </div>
        </MaskReveal>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-clay">
            01 · Sobre
          </p>
          <h2 className="font-editorial text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Quem te leva pra conhecer Alagoas de verdade
          </h2>

          {/* PLACEHOLDER: bio real do Adriano — aguardando docs/perguntas-adriano.md */}
          <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
            <p>
              <strong className="font-semibold text-foreground">
                Adriano Vergetti de Siqueira Almeida
              </strong>{" "}
              é guia de turismo em Alagoas, à frente da Vergetti Turismo. Conhece
              de perto as praias, piscinas naturais e rios mais bonitos do
              estado — do litoral norte ao sul.
            </p>
            <p>
              Passeios pensados pra cada visitante: no seu ritmo, com
              segurança e o olhar de quem vive a região.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <FlipCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-editorial text-3xl font-bold text-lagoon sm:text-4xl"
                />
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-mute">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
