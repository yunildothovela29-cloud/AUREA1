import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Compass, 
  Award,
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { NEIGHBORHOODS } from '../data/neighborhoods';
import { PropertyCard } from '../components/PropertyCard';
import { BRAND_CONFIG } from '../data/config';
import { OperationType } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Search Bar State in Hero
  const [operation, setOperation] = useState<OperationType>('venda');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const featuredProperties = PROPERTIES.filter((p) => p.featured).slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('bairro', location);
    if (propertyType) params.set('tipo', propertyType);
    if (maxPrice) params.set('precoMax', maxPrice);

    const targetRoute = operation === 'venda' ? '/comprar' : '/arrendar';
    navigate(`${targetRoute}?${params.toString()}`);
  };

  return (
    <div className="space-y-32 sm:space-y-48 pb-32 text-[#261B14]">
      {/* 1. HERO SECTION - ELEGANT WARM LUXURY ARCHITECTURE */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Architectural Photo: Bright Natural Daylight Villa */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85"
            alt="Arquitectura Residencial Contemporânea"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.02]"
          />
          {/* Subtle Warm Linen Gradients for soft readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/70 to-black/25" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#FAF8F5]/30 to-[#FAF8F5]/80" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center py-24 sm:py-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#DCD3C4] bg-white/90 backdrop-blur-md mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#825A39]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#825A39] font-semibold">
              Mediação Imobiliária & Arquitectura • Maputo
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#221A15] tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            Espaços que combinam consigo.
          </h1>

          <p className="text-lg sm:text-xl text-[#594E46] font-normal max-w-2xl mx-auto mb-14 leading-relaxed tracking-wide">
            Residências contemporâneas, moradias unifamiliares e coberturas de autor seleccionadas com rigor estético e segurança jurídica em Maputo.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              to="/comprar"
              id="hero-explore-btn"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#3E2819] hover:bg-[#26180E] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              Explorar imóveis
            </Link>
            <Link
              to="/agendar"
              id="hero-schedule-btn"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/95 hover:bg-white text-[#3E2819] border border-[#DCD3C4] shadow-xs text-xs uppercase tracking-widest font-semibold transition-all active:scale-98"
            >
              Agendar visita
            </Link>
          </div>

          {/* Quick Search Console: Clean White & Warm Beige Card */}
          <div className="bg-white/98 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-xl border border-[#E5DDD0] max-w-4xl mx-auto text-left">
            {/* Operation Toggle Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-[#F0EBE1] pb-3">
              <button
                type="button"
                onClick={() => setOperation('venda')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  operation === 'venda'
                    ? 'bg-[#3E2819] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6B5E54] hover:text-[#221A15] bg-[#FAF8F5]'
                }`}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => setOperation('arrendamento')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  operation === 'arrendamento'
                    ? 'bg-[#3E2819] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6B5E54] hover:text-[#221A15] bg-[#FAF8F5]'
                }`}
              >
                Arrendar
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Neighborhood */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1">
                  Localização
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39] cursor-pointer"
                >
                  <option value="">Todas as zonas</option>
                  <option value="Polana">Polana</option>
                  <option value="Sommerschield">Sommerschield</option>
                  <option value="Costa do Sol">Costa do Sol</option>
                  <option value="Triunfo">Triunfo</option>
                  <option value="Coop">Coop</option>
                  <option value="Matola">Matola</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1">
                  Tipo de Imóvel
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39] cursor-pointer"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Escritório">Escritório</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1">
                  Preço Máximo (MT)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={operation === 'venda' ? 'Ex: 30000000' : 'Ex: 250000'}
                  className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39]"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  id="hero-search-submit-btn"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#3E2819] hover:bg-[#26180E] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Pesquisar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. IMÓVEIS EM DESTAQUE (6 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block mb-4">
              Selecção do Mês
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#221A15] font-normal tracking-tight">
              Imóveis em Destaque
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/comprar"
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#825A39] hover:text-[#3E2819] flex items-center gap-2 transition-colors group"
            >
              <span>Ver todos os imóveis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 3. SECÇÃO DE APRESENTAÇÃO & ARQUITECTURA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF4ED] rounded-3xl p-10 sm:p-16 lg:p-24 border border-[#E8E2D6] shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            {/* Architectural Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#E8E2D6]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                  alt="Interior arquitectónico contemporâneo"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Architecture Quality Callout */}
              <div className="absolute -bottom-8 -right-8 hidden sm:block bg-white text-[#221A15] p-8 rounded-2xl shadow-xl max-w-sm border border-[#E8E2D6]">
                <span className="font-serif text-3xl text-[#825A39] block font-normal mb-2">
                  100% Criterioso
                </span>
                <p className="text-sm text-[#6B5E54] font-normal leading-relaxed">
                  Apenas propriedades auditadas documental e estruturalmente entram no nosso portfólio.
                </p>
              </div>
            </div>

            {/* Narrative & 3 Core Pillars */}
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block">
                  Filosofia & Método
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-[#221A15] font-normal leading-snug">
                  Mais do que encontrar uma propriedade, ajudamos a encontrar o lugar certo.
                </h2>
                <p className="text-base sm:text-lg text-[#5E5249] leading-relaxed tracking-wide">
                  Acreditamos que a arquitectura de um espaço molda a rotina, o bem-estar e o património das pessoas. Por isso, a nossa abordagem foge do modelo massificado: cada cliente conta com consultores seniores dedicados e uma curadoria que prioriza solidez, luz natural e valorização perene em Maputo.
                </p>
              </div>

              {/* 3 Pillars requested */}
              <div className="space-y-8 pt-8">
                <div className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-[#E8E2D6] shadow-sm">
                  <div className="p-4 rounded-2xl bg-[#FAF4ED] text-[#825A39] shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#221A15] mb-3 tracking-wide">
                      Selecção cuidadosa
                    </h3>
                    <p className="text-base text-[#6B5E54] leading-relaxed tracking-wide">
                      Não acumulamos volumes indiscriminados. Analisamos planta, orientação solar, qualidade construtiva e documentação jurídica antes de apresentar qualquer opção.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-[#E8E2D6] shadow-sm">
                  <div className="p-4 rounded-2xl bg-[#FAF4ED] text-[#825A39] shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#221A15] mb-3 tracking-wide">
                      Acompanhamento personalizado
                    </h3>
                    <p className="text-base text-[#6B5E54] leading-relaxed tracking-wide">
                      Atendimento individual com horários flexíveis, consultoria de investimento e visitas guiadas sem pressa para que cada detalhe seja avaliado com calma.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-[#E8E2D6] shadow-sm">
                  <div className="p-4 rounded-2xl bg-[#FAF4ED] text-[#825A39] shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#221A15] mb-3 tracking-wide">
                      Processo simples e transparente
                    </h3>
                    <p className="text-base text-[#6B5E54] leading-relaxed tracking-wide">
                      Clareza absoluta nas negociações, minutas contratuais revisadas e apoio completo até à entrega das chaves e registo predial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECÇÃO DE BAIRROS (Maputo) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block mb-4">
            Zonas Prime de Maputo
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#221A15] font-normal tracking-tight mb-4">
            Descubra os Melhores Bairros
          </h2>
          <p className="text-base text-[#6B5E54] mt-4 leading-relaxed">
            Cada área da capital possui uma dinâmica própria. Explore as propriedades disponíveis filtradas pela sua localização preferida.
          </p>
        </div>

        {/* 6 Neighborhood Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEIGHBORHOODS.map((item) => (
            <Link
              key={item.id}
              to={`/comprar?bairro=${encodeURIComponent(item.name)}`}
              id={`neighborhood-card-${item.id}`}
              className="group relative h-80 rounded-2xl overflow-hidden border border-[#E8E2D6] hover:border-[#825A39] shadow-xs hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221A15]/95 via-[#221A15]/40 to-transparent transition-colors" />

              {/* Content overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/40 backdrop-blur-md border border-white/20 text-[#FAF8F5]">
                    {item.propertyCount} {item.propertyCount === 1 ? 'imóvel' : 'imóveis'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white group-hover:text-[#221A15] transition-colors flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-normal text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#EAE3D7] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] text-[#D8C7B4] font-mono uppercase tracking-wider">
                    Média de valores: {item.averagePriceSale}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. CHAMADA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#2D2017] text-[#FAF8F5] p-12 sm:p-20 lg:p-32 text-center border border-[#443327] shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4B598] font-semibold block">
              Próximo Passo
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
              Está pronto para encontrar o próximo espaço?
            </h2>
            <p className="text-base sm:text-lg text-[#D4C8BC] max-w-2xl mx-auto leading-relaxed tracking-wide">
              Quer procure uma moradia unifamiliar com jardim em Sommerschield, uma penthouse com vista mar na Polana ou um espaço corporativo de prestígio, a nossa equipa está ao seu dispor.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/comprar"
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#FAF8F5] hover:bg-white text-[#26180E] text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:scale-102 cursor-pointer"
              >
                Ver propriedades
              </Link>
              <Link
                to="/contactos"
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs uppercase tracking-widest font-semibold transition-all hover:scale-102 cursor-pointer"
              >
                Falar connosco
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

