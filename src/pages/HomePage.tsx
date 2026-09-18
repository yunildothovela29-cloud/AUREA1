import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Loader2, Search } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';
import { OperationType } from '../types';
import { BrandLogo } from '../components/BrandLogo';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [operation, setOperation] = useState<OperationType>('venda');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const visible = useMemo(() => properties
    .filter((p) => p.operation === operation)
    .filter((p) => !location || p.location === location)
    .filter((p) => !type || p.type === type)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 8), [properties, operation, location, type]);

  const locations = Array.from(new Set(properties.map((p) => p.location).filter(Boolean)));
  const types = Array.from(new Set(properties.map((p) => p.type).filter(Boolean)));

  return (
    <div className="pt-28 pb-20 bg-[#F7F9FC] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#E1E6EE] rounded-2xl p-7 sm:p-10 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <div>
              <p className="text-sm font-semibold text-[#D93030] mb-2">2S Imobiliária & Serviços · Maputo</p>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#14245F] max-w-2xl">
                Encontre um imóvel em Maputo.
              </h1>
              <p className="mt-4 text-base text-[#667085] max-w-2xl leading-relaxed">
                Consulte as casas disponíveis, veja os detalhes e marque uma visita directamente pelo site.
              </p>
            </div>
            <Link to="/agendar" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D93030] text-white font-semibold text-sm hover:bg-[#BF2525]">
              <CalendarDays className="w-4 h-4" /> Marcar visita
            </Link>
          </div>
        </div>

        <section className="bg-white border border-[#E1E6EE] rounded-2xl p-3 sm:p-4 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex bg-[#F5F7FA] rounded-xl p-1">
              <button onClick={() => setOperation('venda')} className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (operation === 'venda' ? 'bg-white text-[#14245F] shadow-sm' : 'text-[#667085]')}>Comprar</button>
              <button onClick={() => setOperation('arrendamento')} className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (operation === 'arrendamento' ? 'bg-white text-[#14245F] shadow-sm' : 'text-[#667085]')}>Arrendar</button>
            </div>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-[#F7F9FC] border border-[#E1E6EE] text-sm text-[#14245F] outline-none">
              <option value="">Todas as localizações</option>
              {locations.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-[#F7F9FC] border border-[#E1E6EE] text-sm text-[#14245F] outline-none">
              <option value="">Todos os tipos</option>
              {types.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button onClick={() => navigate(operation === 'venda' ? '/comprar' : '/arrendar')} className="px-5 py-3 rounded-xl bg-[#14245F] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#0E1944]">
              <Search className="w-4 h-4" /> Ver todos
            </button>
          </div>
        </section>

        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-semibold text-[#D93030]">Imóveis disponíveis</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#14245F] mt-1">{operation === 'venda' ? 'Imóveis para comprar' : 'Imóveis para arrendar'}</h2>
          </div>
          <Link to={operation === 'venda' ? '/comprar' : '/arrendar'} className="text-sm font-semibold text-[#14245F] inline-flex items-center gap-1.5 hover:text-[#D93030]">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 grid place-items-center text-[#14245F]"><Loader2 className="w-7 h-7 animate-spin" /></div>
        ) : visible.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visible.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#C7CFDC] rounded-2xl py-16 text-center">
            <h3 className="text-lg font-semibold text-[#14245F]">Sem imóveis nesta categoria</h3>
            <p className="text-sm text-[#667085] mt-2">O administrador pode adicionar novas propriedades pelo painel reservado.</p>
          </div>
        )}

        <div className="mt-10 bg-white border border-[#E1E6EE] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div><p className="font-semibold text-lg text-[#14245F]">Quer visitar uma propriedade?</p><p className="text-sm text-[#667085] mt-1">Escolha a casa e marque o horário que prefere.</p></div>
          <Link to="/agendar" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#14245F] text-white font-semibold text-sm hover:bg-[#0E1944]">Agendar visita</Link>
        </div>
      </section>
    </div>
  );
};
