import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarDays, Home, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';

export const AboutPage: React.FC = () => (
  <div className="pt-28 pb-20 min-h-screen bg-[#F7F9FC]">
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="max-w-3xl mb-8">
        <p className="text-xs font-semibold text-[#D93030]">Sobre a 2Simoveisimoveis</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#14245F] mt-2">Imobiliária & Serviços</h1>
        <p className="text-sm sm:text-base text-[#667085] mt-3 leading-relaxed">
          A 2S apresenta imóveis para venda e arrendamento e facilita o contacto entre quem procura uma propriedade e a nossa equipa em Maputo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E1E6EE] rounded-2xl p-6">
          <Home className="w-6 h-6 text-[#D93030]" />
          <h2 className="font-semibold text-[#14245F] mt-4">Comprar</h2>
          <p className="text-sm text-[#667085] mt-2 leading-relaxed">Consulte imóveis disponíveis, compare detalhes e peça uma visita.</p>
        </div>
        <div className="bg-white border border-[#E1E6EE] rounded-2xl p-6">
          <Building2 className="w-6 h-6 text-[#D93030]" />
          <h2 className="font-semibold text-[#14245F] mt-4">Arrendar</h2>
          <p className="text-sm text-[#667085] mt-2 leading-relaxed">Veja as propriedades disponíveis para arrendamento e marque uma visita.</p>
        </div>
        <div className="bg-white border border-[#E1E6EE] rounded-2xl p-6">
          <CalendarDays className="w-6 h-6 text-[#D93030]" />
          <h2 className="font-semibold text-[#14245F] mt-4">Visitas</h2>
          <p className="text-sm text-[#667085] mt-2 leading-relaxed">Escolha a data e a hora. O pedido fica registado para a equipa.</p>
        </div>
      </div>

      <div className="mt-5 bg-[#14245F] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-semibold">Precisa de ajuda?</h2>
          <p className="text-sm text-white/70 mt-1">{BRAND_CONFIG.phoneDisplay} · {BRAND_CONFIG.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/comprar" className="px-4 py-2.5 rounded-xl bg-white text-[#14245F] text-sm font-semibold">Ver imóveis</Link>
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-[#D93030] text-white text-sm font-semibold inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        </div>
      </div>
    </section>
  </div>
);
