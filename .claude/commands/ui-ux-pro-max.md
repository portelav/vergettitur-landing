# UI/UX Pro Max - Design Intelligence

UI/UX design intelligence para web e mobile. Inclui 50+ estilos, 161 paletas de cores, 57 pareamentos de fontes, 161 tipos de produto, 99 diretrizes UX e 25 tipos de gráfico para 10+ stacks (React, Next.js, Vue, Svelte, Tailwind, shadcn/ui, HTML/CSS).

## Quando Usar

Esta skill deve ser usada quando a tarefa envolve **estrutura de UI, decisões de design visual, padrões de interação ou controle de qualidade de UX**.

### Uso Obrigatório

- Design de novas páginas (Landing Page, Dashboard, Admin, SaaS)
- Criação ou refatoração de componentes UI (buttons, modals, forms, tables, charts)
- Escolha de esquemas de cores, sistemas tipográficos, padrões de espaçamento ou layout
- Revisão de código UI para UX, acessibilidade ou consistência visual
- Implementação de navegação, animações ou comportamento responsivo
- Decisões de design em nível de produto (estilo, hierarquia visual, expressão de marca)

### Recomendado

- UI parece "não profissional" mas a razão não é clara
- Recebendo feedback sobre usabilidade ou experiência
- Otimização de qualidade UI pré-lançamento
- Construção de design systems ou bibliotecas de componentes reutilizáveis

### Não Usar

- Desenvolvimento de lógica backend pura
- Design de API ou banco de dados apenas
- Otimização de performance não relacionada à interface
- Trabalho de infraestrutura ou DevOps

## Prioridade de Regras

| Prioridade | Categoria | Impacto | Checks Principais |
|------------|----------|---------|-------------------|
| 1 | Acessibilidade | CRITICAL | Contraste 4.5:1, Alt text, Keyboard nav, Aria-labels |
| 2 | Touch & Interaction | CRITICAL | Min 44x44px, 8px+ spacing, Loading feedback |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) |
| 4 | Style Selection | HIGH | Match product type, Consistency, SVG icons |
| 5 | Layout & Responsive | HIGH | Mobile-first, Viewport meta, No horizontal scroll |
| 6 | Typography & Color | MEDIUM | Base 16px, Line-height 1.5, Semantic color tokens |
| 7 | Animation | MEDIUM | Duration 150-300ms, Motion conveys meaning |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field, Helper text |
| 9 | Navigation Patterns | HIGH | Predictable back, Deep linking |
| 10 | Charts & Data | LOW | Legends, Tooltips, Accessible colors |

## Quick Reference

### 1. Acessibilidade (CRITICAL)

- `color-contrast` - Ratio mínimo 4.5:1 para texto normal (texto grande 3:1)
- `focus-states` - Focus rings visíveis em elementos interativos (2-4px)
- `alt-text` - Alt text descritivo para imagens significativas
- `aria-labels` - aria-label para buttons apenas com ícone
- `keyboard-nav` - Tab order corresponde à ordem visual
- `form-labels` - Use label com for attribute
- `skip-links` - Skip to main content para keyboard users
- `heading-hierarchy` - h1→h6 sequencial, sem pular níveis
- `color-not-only` - Não transmitir info apenas por cor (adicionar ícone/texto)
- `reduced-motion` - Respeitar prefers-reduced-motion

### 2. Touch & Interaction (CRITICAL)

- `touch-target-size` - Min 44x44px; estender hit area além dos limites visuais se necessário
- `touch-spacing` - Gap mínimo 8px entre touch targets
- `hover-vs-tap` - Use click/tap para interações primárias; não depender só de hover
- `loading-buttons` - Desabilitar button durante operações async; mostrar spinner
- `error-feedback` - Mensagens de erro claras próximas ao problema
- `cursor-pointer` - Adicionar cursor-pointer em elementos clicáveis

### 3. Performance (HIGH)

- `image-optimization` - Use WebP/AVIF, imagens responsivas (srcset/sizes), lazy load
- `image-dimension` - Declarar width/height ou usar aspect-ratio para evitar layout shift
- `font-loading` - Use font-display: swap/optional
- `lazy-loading` - Lazy load componentes não críticos via dynamic import
- `bundle-splitting` - Split code por rota/feature
- `content-jumping` - Reservar espaço para conteúdo async

### 4. Style Selection (HIGH)

- `style-match` - Match style ao tipo de produto
- `consistency` - Usar mesmo estilo em todas as páginas
- `no-emoji-icons` - Usar ícones SVG (Heroicons, Lucide), não emojis
- `color-palette-from-product` - Escolher paleta do produto/indústria
- `effects-match-style` - Shadows, blur, radius alinhados com estilo escolhido
- `state-clarity` - Estados hover/pressed/disabled visualmente distintos

### 5. Layout & Responsive (HIGH)

- `viewport-meta` - width=device-width initial-scale=1 (nunca desabilitar zoom)
- `mobile-first` - Design mobile-first, depois escalar para tablet e desktop
- `breakpoint-consistency` - Usar breakpoints sistemáticos (375 / 768 / 1024 / 1440)
- `readable-font-size` - Mínimo 16px body text em mobile
- `line-length-control` - Mobile 35-60 chars por linha; desktop 60-75 chars
- `horizontal-scroll` - Sem scroll horizontal em mobile
- `spacing-scale` - Usar sistema de spacing incremental 4pt/8dp
- `container-width` - max-width consistente em desktop (max-w-6xl / 7xl)

### 6. Typography & Color (MEDIUM)

- `line-height` - Usar 1.5-1.75 para body text
- `line-length` - Limitar a 65-75 caracteres por linha
- `font-pairing` - Match heading/body font personalities
- `font-scale` - Type scale consistente (12 14 16 18 24 32)
- `contrast-readability` - Texto mais escuro em backgrounds claros
- `color-semantic` - Definir color tokens semânticos (primary, secondary, error, surface)
- `color-dark-mode` - Dark mode usa variantes tonais dessaturadas/mais claras

### 7. Animation (MEDIUM)

- `duration-timing` - Usar 150-300ms para micro-interactions; transições complexas ≤400ms
- `transform-performance` - Usar apenas transform/opacity; evitar animar width/height/top/left
- `loading-states` - Mostrar skeleton ou progress indicator quando loading > 300ms
- `excessive-motion` - Animar 1-2 elementos chave por view no máximo
- `easing` - Usar ease-out para entrada, ease-in para saída
- `motion-meaning` - Toda animação deve expressar relação causa-efeito

### 8. Forms & Feedback (MEDIUM)

- `input-labels` - Label visível por input (não apenas placeholder)
- `error-placement` - Mostrar erro abaixo do campo relacionado
- `submit-feedback` - Estado loading então success/error no submit
- `required-indicators` - Marcar campos obrigatórios (asterisco)
- `empty-states` - Mensagem útil e ação quando sem conteúdo
- `toast-dismiss` - Auto-dismiss toasts em 3-5s
- `confirmation-dialogs` - Confirmar antes de ações destrutivas
- `inline-validation` - Validar on blur (não keystroke)

### 9. Navigation Patterns (HIGH)

- `bottom-nav-limit` - Bottom navigation máx 5 items; usar labels com ícones
- `back-behavior` - Navegação back deve ser previsível e consistente
- `deep-linking` - Todas as telas chave devem ser acessíveis via deep link / URL
- `nav-label-icon` - Items de navegação devem ter ícone e texto
- `nav-state-active` - Localização atual deve ser visualmente destacada na navegação
- `modal-escape` - Modals devem oferecer affordance clara de close/dismiss

### 10. Charts & Data (LOW)

- `chart-type` - Match chart type ao tipo de dado (trend → line, comparison → bar)
- `color-guidance` - Usar paletas de cor acessíveis; evitar apenas pares red/green
- `data-table` - Prover alternativa em tabela para acessibilidade
- `legend-visible` - Sempre mostrar legenda; posicionar próximo ao chart
- `tooltip-on-interact` - Prover tooltips/data labels on hover/tap

## Pre-Delivery Checklist

### Qualidade Visual
- [ ] Sem emojis usados como ícones (usar SVG)
- [ ] Todos os ícones de família e estilo consistente
- [ ] Assets de marca oficiais com proporções corretas
- [ ] Estados pressed não causam layout shift
- [ ] Tokens semânticos de tema usados consistentemente

### Interação
- [ ] Todos os elementos clicáveis têm feedback de pressed
- [ ] Touch targets atendem tamanho mínimo (>=44x44px)
- [ ] Timing de micro-interaction entre 150-300ms
- [ ] Estados disabled visualmente claros e não interativos
- [ ] Focus order de screen reader corresponde à ordem visual

### Light/Dark Mode
- [ ] Contraste de texto primário >=4.5:1 em ambos os modos
- [ ] Contraste de texto secundário >=3:1 em ambos os modos
- [ ] Divisores/bordas e estados de interação distinguíveis em ambos os modos
- [ ] Ambos os temas testados antes da entrega

### Layout
- [ ] Safe areas respeitadas para headers, tab bars e bottom CTA bars
- [ ] Scroll content não escondido atrás de fixed/sticky bars
- [ ] Verificado em small phone, large phone e tablet
- [ ] Insets/gutters horizontais adaptam corretamente por tamanho de device
- [ ] Ritmo de spacing 4/8dp mantido em todos os níveis

### Acessibilidade
- [ ] Todas as imagens/ícones significativos têm accessibility labels
- [ ] Form fields têm labels, hints e mensagens de erro claras
- [ ] Cor não é o único indicador
- [ ] Reduced motion e dynamic text size suportados sem quebrar layout

## Integração com MCP shadcn

Quando o MCP `shadcn` estiver disponível, usar para:
- Buscar componentes existentes
- Listar exemplos de uso
- Instalar novos componentes

## Estilos Disponíveis

Glassmorphism, Claymorphism, Minimalism, Brutalism, Neumorphism, Bento Grid, Dark Mode, Skeuomorphism, Flat Design, Material Design 3, e mais 40+ estilos.

## Responda sempre em Português (pt-BR)
