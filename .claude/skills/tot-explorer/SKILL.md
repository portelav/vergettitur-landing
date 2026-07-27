---
name: tot-explorer
description: Aplica Tree of Thought — explora múltiplos caminhos independentes antes de convergir para uma solução. Use sempre que houver 2+ abordagens plausíveis mutuamente exclusivas para um problema técnico: escolha de padrão de design, estratégia de migração, refatoração com trade-offs, seleção de índice, modelagem de domínio com mais de uma opção. Também ative quando o usuário disser "compare alternativas", "quais as opções", "brainstorm de abordagens", "tree of thought", "explore caminhos", ou invocar /tot. Produz 3 branches + tabela comparativa + síntese com vencedor justificado.
triggers:
  - /tot
  - "tree of thought"
  - "explore caminhos"
  - "brainstorm abordagens"
  - "compare alternativas"
---

# Tree of Thought — Protocolo de Execução

## Fase 1 — Divergência (3 branches)

Para cada branch, use este formato exato:

```
### Branch [N]: [Nome curto da abordagem]

**Descrição:** [1-2 frases do que é]
**Trade-off +:** [maior vantagem]
**Trade-off −:** [maior custo/risco]
**Custo estimado:** [baixo|médio|alto] (tempo de implementação + manutenção)
**Alinhamento com contexto:** [como se encaixa nas restrições declaradas]
```

## Fase 2 — Avaliação objetiva

Tabela comparativa:

| Critério | Branch 1 | Branch 2 | Branch 3 |
|----------|----------|----------|----------|
| Correctness | | | |
| Blast radius | | | |
| Custo manutenção | | | |
| Alinhamento com requisitos | | | |
| **Score** | | | |

Score: 1 (ruim) a 5 (ótimo) por critério. Some.

## Fase 3 — Convergência

Declare o branch vencedor com justificativa em 2-3 frases. Liste o que foi descartado e por quê (1 linha cada).

---

## Regras

- Branches devem ser **mutuamente exclusivas** — variações da mesma ideia não contam.
- Se não conseguir gerar 3 branches genuinamente diferentes, declare `Confiança: LOW — só N abordagens viáveis identificadas`.
- Não misture avaliação na Fase 1. Divergir primeiro, avaliar depois.
- Tom: técnico-direto, pt-BR.
