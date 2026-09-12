import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Car, 
  Calendar, 
  MessageCircle, 
  Share2, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Expand, 
  ShieldCheck, 
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { ImageLightbox } from '../components/ImageLightbox';
import { getPropertyWhatsAppUrl, BRAND_CONFIG } from '../data/config';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const property = PROPERTIES.find(
    (p) => p.id.toLowerCase() === id?.toLowerCase() || p.slug === id
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top whenever property changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
  }, [id]);

  if (!property) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center text-[#FAF9F6]">
        <h2 className="font-serif text-3xl text-[#FAF9F6] mb-4">Imóvel não encontrado</h2>
        <p className="text-sm text-stone-400 mb-8">
          O imóvel que procura não existe ou foi recentemente arquivado da nossa base de dados.
        </p>
        <Link
          to="/comprar"
          className="px-6 py-3 bg-[#C5A880] text-[#0A0B0D] rounded-full text-xs uppercase tracking-widest font-semibold inline-block"
        >
          Ver Imóveis Disponíveis
        </Link>
      </div>
    );
  }

  const isRental = property.operation === 'arrendamento';
  const similarProperties = PROPERTIES
    .filter((p) => p.id !== property.id && (p.operation === property.operation || p.location === property.location))
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#261B14]">
      {/* Top Nav Breadcrumbs & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B5E54] hover:text-[#221A15] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4 text-[#825A39]" />
          <span>Voltar aos imóveis</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E0D7C9] bg-white hover:bg-[#F7F4EE] text-xs font-medium text-[#443831] transition-colors cursor-pointer shadow-xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#825A39]" />
                <span>Partilhar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Property Title & Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#E8E2D6] mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase ${
                isRental ? 'bg-[#FAF2E8] text-[#825A39] border border-[#E2CEB9]' : 'bg-[#EDF6EE] text-[#2C6B38] border border-[#C6E2C9]'
              }`}
            >
              {isRental ? 'Para Arrendar' : 'Para Comprar'}
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-medium bg-white text-[#5E5249] border border-[#E0D7C9] uppercase">
              {property.type}
            </span>
            <span className="text-[11px] text-[#8C8074] font-mono tracking-wider ml-1">
              Ref: {property.id}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#221A15] tracking-tight mb-4 leading-tight max-w-4xl">
            {property.title}
          </h1>

          <div className="flex items-center gap-2.5 text-sm text-[#825A39]">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-[#5E5249] font-medium tracking-wide">{property.address}</span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="lg:text-right">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#825A39] font-semibold block mb-2">
            Valor Comercial
          </span>
          <div className="flex items-baseline lg:justify-end gap-2">
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#221A15] tracking-tight">
              {property.priceDisplay}
            </span>
            {property.pricePeriod && (
              <span className="text-sm text-[#6B5E54] font-medium">
                {property.pricePeriod}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center lg:justify-end gap-1 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Estado: {property.status}</span>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="space-y-4 mb-16">
        {/* Large Featured Image with interactive controls */}
        <div
          className="relative aspect-16/9 sm:aspect-21/9 max-h-[640px] w-full rounded-3xl overflow-hidden bg-[#F4EFEA] group cursor-pointer border border-[#E8E2D6] shadow-md"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={property.images[activeImageIndex]}
            alt={`${property.title} - Foto Principal`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
          />

          {/* Controls overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-4 sm:p-6 pointer-events-none">
            <button
              onClick={handlePrevPhoto}
              className="p-3 rounded-full bg-white/90 hover:bg-white text-[#221A15] shadow-md pointer-events-auto transition-colors cursor-pointer border border-[#E0D7C9]"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextPhoto}
              className="p-3 rounded-full bg-white/90 hover:bg-white text-[#221A15] shadow-md pointer-events-auto transition-colors cursor-pointer border border-[#E0D7C9]"
              title="Próxima"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Expand badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-[#221A15] text-xs shadow-md border border-[#E0D7C9] transition-all pointer-events-auto">
            <Expand className="w-3.5 h-3.5 text-[#825A39]" />
            <span>Ver em ecrã inteiro ({activeImageIndex + 1}/{property.images.length})</span>
          </div>
        </div>

        {/* Thumbnail Navigation Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 mt-6">
          {property.images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === activeImageIndex
                  ? 'border-[#825A39] ring-2 ring-[#825A39]/30 scale-98'
                  : 'border-[#E8E2D6] opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* SPECS & METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 bg-white rounded-3xl border border-[#E8E2D6] shadow-xs mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] flex items-center justify-center text-[#825A39]">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#6B5E54] block mb-1 font-semibold">Quartos</span>
            <span className="font-semibold text-base sm:text-lg text-[#221A15]">
              {property.bedrooms > 0 ? `${property.bedrooms} Quartos` : 'Open Space'}
              {property.suites ? ` (${property.suites} suites)` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] flex items-center justify-center text-[#825A39]">
            <Bath className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#6B5E54] block mb-1 font-semibold">Casas de Banho</span>
            <span className="font-semibold text-base sm:text-lg text-[#221A15]">{property.bathrooms} Casas de Banho</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] flex items-center justify-center text-[#825A39]">
            <Maximize className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#6B5E54] block mb-1 font-semibold">Área Útil</span>
            <span className="font-semibold text-base sm:text-lg text-[#221A15]">{property.area} m²</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EFE5D8] flex items-center justify-center text-[#825A39]">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#6B5E54] block mb-1 font-semibold">Estacionamento</span>
            <span className="font-semibold text-base sm:text-lg text-[#221A15]">{property.parking} Lugares</span>
          </div>
        </div>
      </div>

      {/* BODY CONTENT: LEFT DETAILS & RIGHT CONSULTANT CONTACT CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        {/* Left Column: Description & Features */}
        <div className="lg:col-span-8 space-y-12">
          {/* Narrative description */}
          <div>
            <h2 className="font-serif text-3xl text-[#221A15] mb-6 font-medium tracking-tight">
              Sobre a Propriedade
            </h2>
            <div className="space-y-5 text-[#5E5249] text-base sm:text-lg leading-relaxed tracking-wide">
              <p className="font-medium text-[#221A15] text-lg sm:text-xl leading-relaxed">
                {property.description}
              </p>
              {property.longDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Architectural Highlights */}
          <div>
            <h3 className="font-serif text-2xl text-[#221A15] mb-6 font-medium tracking-tight">
              Destaques Arquitectónicos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E8E2D6] shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#825A39] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#221A15] font-medium tracking-wide">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities checklist */}
          <div>
            <h3 className="font-serif text-2xl text-[#221A15] mb-6 font-medium tracking-tight">
              Comodidades & Segurança
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-[#5E5249]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#825A39]" />
                  <span className="tracking-wide">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Action & Agent Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-white rounded-3xl border border-[#E8E2D6] p-8 sm:p-10 shadow-lg space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#825A39] font-semibold block mb-2">
                Atendimento Directo
              </span>
              <h3 className="font-serif text-2xl text-[#221A15] font-medium mb-3">
                Interessado neste imóvel?
              </h3>
              <p className="text-sm text-[#6B5E54] mt-1 leading-relaxed tracking-wide">
                Agende uma visita privada ou fale em tempo real com o consultor responsável.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-4 pt-2">
              <Link
                to={`/agendar?imovel=${encodeURIComponent(property.id)}`}
                className="w-full py-4 px-4 rounded-xl bg-[#3E2819] hover:bg-[#26180E] text-[#FAF8F5] text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Visita Presencial</span>
              </Link>

              {/* Functional WhatsApp with specific property name prefilled */}
              <a
                href={getPropertyWhatsAppUrl(property.title, property.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E0D7C9] text-[#221A15] text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>

            {/* Consultant Profile Card */}
            <div className="pt-5 border-t border-[#F0EBE1]">
              <span className="text-[10px] uppercase tracking-wider text-[#8C8074] font-mono block mb-3">
                Consultor Responsável
              </span>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E0D7C9]"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#221A15]">{property.agent.name}</h4>
                  <span className="text-xs text-[#825A39] block">{property.agent.role}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#5E5249]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#825A39]" />
                  <span>{property.agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#825A39]" />
                  <span className="truncate">{property.agent.email}</span>
                </div>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-center gap-2.5 text-[11px] text-[#6B5E54]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Propriedade verificada com documentação regularizada.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR PROPERTIES SECTION */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-[#E8E2D6]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block mb-1">
                Sugestões Relacionadas
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#221A15] font-normal">
                Imóveis Semelhantes em Maputo
              </h2>
            </div>
            <Link
              to={isRental ? '/arrendar' : '/comprar'}
              className="text-xs uppercase tracking-widest font-semibold text-[#825A39] hover:text-[#3E2819] transition-colors"
            >
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox for gallery zoom */}
      <ImageLightbox
        images={property.images}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
        title={property.title}
      />
    </div>
  );
};
