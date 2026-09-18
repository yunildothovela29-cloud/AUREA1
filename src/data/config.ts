export const BRAND_CONFIG = {
  name: '2S IMOBILIÁRIA & SERVIÇOS',
  shortName: '2S',
  tagline: 'Casas certas. Escolhas simples.',
  subtagline: 'Encontre casas e outros imóveis disponíveis em Maputo, veja os detalhes e marque uma visita directamente com a nossa equipa.',
  phone: '+258 84 406 7591',
  phoneDisplay: '+258 84 406 7591',
  email: 'sergio.sulemane@gmail.com',
  whatsappNumber: '258844067591',
  whatsappDefaultMessage: 'Olá, gostaria de obter informações sobre os imóveis da 2S Imobiliária & Serviços.',
  admin: { email: 'sergio.sulemane@gmail.com', whatsappNumber: '258844067591' },
  location: { city: 'Maputo', country: 'Moçambique' },
  officeHours: { weekdays: 'Segunda a Sexta: 08:30 – 18:30', saturdays: 'Sábado: 09:00 – 14:00' },
};

export function getWhatsAppUrl(customText?: string): string {
  const text = encodeURIComponent(customText || BRAND_CONFIG.whatsappDefaultMessage);
  return 'https://wa.me/' + BRAND_CONFIG.whatsappNumber + '?text=' + text;
}

export function getPropertyWhatsAppUrl(propertyTitle: string, propertyId: string): string {
  return getWhatsAppUrl('Olá, gostaria de saber mais informações sobre a propriedade "' + propertyTitle + '" (Ref: ' + propertyId + ').');
}

export function getVisitWhatsAppUrl(data: {
  clientName: string; clientPhone: string; clientEmail: string;
  propertyTitle: string; propertyId: string; preferredDate: string; preferredTime: string;
}): string {
  const message = [
    'Olá Sérgio, chamo-me ' + data.clientName + '.',
    'Gostei da propriedade "' + data.propertyTitle + '" (Ref: ' + data.propertyId + ') e quero marcar uma visita.',
    'Dia: ' + data.preferredDate,
    'Hora: ' + data.preferredTime,
    'Meu telefone: ' + data.clientPhone,
    'Meu email: ' + data.clientEmail,
  ].join('\n');
  return 'https://wa.me/' + BRAND_CONFIG.admin.whatsappNumber + '?text=' + encodeURIComponent(message);
}
