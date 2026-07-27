---
name: refine
description: Reescreve prompts crus em prompts estruturados de alta qualidade. Identifica gaps (persona, contexto, critérios, restrições), coleta interativamente os dados faltantes via AskUserQuestion, e produz prompt pronto para uso. Detecta intent e roteia para /plan, /exec, /walkthrough, CoT, ToT ou Council após reescrever. Use quando o usuário invocar /refine, pedir para "melhorar esse prompt", "refinar esse prompt", "aprimorar prompt", "refine prompt", "refine this prompt", "enhance prompt", "improve this prompt", ou enviar prompt claramente ambíguo, curto demais ou sem critérios de aceite.
triggers:
  - "aprimorar prompt"
  - "melhore esse prompt"
  - "refine esse prompt"
  - "melhora esse prompt"
  - "refine prompt"
  - "refine this prompt"
  - "enhance prompt"
  - "improve this prompt"
---

Aprimorador de Prompts — Protocolo de Execução

Saída SEM títulos `#`/`##` em qualquer parte. Use labels em negrito ou prosa direta. Usuário copia e cola o prompt reescrito; hashtags são ruído.

---

**Passo 1 — Detecção de intent**

Analise o prompt original e classifique:

| Sinais no prompt original | Intent | Agente alvo |
|---------------------------|--------|-------------|
| "implementar feature", "planejar", "nova mecânica/tela", "analisar tarefa", "criar tasks/{slug}.md" | planning | `/plan` |
| "executar plano", "implementar tasks/{slug}", "rodar o plano", "implementação aprovada" | execution | `/exec` |
| "auditar", "walkthrough", "revisar implementação", "checar qualidade", "validar antes do PR" | walkthrough | `/walkthrough` |
| Hotfix urgente, ≤ 3 arquivos, ajuste visual, doc simples | trivial | nenhum agente — fluxo reduzido |
| Causa raiz não óbvia, bug complexo, decisão arquitetural sem múltiplas alternativas | raciocínio | `cot-thinker` |
| 2+ abordagens plausíveis mutuamente exclusivas | comparação | `tot-explorer` |
| Decisão estratégica com tradeoffs e stakeholders | conselho | `llm-council` |
| Pedido direto sem encaixe acima | default | nenhum — apenas reescreve |

Declare o intent detectado em 1 linha: `Intent: <plan|exec|walkthrough|cot|tot|council|trivial|default>`.

---

**Passo 2 — Diagnóstico de gaps**

Liste apenas os gaps reais encontrados (bullets simples):

- Persona não declarada
- Contexto insuficiente (fatos faltando: X, Y)
- Tarefa ambígua (pode significar A ou B)
- Formato de saída não especificado (omitir se intent ∈ {plan, exec, walkthrough})
- Critérios de aceite ausentes
- Restrições não declaradas (stack, prazo, performance)
- Permissão para falhar ausente

Se algo já está OK, não liste.

---

**Passo 2.5 — Coleta interativa de gaps críticos**

Antes de gerar o prompt, identifique quais gaps não têm base explícita na conversa (itens que seriam marcados `[A CONFIRMAR: ...]`).

Se houver ≥ 1 gap crítico sem base, **pause e use `AskUserQuestion`** para coletar as respostas. Regras:

- Máximo 4 perguntas por invocação
- Cada pergunta deve ter 2–4 opções representativas + "Other" (automático)
- Priorize gaps que impactam diretamente Persona, Tarefa ou Critérios de aceite
- Gaps de baixa criticidade (ex: preferência de formato) podem ser inferidos — anote no Diff
- Após receber respostas, use-as diretamente no Passo 3 **sem marcar** `[A CONFIRMAR: ...]`
- Se o usuário não responder ou selecionar "Other" sem texto, use inferência e marque `[inferido — sem confirmação]`

Só prossiga para o Passo 3 após coletar as respostas ou se não houver gaps críticos.

---

**Passo 3 — Prompt reescrito**

Produza o prompt em **bloco único de código** (` ```text `), sem `#`/`##` internos. Template canônico:

```text
**Persona**: Aja como [papel] com [experiência] em [stack/domínio].

**Contexto**:
- [Fato verificável 1]
- [Fato verificável 2]
- Restrições: [stack, prazo, performance, o que não pode quebrar]
- Não assuma: [lista do que NÃO inferir]

**Tarefa**: [Verbo imperativo] [objeto] de modo que [resultado mensurável].

**Critérios de aceite**:
1. [Critério objetivo e verificável]
2. [Critério objetivo e verificável]

**Permissão para falhar**: Se faltar informação essencial, responda "Confiança: LOW — preciso de X" em vez de adivinhar.
```

Regras de inclusão:

- **Formato de saída**: incluir apenas se intent = `default`. Quando intent ∈ {plan, exec, walkthrough}, o agente downstream já define formato — omita a seção.
- **Persona/Contexto/Tarefa/Critérios/Permissão**: sempre presentes.

---

**Passo 4 — Diff dos gaps**

Bullets simples. Mostre o que foi adicionado/inferido versus original:

- `+ Persona`: [o que foi inserido e por quê]
- `+ Contexto`: [fatos inferidos da conversa]
- `+ Restrições`: [o que foi assumido]
- `~ Tarefa`: [reformulação — objetivo era preservar intenção]

---

**Passo 5 — Invocação do agente downstream**

Agentes downstream se dividem em duas classes com regras distintas de invocação:

- **Agentes com efeito** (alteram código, arquivos ou estado do projeto): `plan`, `exec`, `walkthrough`. **EXIGEM confirmação explícita** do usuário sobre o prompt reescrito ANTES de qualquer invocação.
- **Agentes de raciocínio puro** (não alteram estado): `cot`, `tot`, `council`. Invocação automática preservada.

**Para intents `plan` | `exec` | `walkthrough`** — pause após o Passo 4 e use `AskUserQuestion` com exatamente 3 opções:

1. `Aprovar e executar /<agente> agora` — invoca o agente com o prompt reescrito
2. `Refinar mais o prompt antes de executar` — volta ao Passo 2.5 para nova rodada de gaps
3. `Só entregar o prompt reescrito sem executar` — encerra entregando o prompt; não invoca

Default seguro: se o usuário não responder, fechar sem selecionar, ou escolher "Other" sem texto explícito autorizando execução → **NÃO invoca**; encerra entregando apenas o prompt reescrito.

**Para intents `cot` | `tot` | `council`** — invocação automática direta, sem confirmação.

Tabela de mapeamento atualizada:

| Intent | Ação |
|--------|------|
| `plan` | **Confirma via AskUserQuestion (3 opções)** → se aprovado, `Skill(skill="plan", args=<prompt reescrito>)` |
| `exec` | **Confirma via AskUserQuestion (3 opções)** → se aprovado, `Skill(skill="exec", args=<prompt reescrito>)` |
| `walkthrough` | **Confirma via AskUserQuestion (3 opções)** → se aprovado, `Skill(skill="walkthrough", args=<prompt reescrito>)` |
| `cot` | `Skill(skill="cot", args=<prompt reescrito>)` — automático |
| `tot` | `Skill(skill="tot", args=<prompt reescrito>)` — automático |
| `council` | `Skill(skill="council", args=<prompt reescrito>)` — automático |
| `default` | Não invoca — apenas entrega prompt reescrito |
| `trivial` | Não invoca — sugere fluxo reduzido |

Declare antes de invocar (após aprovação, quando houver): `Roteando para /<agente>...`

Se o usuário pedir "só reescrever" em qualquer ponto, pule o Passo 5 inteiro.

---

Regras:

- Não invente fatos. Infira apenas do contexto da conversa. Sem base explícita → pergunte (Passo 2.5) ou marque `[inferido — sem confirmação]`.
- Preserve a intenção original — não mude o que o usuário quer fazer.
- Se o prompt original já está bem estruturado, diga isso em 1 linha e retorne sem reescrever.
- Tom do prompt gerado: técnico-direto, pt-BR.
- Output NUNCA usa `#` ou `##` — sempre labels em negrito ou prosa.

**Prompt original:** $ARGUMENTS
