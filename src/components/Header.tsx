import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/config';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu whenever path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Comprar', path: '/comprar' },
    { label: 'Arrendar', path: '/arrendar' },
    { label: 'Empreendimentos', path: '/empreendimentos' },
    { label: 'Vender', path: '/vender' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Contactos', path: '/contactos' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#EAE3D7] py-4'
          : 'bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#EAE3D7]/70 py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          id="brand-logo-link"
          className="group flex items-center gap-4 focus:outline-hidden"
        >
          <div className="w-9 h-9 border border-[#221A15] flex items-center justify-center shrink-0">
            <span className="font-serif text-lg text-[#221A15]">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[13px] sm:text-[14px] font-medium tracking-[0.2em] text-[#221A15] group-hover:text-[#5E3E26] transition-colors uppercase">
              Aurea Properties
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#825A39] font-medium mt-0.5 hidden sm:block">
              Maputo • Mediação & Arquitectura
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav id="desktop-navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-[10px] xl:text-[11px] uppercase tracking-[0.15em] transition-all relative py-1 ${
                  active
                    ? 'text-[#221A15] font-semibold border-b border-[#221A15]'
                    : 'text-[#6B5E54] hover:text-[#221A15] font-medium'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Quick WhatsApp Action */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            id="header-whatsapp-btn"
            title="Falar no WhatsApp"
            className="flex items-center gap-1.5 text-[11px] text-[#221A15] hover:text-[#5E3E26] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Schedule Visit Button */}
          <Link
            to="/agendar"
            id="header-schedule-btn"
            className="bg-[#221A15] hover:bg-[#3E2819] text-white px-5 py-2.5 rounded-sm text-[10px] uppercase tracking-[0.15em] font-medium transition-colors"
          >
            Agendar visita
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/agendar"
            id="mobile-header-quick-schedule"
            className="px-3 py-1.5 bg-[#3E2819] text-[#FAF8F5] rounded-full text-[11px] font-semibold tracking-wider uppercase"
          >
            Agendar
          </Link>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#3E2819] hover:bg-[#F2ECE1] transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-x-0 top-[65px] bg-white border-b border-[#EAE3D7] shadow-xl px-6 py-6 transition-all"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base py-2.5 border-b border-[#F0EBE1] flex items-center justify-between ${
                    active
                      ? 'text-[#221A15] font-bold'
                      : 'text-[#6B5E54] hover:text-[#221A15]'
                  }`}
                >
                  <span className="uppercase tracking-wider text-xs">{link.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-[#825A39]" />}
                </Link>
              );
            })}

            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/agendar"
                className="w-full text-center py-3 bg-[#3E2819] text-[#FAF8F5] rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar visita presencial</span>
              </Link>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 border border-[#E0D7C9] text-[#261B14] bg-[#FAF8F5] rounded-xl text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Conversar no WhatsApp</span>
              </a>

              <div className="text-center pt-2 text-xs text-[#7A6E65] font-mono">
                <span>Maputo: {BRAND_CONFIG.phoneDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

