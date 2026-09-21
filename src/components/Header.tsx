import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, X } from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    { label: 'Início', path: '/' },
    { label: 'Comprar', path: '/comprar' },
    { label: 'Arrendar', path: '/arrendar' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Contactos', path: '/contactos' },
  ];

  return (
    <header className={'fixed inset-x-0 top-0 z-40 border-b transition-all ' + (scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-[#E5E9F1]' : 'bg-white border-[#EEF1F5]')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[78px] flex items-center justify-between gap-5">
        <Link to="/" aria-label="2Simoveis"><BrandLogo /></Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const active = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);
            return (
              <Link key={link.path} to={link.path} className={'text-sm transition-colors ' + (active ? 'font-semibold text-[#14245F]' : 'text-[#5B6577] hover:text-[#14245F]')}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm text-[#14245F] hover:bg-[#F3F6FB]">
            <MessageCircle className="w-4 h-4 text-[#D93030]" />
            WhatsApp
          </a>
          <Link to="/agendar" className="px-4 py-2.5 rounded-xl bg-[#D93030] text-white text-sm font-semibold hover:bg-[#BF2525]">
            Marcar visita
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[#F3F6FB]" aria-label="WhatsApp"><MessageCircle className="w-5 h-5 text-[#D93030]" /></a>
          <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-lg hover:bg-[#F3F6FB]" aria-label="Menu">
            {open ? <X className="w-5 h-5 text-[#14245F]" /> : <Menu className="w-5 h-5 text-[#14245F]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#EEF1F5] px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-1">
            {links.map((link) => <Link key={link.path} to={link.path} className="px-3 py-3 rounded-lg text-[#14245F] hover:bg-[#F5F7FA]">{link.label}</Link>)}
            <Link to="/agendar" className="mt-2 text-center px-4 py-3 rounded-xl bg-[#D93030] text-white font-semibold">Marcar visita</Link>
          </div>
          <p className="text-xs text-[#7A8495] text-center mt-3">{BRAND_CONFIG.phoneDisplay}</p>
        </div>
      )}
    </header>
  );
};
