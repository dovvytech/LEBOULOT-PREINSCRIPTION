export const WHATSAPP_NUMBER = '237675558805';

export function getWhatsAppUrl(message: string = ''): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

export function sendWhatsApp(message: string = ''): void {
  window.open(getWhatsAppUrl(message), '_blank');
}
