import React from 'react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';

export const ContactPage: React.FC = () => (
  <div className="pt-28 pb-20 min-h-screen bg-[#F7F9FC]">
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mb-7">
        <span className="text-xs uppercase tracking-[0.18em] text-[#D93030] font-bold">Contactos</span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#14245F] mt-2">Fale com a 2S</h1>
        <p className="text-sm sm:text-base text-[#667085] mt-2 max-w-2xl">
          Para saber mais sobre um imóvel, marcar uma visita ou colocar uma propriedade no nosso portfólio, fale directamente com a equipa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E1E6EE] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#14245F]">Contactos directos</h2>
          <div className="space-y-4 mt-6 text-sm text-[#566176]">
            <a href={'tel:' + BRAND_CONFIG.phone} className="flex items-center gap-3 hover:text-[#D93030]">
              <Phone className="w-5 h-5 text-[#D93030]" />
              <span>{BRAND_CONFIG.phoneDisplay}</span>
            </a>
            <a href={'mailto:' + BRAND_CONFIG.email} className="flex items-center gap-3 hover:text-[#D93030]">
              <Mail className="w-5 h-5 text-[#D93030]" />
              <span>{BRAND_CONFIG.email}</span>
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#D93030]" />
              <span>{BRAND_CONFIG.location.city}, {BRAND_CONFIG.location.country}</span>
            </div>
          </div>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 w-full py-3 rounded-xl bg-[#D93030] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[#BF2525]"
          >
            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
          </a>
        </div>

        <div className="bg-[#14245F] rounded-2xl p-6 sm:p-8 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-bold">Agendar uma visita</p>
          <h2 className="text-2xl font-semibold mt-2">Já encontrou uma casa?</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Abra a propriedade, escolha a data e a hora e preencha os seus dados. O site prepara a mensagem para o WhatsApp da 2S.
          </p>
          <a
            href="/agendar"
            className="mt-7 inline-flex px-5 py-3 rounded-xl bg-white text-[#14245F] font-semibold text-sm hover:bg-white/90"
          >
            Marcar visita
          </a>
        </div>
      </div>
    </section>
  </div>
);
