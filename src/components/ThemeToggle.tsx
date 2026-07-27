"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "vergettitur-theme";

type Transition = {
  x: number;
  y: number;
  toDark: boolean;
  maxScale: number;
};

const CIRCLE_SIZE = 24;

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transition, setTransition] = useState<Transition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const appliedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function applyTheme(next: boolean) {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    // Raio até o canto mais distante do botão — garante cobertura total
    // da tela não importa onde o botão esteja.
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    appliedRef.current = false;
    setTransition({ x, y, toDark: !isDark, maxScale: (maxRadius * 2) / CIRCLE_SIZE });
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:text-foreground"
      >
        {/* Evita flash de ícone errado antes da hidratação: só renderiza
            depois de montar, quando já sabe o estado real da classe .dark. */}
        {mounted ? (
          isDark ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )
        ) : (
          <span className="size-4" />
        )}
      </button>

      {/* Transição temática: um disco cresce do botão (eclipse escuro indo
          pro dark / sol dourado indo pro claro), cobre a tela inteira — é
          nesse pico que o tema troca de verdade por baixo — e recolhe de
          volta pro botão, como se o sol/lua "voltasse" pro ícone. */}
      <AnimatePresence>
        {transition ? (
          <motion.div
            aria-hidden
            className={cn(
              "pointer-events-none fixed z-[100] rounded-full",
              transition.toDark
                ? "bg-lagoon-deep shadow-[0_0_120px_40px_oklch(0.8_0.14_188_/_0.35)]"
                : "bg-gold shadow-[0_0_160px_60px_oklch(0.79_0.13_86_/_0.55)]"
            )}
            style={{
              left: transition.x,
              top: transition.y,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              x: "-50%",
              y: "-50%",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, transition.maxScale, 0] }}
            transition={{ duration: 0.9, times: [0, 0.5, 1], ease: [0.65, 0, 0.35, 1] }}
            onUpdate={(latest) => {
              const scale = latest.scale as number;
              if (!appliedRef.current && scale >= transition.maxScale * 0.98) {
                appliedRef.current = true;
                applyTheme(transition.toDark);
              }
            }}
            onAnimationComplete={() => setTransition(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
