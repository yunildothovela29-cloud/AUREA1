import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#1A1512] text-[#E8E2D6] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 pb-20 border-b border-[#3E3227]">
          {/* Brand Presentation */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.2em] text-[#FAF8F5] block font-normal uppercase">
                Aurea
              </span>
            </Link>
            <p className="text-sm text-[#A3978B] font-light leading-relaxed max-w-sm">
              Propriedades escolhidas com critério, apresentadas com clareza e acompanhadas de perto.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#8C8074] font-semibold">
              Explorar
            </h4>
            <ul className="space-y-4 text-xs font-medium tracking-wide text-[#E8E2D6]">
              <li>
                <Link to="/comprar" className="hover:text-white transition-colors">Comprar</Link>
              </li>
              <li>
                <Link to="/arrendar" className="hover:text-white transition-colors">Arrendar</Link>
              </li>
              <li>
                <Link to="/empreendimentos" className="hover:text-white transition-colors">Empreendimentos</Link>
              </li>
              <li>
                <Link to="/vender" className="hover:text-white transition-colors">Vender</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Office */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#8C8074] font-semibold">
              Maputo
            </h4>
            <div className="space-y-4 text-xs text-[#E8E2D6] leading-relaxed font-medium">
              <div>
                <a href={`tel:${BRAND_CONFIG.phone}`} className="hover:text-white transition-colors block">
                  {BRAND_CONFIG.phoneDisplay}
                </a>
                <a href={`mailto:${BRAND_CONFIG.email}`} className="hover:text-white transition-colors block mt-1">
                  {BRAND_CONFIG.email}
                </a>
              </div>
              <div className="pt-2 text-[#A3978B]">
                Seg–Sex, {BRAND_CONFIG.officeHours.weekdays}
              </div>
            </div>
          </div>
        </div>

        {/* Legal and Disclaimer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#6B5E54]">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Todos os direitos reservados.
          </p>
          <p className="text-center sm:text-right max-w-xl">
            Plataforma fictícia criada para demonstração comercial. As imagens e referências pertencem a demonstrações arquitectónicas de direitos abertos.
          </p>
        </div>
      </div>
    </footer>
  );
};
