import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/config';
import { motion } from 'motion/react';

interface FloatingWhatsAppProps {
  customMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ customMessage }) => {
  const href = getWhatsAppUrl(customMessage);

  return (
    <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-40">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-action"
        className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl border border-white/20 cursor-pointer"
        title="Fale connosco no WhatsApp"
        aria-label="Fale connosco no WhatsApp"
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </aside>
  );
};
