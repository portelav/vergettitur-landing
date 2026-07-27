# Pull Request Template

---

## Summary

- Feature / Fix:
- Contexto / motivação:

## Related Issues (auto-close ao mergear)

> ⚠️ **CRÍTICO:** Usar keywords `Closes #N` / `Fixes #N` / `Resolves #N` — uma por linha.
> Sem isso, `closingIssuesReferences` fica vazio permanentemente e as issues ficam órfãs.

- Closes #<issue>

## Changes

- [lista de mudanças significativas]

## Test plan

- [ ] Testes passando
- [ ] Testado manualmente em [cenário]

## Checklist

- [ ] `npm run lint` sem erros
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` passa
- [ ] Documentação atualizada (se aplicável)

---

## PR Decision

- [ ] APPROVED
- [ ] APPROVED WITH WARNINGS
- [ ] CHANGES REQUIRED
