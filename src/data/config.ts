/**
 * Global Brand & Contact Configuration
 * All corporate identity values are centralized here for immediate customization.
 */

export const BRAND_CONFIG = {
  // Brand identity
  name: 'AUREA PROPERTIES',
  introBrandSymbol: 'X',
  introSubtitle: 'Acesso Privado',
  legalName: 'Aurea Real Estate & Architecture Advisory Lda.',
  tagline: 'Espaços que combinam consigo',
  subtagline: 'Propriedades seleccionadas para viver, investir e começar uma nova etapa em Maputo.',
  subbrand: 'Mediação Imobiliária & Arquitectura',
  
  // Commercial contact points (fictitious, customizable)
  phone: '+258 84 900 1234',
  phoneDisplay: '+258 84 900 1234',
  secondaryPhone: '+258 21 490 888',
  email: 'contacto@aureaproperties.mz',
  salesEmail: 'vendas@aureaproperties.mz',
  
  // WhatsApp config: phone digits only, no symbols
  whatsappNumber: '258849001234',
  whatsappDefaultMessage: 'Olá, gostaria de obter informações sobre as propriedades da Aurea Properties.',
  
  // Physical headquarters
  location: {
    street: 'Avenida Julius Nyerere, 1420',
    building: 'Edifício Zenith Corporate, 7º Andar',
    neighborhood: 'Polana Cimento B',
    city: 'Maputo',
    country: 'Moçambique',
  },
  
  // Office hours
  officeHours: {
    weekdays: 'Segunda a Sexta: 08:30 – 18:30',
    saturdays: 'Sábado: 09:00 – 14:00',
    sundays: 'Domingo: Apenas visitas pré-agendadas',
  },
  
  // Social links (placeholders for business presence)
  social: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
  },
};

/**
 * Builds a direct WhatsApp message URL for general inquiries or specific properties
 */
export function getWhatsAppUrl(customText?: string): string {
  const text = encodeURIComponent(customText || BRAND_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${text}`;
}

/**
 * Builds a direct WhatsApp inquiry URL mentioning a specific property
 */
export function getPropertyWhatsAppUrl(propertyTitle: string, propertyId: string): string {
  const text = `Olá, gostaria de saber mais informações sobre o imóvel "${propertyTitle}" (Ref: ${propertyId}) disponível na Aurea Properties.`;
  return getWhatsAppUrl(text);
}
