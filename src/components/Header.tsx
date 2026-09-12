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
    { label: 'Sobre nós', path: '/sobre' },
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
          className="group flex flex-col items-start focus:outline-hidden"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#825A39]" />
            <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.18em] text-[#221A15] group-hover:text-[#5E3E26] transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#825A39] font-medium ml-4 -mt-0.5">
            Maputo • Mediação & Arquitectura
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav id="desktop-navigation" className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-[11px] uppercase tracking-[0.2em] transition-all relative py-1 ${
                  active
                    ? 'text-[#221A15] font-bold'
                    : 'text-[#6B5E54] hover:text-[#221A15] font-medium'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#825A39] rounded-full" />
                )}
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
            className="flex items-center gap-2 text-[11px] text-[#443831] hover:text-[#221A15] px-4 py-2.5 rounded-full border border-[#E2D9CC] bg-white hover:bg-[#F5F1EA] transition-all shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="font-semibold tracking-widest uppercase">WhatsApp</span>
          </a>

          {/* Schedule Visit Button */}
          <Link
            to="/agendar"
            id="header-schedule-btn"
            className="inline-flex items-center gap-2 bg-[#3E2819] hover:bg-[#26180E] text-[#FAF8F5] px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-semibold transition-all shadow-xs hover:shadow-md active:scale-98"
          >
            <Calendar className="w-3.5 h-3.5 text-[#EFE9DF]" />
            <span>Agendar</span>
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

