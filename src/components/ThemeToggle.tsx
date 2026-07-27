"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "vergettitur-theme";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    const next = !isDark;
    const doc = document as ViewTransitionDocument;

    if (!doc.startViewTransition) {
      applyTheme(next);
      return;
    }

    // Origem do círculo = centro do botão clicado. O CSS
    // (::view-transition-new(root) em globals.css) usa essas duas
    // variáveis pra abrir o "reveal" a partir daqui.
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    document.documentElement.style.setProperty("--vt-x", `${x}px`);
    document.documentElement.style.setProperty("--vt-y", `${y}px`);

    doc.startViewTransition(() => applyTheme(next));
  }

  return (
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
  );
}
