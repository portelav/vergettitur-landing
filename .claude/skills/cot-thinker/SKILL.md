---
name: cot-thinker
description: Aplica Chain of Thought explícito antes de responder problemas complexos. Força raciocínio passo a passo antes de produzir output. Use sempre que o problema envolver bug com causa não óbvia, decisão arquitetural, refatoração com efeito colateral, erro em produção, ou qualquer situação onde "por que isso acontece?" não tem resposta imediata. Também ative quando o usuário disser "pense passo a passo", "raciocine antes", "chain of thought", "analise antes de responder", ou invocar /cot. Prefira usar esta skill em dúvida — raciocínio estruturado nunca piora a resposta.
triggers:
  - /cot
  - "pense passo a passo"
  - "raciocine antes"
  - "chain of thought"
---

# Chain of Thought — Protocolo de Execução

Antes de responder, percorra obrigatoriamente estes passos na ordem:

**1. Causa raiz**
Qual é o problema real? Não o sintoma — a causa. Se não tiver certeza, declare `Confiança: LOW` e liste o que falta saber.

**2. Por quê**
Por que essa causa produz esse efeito? Trace a cadeia de causalidade em 1-3 frases.

**3. Hipóteses**
Liste 2-3 hipóteses de solução. Para cada uma: `[Hipótese] → [Trade-off+] → [Trade-off-]`.

**4. Eliminação**
Descarte hipóteses fracas com justificativa curta (1 linha cada).

**5. Decisão**
Escolha a hipótese restante. Justifique em 1-2 frases.

**E então:**
Produza o output (código, plano, resposta) com base na decisão acima.

---

## Regras

- Mínimo 3 passos, máximo 7.
- Se um passo não se aplica, diga `[N/A — motivo]` em vez de pular silenciosamente.
- Não inverta a ordem. Conclusão só depois de completar os passos.
- Tom: técnico-direto, pt-BR, fragmentos OK.
