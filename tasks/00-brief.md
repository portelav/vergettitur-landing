# Brief — Vergetti Turismo (landing page)

> Documento raiz. Registra decisões e histórico do projeto pra sobreviver
> entre conversas — diferente do TodoWrite (efêmero, só existe dentro de
> uma conversa). Cada pedido grande novo ganha `tasks/NN-slug.md` próprio;
> este arquivo é o resumo vivo do estado atual.

## Objetivo

Landing page pra Adriano Vergetti de Siqueira Almeida, guia de turismo em
Alagoas (empresa: Vergetti Turismo). Objetivo: captar contato via WhatsApp
+ mostrar os roteiros/passeios que ele oferece.

## Referência de design/stack

Repo `landing-hilton-loureiro` (site do piloto Hilton Loureiro) — usado como
referência de stack e nível de acabamento, **não** de conteúdo/paleta.
Clonado localmente em análise, não é dependência do projeto.

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (tokens via `@theme` no CSS, sem `tailwind.config.js`)
- shadcn/ui (`style: base-nova`, `@base-ui/react`)
- Framer Motion (animações) + Lenis (scroll suave) + GSAP (instalado, não usado ainda)
- Lucide React (ícones)
- Deploy: a definir (nada feito ainda)

## Estado atual (2026-07-27)

### Entregue
- Estrutura: Hero, MarqueeBand, Sobre, Roteiros+Mapa (fundidos numa seção
  só, mapa sticky + lista sincronizada), Contato, Navbar, Footer
- Mapa interativo de Alagoas: 102 municípios gerados via GeoJSON IBGE
  (`tbrugz/geodata-br`) + simplificação Douglas-Peucker
  (`scripts/build-alagoas-geo.mjs`), pins clicáveis com popover, sync
  bidirecional hover/click entre mapa e lista de roteiros
- Motion: char-reveal (mount vs viewport trigger), mask-reveal,
  section-divider, flip-counter — `useReducedMotion` **ignora**
  `prefers-reduced-motion` do SO de propósito (ambiente reporta
  preferências pouco confiáveis; mesma decisão do repo referência)
- Tema claro/escuro com toggle manual (botão sol/lua na navbar). Claro é
  o padrão. Não depende de `prefers-color-scheme` do SO (mesmo motivo do
  reduced-motion). Estado em localStorage, aplicado antes do paint via
  script inline
- Transição de tema: **v2** — trocado o disco colorido+glow (achado
  chamativo demais) pela View Transitions API nativa. Círculo cresce do
  botão revelando o conteúdo real por trás (não uma cor sólida cobrindo a
  tela), ~480ms, sem glow. Fallback: troca instanea em browser sem suporte
  (feature-detect `document.startViewTransition`). CSS em globals.css
  (`::view-transition-old/new(root)`), lógica em `ThemeToggle.tsx`.
- Repo público: https://github.com/portelav/vergettitur-landing
- Review de design (persona designer sênior) + correções aplicadas: wordmark
  "VergettiTur" com "Tur" em cor própria (lia como erro de digitação antes),
  silhueta de Alagoas como elemento gráfico de fundo no Hero (dado do mapa
  reaproveitado), placeholder de foto do Sobre discretizado (era um bloco
  colorido chamativo, virou moldura tracejada neutra), contraste do `clay`
  reforçado no tema claro, legenda adicionada no mapa (preenche vão vazio),
  descrição do roteiro visível no mobile (antes só desktop)
- Bugs de corte achados no review visual e corrigidos: descendente do 'g'
  em "Vergetti" cortada pela máscara de reveal (leading apertado sem folga
  pra Fraunces — `pb-[0.15em]` no wrapper), e cards de roteiro vazando 28px
  da tela em ≤320px (item de grid sem `min-w-0` — clássica armadilha do
  CSS Grid, `truncate`/nowrap empurrava a coluna antes de truncar)
- Tipografia: Fraunces agora só no wordmark "VergettiTur" (logotipo).
  Títulos de seção (Sobre/Roteiros/Contato/stats) migraram pra **Piazzolla**
  (`--font-editorial` / `.font-editorial`) — Fraunces sozinha em tudo lia
  "boutique de design indie 2023" demais pra um guia de turismo regional
- Fix: erro de hidratação no `<html>` causado pelo script de tema (muda
  className antes do React hidratar) — `suppressHydrationWarning`, mesmo
  padrão do next-themes. Testado com tema escuro pré-setado, zero warning.
- **Deploy em produção**: https://vergettitur.vercel.app (Vercel, conta
  `portelav`, projeto `vergettitur`). GitHub conectado — push em `master`
  vira deploy automático daqui pra frente. Sem domínio próprio ainda.

### Placeholder — aguardando dados reais do Adriano
Ver `docs/perguntas-adriano.md` (100 perguntas). Bloqueando:
- Lista real de passeios/roteiros (hoje 6 lugares inventados: Maragogi,
  Japaratinga, São Miguel dos Milagres, Barra de Santo Antônio, Marechal
  Deodoro, Piaçabuçu)
- Fotos (nenhuma disponível — tratado como decisão de design: gráfico/
  gradiente no lugar de placeholder cinza genérico, não foto fake)
- Bio real do Adriano (hoje texto genérico)
- Logo/cores de marca (hoje paleta própria criada: lagoon/clay/gold/sand,
  inspirada no litoral de Alagoas)

### Decidido e fechado
- WhatsApp real: (82) 98801-0740
- Nome grande no hero: "VergettiTur", subtítulo "Adriano Vergetti"
- Domínio: não decidido ainda
- Sem sistema de reserva/pagamento online na v1

### Não fazer (fora de escopo por enquanto)
- Blog
- Multilíngue
- Painel administrativo pro Adriano editar conteúdo

## Workflow deste projeto

- Tasks grandes → `tasks/NN-slug.md` (este arquivo é o índice/estado vivo)
- Progresso dentro de uma conversa → `TodoWrite` (efêmero)
- Commit só quando pedido explicitamente
- Testado com Playwright antes de reportar pronto (screenshot + clique
  real, não só typecheck/build)
