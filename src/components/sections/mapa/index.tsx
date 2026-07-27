import { MousePointerClick } from "lucide-react";
import { MapaProvider } from "./mapa-context";
import { AlagoasMap } from "./alagoas-map";
import { RoutesList } from "./routes-list";

export function Mapa() {
  return (
    <section id="roteiros" className="relative scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-clay">
            02 · Roteiros
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Onde ficam os roteiros
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
            {/* PLACEHOLDER: lista real de passeios pendente — ver docs/perguntas-adriano.md */}
            Lista provisória, a confirmar com o Adriano. Clique num roteiro
            pra ver no mapa — ou clique direto num pino.
          </p>
        </div>

        <MapaProvider>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Sticky apenas em lg+: o mapa fica "grudado" (top-24, abaixo da
                navbar) enquanto a lista rola ao lado. Precisa que o mapa seja
                mais BAIXO que a lista — senão as duas colunas empatam em
                altura e o sticky não tem margem pra "prender" nada (vira
                scroll normal 1:1). Por isso o SVG do mapa é mais compacto
                em lg (ver alagoas-map.tsx). */}
            <div className="self-start lg:sticky lg:top-24 lg:z-20 lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-[0_20px_60px_-36px_oklch(0_0_0/0.25)] sm:p-6">
                <AlagoasMap />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
                <MousePointerClick aria-hidden className="size-3" />
                <span>Clique nos pinos ou na lista pra ver cada roteiro</span>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-border bg-card px-5 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-lagoon" aria-hidden />
                  Município com roteiro
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-clay" aria-hidden />
                  Ponto do roteiro
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-px w-5 border-t border-dashed border-clay" aria-hidden />
                  Rota sugerida
                </span>
              </div>
            </div>

            <div className="relative z-10 lg:col-span-5">
              <RoutesList />
            </div>
          </div>
        </MapaProvider>
      </div>
    </section>
  );
}
