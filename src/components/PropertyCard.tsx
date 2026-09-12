import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  const isRental = property.operation === 'arrendamento';

  return (
    <div
      id={`property-card-${property.id}`}
      className={`group flex flex-col ${className}`}
    >
      {/* Clean Architectural Photograph - No artificial bubbles or borders */}
      <Link
        to={`/imovel/${property.id}`}
        className="relative aspect-4/3 w-full overflow-hidden rounded-xl mb-5 block bg-[#F4EFEA]"
      >
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </Link>

      {/* Property Details Body - Transparent background, minimalist layout */}
      <div className="flex flex-col">
        {/* Top row: Operation / Neighborhood */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#8C8074] mb-3">
          <span>{isRental ? 'Arrendamento' : 'Venda'}</span>
          <span>{property.neighborhood}</span>
        </div>

        {/* Title and Square Arrow Button */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-serif text-3xl font-normal text-[#221A15] group-hover:text-[#5E3E26] transition-colors line-clamp-1 pr-4">
            <Link to={`/imovel/${property.id}`}>
              {property.title}
            </Link>
          </h3>
          
          <Link
            to={`/imovel/${property.id}`}
            className="w-10 h-10 rounded-sm border border-[#E8E2D6] flex items-center justify-center shrink-0 group-hover:border-[#825A39] transition-colors"
          >
            <ArrowUpRight className="w-5 h-5 text-[#221A15]" />
          </Link>
        </div>

        {/* Price */}
        <div className="mb-5">
          <span className="font-sans text-xl font-medium text-[#221A15] tracking-tight">
            {property.priceDisplay}
          </span>
          {property.pricePeriod && (
            <span className="text-[11px] text-[#6B5E54] font-normal ml-1">
              {property.pricePeriod}
            </span>
          )}
        </div>

        {/* Key Metrics: Beds, Baths, Area */}
        <div className="flex items-center gap-6 text-xs text-[#594E46] font-medium">
          <div className="flex items-center gap-2" title="Quartos">
            <Bed className="w-4 h-4 text-[#8C8074]" strokeWidth={1.5} />
            <span>{property.bedrooms > 0 ? property.bedrooms : 'Open'}</span>
          </div>
          <div className="flex items-center gap-2" title="Casas de Banho">
            <Bath className="w-4 h-4 text-[#8C8074]" strokeWidth={1.5} />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-2" title="Área Útil">
            <Maximize className="w-4 h-4 text-[#8C8074]" strokeWidth={1.5} />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
