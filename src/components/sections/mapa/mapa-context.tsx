"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Sincroniza destaque entre o mapa e a lista de roteiros (mesmo padrão do
 * TemporadaContext de referência): hover ou click em qualquer um dos dois
 * lados destaca o outro.
 */
type MapaContextValue = {
  hoveredId: string | null;
  activeId: string | null;
  /** Token incremental — força reabrir o popover mesmo clicando 2x no mesmo item. */
  popoverRequest: { id: string; token: number } | null;
  setHoveredId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
  requestPopoverFor: (id: string | null) => void;
  isHighlighted: (id: string) => boolean;
};

const MapaContext = createContext<MapaContextValue | null>(null);

export function MapaProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [popoverRequest, setPopoverRequest] = useState<{ id: string; token: number } | null>(
    null
  );

  const requestPopoverFor = useCallback((id: string | null) => {
    if (id === null) {
      setPopoverRequest(null);
      return;
    }
    setPopoverRequest((prev) => ({ id, token: (prev?.token ?? 0) + 1 }));
  }, []);

  const value = useMemo<MapaContextValue>(
    () => ({
      hoveredId,
      activeId,
      popoverRequest,
      setHoveredId,
      setActiveId,
      requestPopoverFor,
      isHighlighted: (id) => hoveredId === id || activeId === id,
    }),
    [hoveredId, activeId, popoverRequest, requestPopoverFor]
  );

  return <MapaContext.Provider value={value}>{children}</MapaContext.Provider>;
}

export function useMapa(): MapaContextValue {
  const ctx = useContext(MapaContext);
  if (!ctx) throw new Error("useMapa deve ser usado dentro de <MapaProvider>");
  return ctx;
}
