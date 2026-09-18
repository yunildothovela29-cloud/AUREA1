import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => (
  <footer className="bg-[#14245F] text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/15">
        <div>
          <BrandLogo light className="mb-4" />
          <p className="text-sm text-white/70 max-w-sm leading-relaxed">{BRAND_CONFIG.subtagline}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Explorar</h3>
          <div className="flex flex-col gap-2.5 text-sm text-white/70">
            <Link to="/comprar" className="hover:text-white">Comprar</Link>
            <Link to="/arrendar" className="hover:text-white">Arrendar</Link>
            <Link to="/sobre" className="hover:text-white">Sobre</Link>
            <Link to="/contactos" className="hover:text-white">Contactos</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-4">Contactos</h3>
          <div className="space-y-3 text-sm text-white/75">
            <a href={'tel:' + BRAND_CONFIG.phone} className="flex gap-2 items-center hover:text-white"><Phone className="w-4 h-4" />{BRAND_CONFIG.phoneDisplay}</a>
            <a href={'mailto:' + BRAND_CONFIG.email} className="flex gap-2 items-center hover:text-white"><Mail className="w-4 h-4" />{BRAND_CONFIG.email}</a>
            <p className="flex gap-2 items-center"><MapPin className="w-4 h-4" />{BRAND_CONFIG.location.city}, Moçambique</p>
          </div>
        </div>
      </div>
      <p className="pt-6 text-xs text-white/45">© {new Date().getFullYear()} {BRAND_CONFIG.name}. Todos os direitos reservados.</p>
    </div>
  </footer>
);
