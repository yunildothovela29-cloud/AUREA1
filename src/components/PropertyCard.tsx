import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, ArrowRight, Heart } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const isRental = property.operation === 'arrendamento';

  return (
    <div
      id={`property-card-${property.id}`}
      className={`group bg-white rounded-2xl border border-[#E8E2D6] hover:border-[#825A39]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Clean Architectural Photograph - No floating badges or artificial bubbles */}
      <Link
        to={`/imovel/${property.id}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-[#F4EFEA] block"
      >
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
        />

        {/* Discrete Bookmark Button in corner */}
        <button
          type="button"
          onClick={toggleSave}
          title={isSaved ? 'Remover dos favoritos' : 'Guardar imóvel'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#6B5E54] hover:text-[#B33927] shadow-xs border border-[#EAE3D7] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${isSaved ? 'fill-[#B33927] text-[#B33927]' : ''}`}
          />
        </button>
      </Link>

      {/* Property Details Body - Clean, elegant typography in warm tones */}
      <div className="p-7 sm:p-8 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Operation & Type label in clear editorial text */}
          <div className="flex items-center justify-between text-[11px] mb-2.5">
            <span className="font-semibold uppercase tracking-widest text-[#825A39]">
              {isRental ? 'Arrendamento' : 'Venda'} • {property.type}
            </span>
            <span className="text-[11px] font-mono text-[#8C8074]">
              Ref: {property.id}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl font-normal text-[#221A15] group-hover:text-[#5E3E26] transition-colors line-clamp-1 mb-2.5">
            <Link to={`/imovel/${property.id}`}>
              {property.title}
            </Link>
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-[#6B5E54] mb-5">
            <MapPin className="w-3.5 h-3.5 text-[#825A39] shrink-0" />
            <span className="truncate tracking-wide">{property.neighborhood}, {property.location}</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-2xl sm:text-3xl font-semibold text-[#221A15] tracking-tight">
                {property.priceDisplay}
              </span>
              {property.pricePeriod && (
                <span className="text-xs text-[#6B5E54] font-normal">
                  {property.pricePeriod}
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics: Beds, Baths, Area */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#F0EBE1] text-xs text-[#594E46] font-medium tracking-wide">
            <div className="flex items-center gap-2" title="Quartos">
              <Bed className="w-4 h-4 text-[#825A39]" />
              <span>{property.bedrooms > 0 ? `${property.bedrooms} Qts` : 'Open'}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Casas de Banho">
              <Bath className="w-4 h-4 text-[#825A39]" />
              <span>{property.bathrooms} WC</span>
            </div>
            <div className="flex items-center gap-1.5" title="Área Útil">
              <Maximize className="w-4 h-4 text-[#825A39]" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-5 flex items-center justify-between">
          <span className="text-xs text-[#8C8074]">
            {property.condoFee ? `Condomínio: ${property.condoFee}` : 'Disponibilidade imediata'}
          </span>
          <Link
            to={`/imovel/${property.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#5E3E26] hover:text-[#221A15] group-hover:translate-x-0.5 transition-all"
          >
            <span>Ver imóvel</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

