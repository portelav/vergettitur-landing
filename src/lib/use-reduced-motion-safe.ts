"use client";

/**
 * Decisão explícita (mesma do repo referência landing-hilton-loureiro):
 * a landing IGNORA `prefers-reduced-motion` do SO. Em ambientes de VM/RDP
 * (comum no dev deste projeto) o SO frequentemente reporta reduced-motion
 * mesmo sem o usuário ter pedido, o que apagava toda a animação da página.
 * Todos os usuários recebem a versão animada.
 *
 * Trade-off de a11y aceito: usuários com `prefers-reduced-motion: reduce`
 * de verdade também verão as animações. Outros eixos de acessibilidade
 * (contraste, focus visível, alt, hierarquia de heading, alvo touch ≥44px)
 * continuam de pé.
 *
 * Pra reverter: trocar o corpo por `useReducedMotion as useReducedMotionFromFramer`
 * do framer-motion + guarda de hidratação (mounted state), como estava antes.
 */
export function useReducedMotion(): boolean {
  return false;
}
