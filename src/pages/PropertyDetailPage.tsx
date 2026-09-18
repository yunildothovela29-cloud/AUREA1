import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bath, BedDouble, CalendarDays, Check, ChevronLeft, ChevronRight, MapPin, MessageCircle, Ruler, Share2 } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { getPropertyWhatsAppUrl } from '../data/config';
import { PropertyCard } from '../components/PropertyCard';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [imageIndex, setImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const property = properties.find((item) => item.id.toLowerCase() === String(id || '').toLowerCase() || item.slug === id);

  const similar = useMemo(() =>
    property ? properties.filter((item) => item.id !== property.id && item.operation === property.operation).slice(0, 3) : [],
  [properties, property]);

  if (loading && !property) {
    return <div className="pt-32 min-h-screen bg-[#F7F9FC] grid place-items-center text-[#14245F]">A carregar imóvel…</div>;
  }

  if (!property) {
    return <div className="pt-32 min-h-screen bg-[#F7F9FC] px-4 text-center"><h1 className="text-2xl font-semibold text-[#14245F]">Imóvel não encontrado</h1><Link to="/comprar" className="inline-block mt-4 text-[#D93030] font-semibold">Voltar aos imóveis</Link></div>;
  }

  const next = () => setImageIndex((index) => (index + 1) % property.images.length);
  const prev = () => setImageIndex((index) => (index - 1 + property.images.length) % property.images.length);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { }
  };

  return (
    <div className="pt-28 pb-20 bg-[#F7F9FC] min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-[#566176] hover:text-[#14245F]"><ArrowLeft className="w-4 h-4" /> Voltar</button>
          <button onClick={() => void copyLink()} className="inline-flex items-center gap-2 text-sm text-[#566176] hover:text-[#14245F]"><Share2 className="w-4 h-4" /> {copied ? 'Copiado' : 'Partilhar'}</button>
        </div>

        <div className="bg-white border border-[#E1E6EE] rounded-3xl overflow-hidden shadow-sm">
          <div className="relative bg-[#EEF2F6] aspect-[16/9]">
            <img src={property.images[imageIndex]} alt={property.title} className="w-full h-full object-cover" />
            {property.images.length > 1 && <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-[#14245F] shadow"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-[#14245F] shadow"><ChevronRight className="w-5 h-5" /></button>
            </>}
            <div className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full bg-[#14245F] text-white text-xs font-semibold">{property.operation === 'venda' ? 'Venda' : 'Arrendamento'}</div>
          </div>

          {property.images.length > 1 && <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3">{property.images.slice(0, 6).map((src, i) => <button key={src + i} onClick={() => setImageIndex(i)} className={'aspect-[4/3] rounded-lg overflow-hidden border-2 ' + (i === imageIndex ? 'border-[#D93030]' : 'border-transparent')}><img src={src} alt="" className="w-full h-full object-cover" /></button>)}</div>}

          <div className="p-6 sm:p-9">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-7">
              <div>
                <p className="text-sm font-semibold text-[#D93030]">{property.type} · {property.neighborhood || property.location}</p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-[#14245F] mt-2">{property.title}</h1>
                <p className="flex items-center gap-2 text-sm text-[#667085] mt-3"><MapPin className="w-4 h-4" />{property.address}</p>
              </div>
              <div className="lg:text-right">
                <p className="text-xs uppercase tracking-[0.15em] text-[#7A8495]">Preço</p>
                <p className="text-3xl font-bold text-[#14245F] mt-1">{property.priceDisplay}<span className="text-sm font-normal text-[#7A8495]"> {property.pricePeriod || ''}</span></p>
                <p className="text-xs text-[#6B7280] mt-1">Ref. {property.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
              <div className="rounded-xl bg-[#F7F9FC] p-4"><BedDouble className="w-4 h-4 text-[#D93030]" /><p className="text-xs text-[#7A8495] mt-2">Quartos</p><p className="font-semibold text-[#14245F] mt-0.5">{property.bedrooms || '—'}</p></div>
              <div className="rounded-xl bg-[#F7F9FC] p-4"><Bath className="w-4 h-4 text-[#D93030]" /><p className="text-xs text-[#7A8495] mt-2">Banhos</p><p className="font-semibold text-[#14245F] mt-0.5">{property.bathrooms || '—'}</p></div>
              <div className="rounded-xl bg-[#F7F9FC] p-4"><Ruler className="w-4 h-4 text-[#D93030]" /><p className="text-xs text-[#7A8495] mt-2">Área</p><p className="font-semibold text-[#14245F] mt-0.5">{property.area || '—'} m²</p></div>
              <div className="rounded-xl bg-[#F7F9FC] p-4"><span className="text-[#D93030] font-bold">P</span><p className="text-xs text-[#7A8495] mt-2">Estacionamento</p><p className="font-semibold text-[#14245F] mt-0.5">{property.parking || '—'}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-9 mt-9">
              <div>
                <h2 className="text-xl font-semibold text-[#14245F]">Sobre o imóvel</h2>
                <p className="text-sm sm:text-base text-[#566176] leading-7 mt-3">{property.description}</p>
                {property.longDescription?.map((paragraph, index) => <p key={index} className="text-sm sm:text-base text-[#566176] leading-7 mt-3">{paragraph}</p>)}

                {property.highlights?.length > 0 && <div className="mt-8"><h3 className="font-semibold text-[#14245F]">Destaques</h3><div className="grid sm:grid-cols-2 gap-2 mt-3">{property.highlights.map((item, index) => <div key={index} className="flex gap-2 text-sm text-[#566176]"><Check className="w-4 h-4 text-[#D93030] shrink-0 mt-0.5" />{item}</div>)}</div></div>}

                {property.amenities?.length > 0 && <div className="mt-8"><h3 className="font-semibold text-[#14245F]">Comodidades</h3><div className="flex flex-wrap gap-2 mt-3">{property.amenities.map((item, index) => <span key={index} className="px-3 py-1.5 rounded-full bg-[#F1F4F8] text-xs text-[#566176]">{item}</span>)}</div></div>}
              </div>

              <aside className="bg-[#14245F] text-white rounded-2xl p-6 h-fit">
                <p className="text-xs uppercase tracking-[0.14em] text-white/60">Próximo passo</p>
                <h3 className="text-xl font-semibold mt-2">Quer visitar esta propriedade?</h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">Escolha a data e a hora. O pedido ficará registado e abriremos o WhatsApp com a mensagem pronta para enviar à 2S.</p>
                <Link to={'/agendar?imovel=' + encodeURIComponent(property.id)} className="mt-5 w-full py-3 rounded-xl bg-[#D93030] hover:bg-[#BF2525] text-white font-semibold text-sm flex items-center justify-center gap-2"><CalendarDays className="w-4 h-4" /> Marcar visita</Link>
                <a href={getPropertyWhatsAppUrl(property.title, property.id)} target="_blank" rel="noopener noreferrer" className="mt-2 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
                <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(property.address)} target="_blank" rel="noopener noreferrer" className="mt-2 block text-center text-xs text-white/65 hover:text-white">Abrir localização no mapa</a>
              </aside>
            </div>
          </div>
        </div>

        {similar.length > 0 && <div className="mt-10"><h2 className="text-2xl font-semibold text-[#14245F] mb-4">Outros imóveis</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{similar.map((item) => <PropertyCard key={item.id} property={item} />)}</div></div>}
      </section>
    </div>
  );
};
