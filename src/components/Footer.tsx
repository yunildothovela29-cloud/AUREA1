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
    <footer id="main-footer" className="bg-[#FAF4ED] text-[#261B14] pt-24 pb-16 border-t border-[#E8E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-20 border-b border-[#E8E2D6]">
          {/* Brand Presentation */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#825A39]" />
                <span className="font-serif text-2xl tracking-[0.2em] text-[#221A15] block font-medium">
                  {BRAND_CONFIG.name}
                </span>
              </div>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#825A39] block font-mono mt-1">
                Imóveis de Autor • Maputo
              </span>
            </Link>
            <p className="text-sm text-[#5E5249] font-light leading-relaxed max-w-sm">
              Curadoria imobiliária dedicada a residências e espaços de autor em Maputo. 
              Unimos rigor arquitectónico, transparência processual e discrição em cada negócio.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F2ECE1] border border-[#E0D7C9] text-xs text-[#221A15] transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Atendimento directo via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider text-[#6B5E54]">
              <li>
                <Link to="/" className="hover:text-[#221A15] transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/comprar" className="hover:text-[#221A15] transition-colors">Comprar Imóveis</Link>
              </li>
              <li>
                <Link to="/arrendar" className="hover:text-[#221A15] transition-colors">Arrendar Imóveis</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-[#221A15] transition-colors">Sobre a Empresa</Link>
              </li>
              <li>
                <Link to="/contactos" className="hover:text-[#221A15] transition-colors">Contactos</Link>
              </li>
              <li>
                <Link to="/agendar" className="text-[#825A39] hover:text-[#5E3E26] font-semibold">Agendar Visita</Link>
              </li>
            </ul>
          </div>

          {/* Bairros de Maputo */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold">
              Localizações
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider text-[#6B5E54]">
              <li>
                <Link to="/comprar?bairro=Polana" className="hover:text-[#221A15] transition-colors">Polana</Link>
              </li>
              <li>
                <Link to="/comprar?bairro=Sommerschield" className="hover:text-[#221A15] transition-colors">Sommerschield</Link>
              </li>
              <li>
                <Link to="/comprar?bairro=Costa+do+Sol" className="hover:text-[#221A15] transition-colors">Costa do Sol</Link>
              </li>
              <li>
                <Link to="/comprar?bairro=Triunfo" className="hover:text-[#221A15] transition-colors">Triunfo</Link>
              </li>
              <li>
                <Link to="/comprar?bairro=Coop" className="hover:text-[#221A15] transition-colors">Coop</Link>
              </li>
              <li>
                <Link to="/comprar?bairro=Matola" className="hover:text-[#221A15] transition-colors">Matola</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Office */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold">
              Sede em Maputo
            </h4>
            <div className="space-y-2.5 text-xs text-[#5E5249] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#825A39] shrink-0 mt-0.5" />
                <span>
                  {BRAND_CONFIG.location.street}, {BRAND_CONFIG.location.building}
                  <br />
                  {BRAND_CONFIG.location.neighborhood}, {BRAND_CONFIG.location.city}, {BRAND_CONFIG.location.country}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#825A39] shrink-0" />
                <a href={`tel:${BRAND_CONFIG.phone}`} className="hover:text-[#221A15] transition-colors">
                  {BRAND_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#825A39] shrink-0" />
                <a href={`mailto:${BRAND_CONFIG.email}`} className="hover:text-[#221A15] transition-colors">
                  {BRAND_CONFIG.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#825A39] shrink-0 mt-0.5" />
                <span>{BRAND_CONFIG.officeHours.weekdays}</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6B5E54] block mb-1.5 font-medium">
                Receba novas propriedades
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#EDF6EE] border border-[#C6E2C9] text-[#2C6B38] text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#2C6B38] shrink-0" />
                  <span>Subscrição confirmada com sucesso!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Seu e-mail profissional"
                    className="flex-1 bg-white border border-[#E0D7C9] rounded-lg px-3 py-2 text-xs text-[#221A15] placeholder-[#8C8074] focus:outline-hidden focus:border-[#825A39]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#3E2819] hover:bg-[#26180E] text-[#FAF8F5] rounded-lg text-xs font-semibold tracking-wider transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Legal and Disclaimer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C8074]">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Todos os direitos reservados.
          </p>
          <p className="text-center sm:text-right max-w-xl text-[10px] text-[#A3978B]">
            Plataforma fictícia criada para demonstração comercial. As imagens e referências pertencem a demonstrações arquitectónicas de direitos abertos.
          </p>
        </div>
      </div>
    </footer>
  );
};
