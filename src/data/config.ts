export const BRAND_CONFIG = {
  name: '2Simoveis',
  shortName: '2S',
  introBrandSymbol: '2S',
  introSubtitle: 'Acesso Privado',
  tagline: 'Casas certas. Escolhas simples.',
  subtagline: 'Encontre casas e outros imóveis disponíveis em Maputo, veja os detalhes e marque uma visita directamente com a nossa equipa.',
  phone: '+258 84 406 7591',
  phoneDisplay: '+258 84 406 7591',
  email: 'sergio.sulemane@gmail.com',
  whatsappNumber: '258844067591',
  whatsappDefaultMessage: 'Olá, gostaria de obter informações sobre os imóveis da 2Simoveis.',
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
  propertyAddress?: string; extraMessage?: string;
}): string {
  // Parse at midday to avoid timezone shifts changing the displayed calendar day.
  const parsedDate = data.preferredDate
    ? new Date(data.preferredDate + 'T12:00:00')
    : null;
  const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? new Intl.DateTimeFormat('pt-MZ', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      }).format(parsedDate)
    : data.preferredDate;

  const lines = [
    'Boa tarde, Sérgio. Gostaria de marcar uma visita a esta propriedade.',
    '',
    'DADOS DO IMÓVEL',
    '• Imóvel: ' + data.propertyTitle,
    '• Referência: ' + data.propertyId,
    ...(data.propertyAddress ? ['• Localização: ' + data.propertyAddress] : []),
    '',
    'DATA E HORA PRETENDIDAS',
    '• Dia: ' + formattedDate,
    '• Hora: ' + data.preferredTime,
    '',
    'DADOS DO CLIENTE',
    '• Nome: ' + data.clientName,
    '• Telefone: ' + data.clientPhone,
    '• Email: ' + data.clientEmail,
  ];

  if (data.extraMessage?.trim()) {
    lines.push('', 'INFORMAÇÃO ADICIONAL', data.extraMessage.trim());
  }

  lines.push('', 'Fico a aguardar a confirmação da disponibilidade. Obrigado/a.');
  return 'https://wa.me/' + BRAND_CONFIG.admin.whatsappNumber + '?text=' + encodeURIComponent(lines.join('\n'));
}
