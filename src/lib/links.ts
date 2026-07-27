export const WHATSAPP_NUMBER = "5582988010740";

export function buildWhatsAppHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vi o site da Vergetti Turismo e quero saber mais sobre os passeios em Alagoas.";

export const WHATSAPP_HREF = buildWhatsAppHref(WHATSAPP_DEFAULT_MESSAGE);
