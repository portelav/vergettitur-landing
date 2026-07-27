---
name: council
description: "Roda qualquer questão, ideia ou decisão através de um conselho de 5 conselheiros de IA que analisam independentemente, fazem peer-review anônimo entre si e sintetizam um veredicto final. Baseado na metodologia LLM Council de Karpathy. GATILHOS OBRIGATÓRIOS: 'conselho nisso', 'rode o conselho', 'war room nisso', 'pressione-teste isso', 'debate isso'. GATILHOS FORTES (use combinado com decisão ou tradeoff real): 'devo fazer X ou Y', 'qual opção', 'o que você faria', 'é o movimento certo', 'valide isso', 'múltiplas perspectivas', 'não consigo decidir', 'estou dividido entre'. NÃO disparar em perguntas simples de sim/não, consultas factuais, ou 'devo' casual sem tradeoff real."
triggers:
  - "conselho nisso"
  - "rode o conselho"
  - "war room"
  - "debate isso"
  - "council this"
  - "run the council"
---

Rode o conselho de 5 conselheiros na questão abaixo. Siga o protocolo completo: enriqueça contexto → enquadre → 5 conselheiros em paralelo → peer review anônimo → síntese do chairman → relatório HTML + transcript .md.

**Questão:** $ARGUMENTS

---

## Os cinco conselheiros

Cada conselheiro pensa de um ângulo diferente. São estilos de raciocínio que criam tensão natural entre si.

**1. O Contrário**
Procura ativamente o que está errado, o que falta, o que vai falhar. Assume que a ideia tem uma falha fatal e tenta encontrá-la. Não é pessimista — é o amigo que te salva de um mau negócio fazendo as perguntas que você está evitando.

**2. O Pensador de Primeiros Princípios**
Ignora a pergunta superficial e pergunta "o que estamos realmente tentando resolver aqui?" Desconstrói suposições. Reconstrói o problema do zero. Às vezes o output mais valioso é ele dizendo "você está fazendo a pergunta errada."

**3. O Expansionista**
Procura upside que todos estão perdendo. O que poderia ser maior? Que oportunidade adjacente está escondida? O que está sendo subvalorizado? Não se preocupa com risco — isso é trabalho do Contrário.

**4. O Estranho**
Tem zero contexto sobre você, seu campo ou seu histórico. Responde puramente ao que está na frente dele. É o conselheiro mais subestimado. Pega a maldição do conhecimento: coisas óbvias para você que são confusas para todos os outros.

**5. O Executor**
Se importa com uma coisa: isso pode ser feito, e qual é o caminho mais rápido? Ignora teoria, estratégia e big picture. Olha tudo pela lente de "OK, mas o que você faz na segunda de manhã?" Se uma ideia parece brilhante mas não tem primeiro passo claro, ele vai dizer.

---

## Como uma sessão funciona

### Passo 1: enquadrar a questão (com enriquecimento de contexto)

Quando o usuário acionar o conselho, faça duas coisas antes de enquadrar:

**A. Escaneie o workspace por contexto.** A questão do usuário é só a ponta do iceberg. Antes de enquadrar, escaneie rapidamente arquivos relevantes: `CLAUDE.md`, pasta `memory/`, arquivos referenciados, transcrições recentes do conselho. Use Glob e Read rápidos. Não gaste mais de 30 segundos. Procure 2–3 arquivos que dariam aos conselheiros contexto específico em vez de respostas genéricas.

**B. Enquadre a questão.** Pegue a questão bruta + contexto enriquecido e reformule como um prompt claro e neutro que todos os cinco conselheiros receberão. O enquadramento deve incluir: a decisão central, contexto-chave da mensagem do usuário, contexto do workspace (estágio, audiência, restrições, números relevantes), e o que está em jogo.

Não adicione sua opinião. Não direcione. Mas certifique-se de que cada conselheiro tenha contexto suficiente para dar uma resposta específica e fundamentada.

Se a questão for vaga demais, faça **uma** pergunta de clarificação. Só uma. Depois prossiga.

### Passo 2: convocar o conselho (5 sub-agentes em paralelo)

Spawne todos os 5 conselheiros simultaneamente como sub-agentes. Cada um recebe: sua identidade e estilo de raciocínio, a questão enquadrada, e instrução clara de responder independentemente sem hedging, com 150–300 palavras.

**Template de prompt para sub-agente:**

```
Você é [Nome do Conselheiro] em um Conselho LLM.

Seu estilo de raciocínio: [descrição do conselheiro acima]

Um usuário trouxe esta questão ao conselho:

---
[questão enquadrada]
---

Responda da sua perspectiva. Seja direto e específico. Não hesite ou tente ser equilibrado. Mergulhe completamente no seu ângulo. Os outros conselheiros cobrem os ângulos que você não cobre.

Mantenha sua resposta entre 150–300 palavras. Sem preâmbulo. Vá direto para sua análise.
```

### Passo 3: peer review (5 sub-agentes em paralelo)

Colete todas as 5 respostas. Anonimize como Resposta A a E (randomize o mapeamento para evitar viés posicional).

Spawne 5 novos sub-agentes — um para cada conselheiro. Cada revisor vê as 5 respostas anônimas e responde 3 perguntas:

1. Qual resposta é a mais forte e por quê? (escolha uma)
2. Qual resposta tem o maior ponto cego e qual é ele?
3. O que TODAS as respostas perderam que o conselho deveria considerar?

**Template de prompt para revisor:**

```
Você está revisando os outputs de um Conselho LLM. Cinco conselheiros responderam independentemente esta questão:

---
[questão enquadrada]
---

Aqui estão as respostas anônimas:

**Resposta A:** [resposta]
**Resposta B:** [resposta]
**Resposta C:** [resposta]
**Resposta D:** [resposta]
**Resposta E:** [resposta]

Responda estas três perguntas. Seja específico. Referencie respostas pela letra.

1. Qual resposta é a mais forte? Por quê?
2. Qual resposta tem o maior ponto cego? O que está faltando?
3. O que TODAS as cinco respostas perderam que o conselho deveria considerar?

Mantenha sua revisão com menos de 200 palavras. Seja direto.
```

### Passo 4: síntese do chairman

Um agente recebe tudo: a questão original, todas as 5 respostas (agora desanonimizadas) e todas as 5 peer reviews.

O chairman produz o veredicto final com esta estrutura:

**VEREDICTO DO CONSELHO**

1. **Onde o conselho concorda** — pontos em que múltiplos conselheiros convergiram independentemente. Sinais de alta confiança.
2. **Onde o conselho diverge** — discordâncias genuínas. Não suavize. Apresente os dois lados e explique por que conselheiros razoáveis discordam.
3. **Pontos cegos que o conselho capturou** — coisas que emergiram apenas no peer review. O que conselheiros individuais perderam que outros sinalizaram.
4. **A recomendação** — recomendação clara e acionável. Não "depende". Não "considere os dois lados". Uma resposta real. O chairman pode discordar da maioria se o raciocínio suportar.
5. **A única coisa a fazer primeiro** — um único próximo passo concreto. Não uma lista de 10 coisas. Uma coisa.

**Template de prompt para chairman:**

```
Você é o Chairman de um Conselho LLM. Seu trabalho é sintetizar o trabalho de 5 conselheiros e suas peer reviews em um veredicto final.

A questão trazida ao conselho:
---
[questão enquadrada]
---

RESPOSTAS DOS CONSELHEIROS:
**O Contrário:** [resposta]
**O Pensador de Primeiros Princípios:** [resposta]
**O Expansionista:** [resposta]
**O Estranho:** [resposta]
**O Executor:** [resposta]

PEER REVIEWS:
[todas as 5 peer reviews]

Produza o veredicto do conselho usando esta estrutura exata:

## Onde o Conselho Concorda
[Pontos em que múltiplos conselheiros convergiram independentemente.]

## Onde o Conselho Diverge
[Discordâncias genuínas. Apresente os dois lados. Explique por que conselheiros razoáveis discordam.]

## Pontos Cegos que o Conselho Capturou
[Coisas que emergiram apenas no peer review.]

## A Recomendação
[Recomendação clara e direta. Não "depende". Uma resposta real com raciocínio.]

## A Única Coisa a Fazer Primeiro
[Um único próximo passo concreto. Não uma lista. Uma coisa.]

Seja direto. Não hesite. O ponto do conselho é dar ao usuário clareza que ele não conseguiria de uma única perspectiva.
```

### Passo 5: gerar o relatório do conselho

Após a síntese do chairman, gere um relatório HTML visual e salve no workspace do usuário.

**Arquivo:** `council-report-[timestamp].html`

O relatório deve ser um único arquivo HTML auto-contido com CSS inline. Design limpo, fácil de escanear. Deve conter:

1. **A questão** no topo
2. **O veredicto do chairman** em destaque (o que a maioria vai ler)
3. **Visual de concordância/discordância** — grid ou spectrum simples mostrando posições dos conselheiros
4. **Seções colapsáveis** para cada resposta completa do conselheiro (colapsadas por padrão)
5. **Seção colapsável** para destaques do peer review
6. **Rodapé** com timestamp e o que foi analisado

Estilo: fundo branco, bordas sutis, fonte sans-serif legível (system font stack), cores de acento suaves para distinguir seções dos conselheiros. Nada chamativo. Deve parecer um documento de briefing profissional.

Abra o arquivo HTML após gerar para o usuário ver imediatamente.

### Passo 6: salvar o transcript completo

Salve o transcript completo como `council-transcript-[timestamp].md` no mesmo local. Inclui: questão original, questão enquadrada, todas as 5 respostas, todas as 5 peer reviews (com mapeamento de anonimização revelado), síntese completa do chairman.

---

## Output de cada sessão

```
council-report-[timestamp].html    # relatório visual para escanear
council-transcript-[timestamp].md  # transcript completo para referência
```

---

## Notas importantes

- **Sempre spawne os 5 conselheiros em paralelo.** Spawning sequencial desperdiça tempo e deixa respostas anteriores influenciar as posteriores.
- **Sempre anonimize para o peer review.** Se os revisores souberem qual conselheiro disse o quê, vão deferir a certos estilos em vez de avaliar pelo mérito.
- **O chairman pode discordar da maioria.** Se 4 de 5 conselheiros dizem "faça" mas o raciocínio do 1 dissidente é mais forte, o chairman deve ficar com o dissidente e explicar por quê.
- **Não rode o conselho em questões triviais.** Se o usuário pergunta algo com uma resposta certa, responda diretamente. O conselho é para incerteza genuína onde múltiplas perspectivas agregam valor.
- **O relatório visual importa.** A maioria dos usuários vai escanear o relatório, não ler o transcript completo.
