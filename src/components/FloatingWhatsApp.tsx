import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/config';

interface FloatingWhatsAppProps {
  customMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ customMessage }) => {
  const href = getWhatsAppUrl(customMessage);

  return (
    <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-40">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-action"
        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
        title="Fale connosco no WhatsApp"
        aria-label="Fale connosco no WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </aside>
  );
};

