import React from 'react';
import { Link } from 'react-router-dom';
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import { Property } from '../types';

export const PropertyCard: React.FC<{ property: Property; className?: string }> = ({ property, className = '' }) => {
  const rental = property.operation === 'arrendamento';

  return (
    <article className={'group min-w-0 ' + className}>
      <Link
        to={'/imovel/' + property.id}
        className="block overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-[#E3E8F0]"
      >
        <div className="relative aspect-[1/1] sm:aspect-[4/3] bg-[#EEF2F6]">
          <img
            src={property.images?.[0]}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 px-2 py-1 rounded-full bg-white/95 text-[9px] sm:text-[11px] font-semibold text-[#14245F] shadow-sm">
            {rental ? 'Arrendamento' : 'Venda'}
          </div>
        </div>
      </Link>

      <div className="pt-2.5 sm:pt-4">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#738096] mb-1 min-w-0">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">{property.neighborhood || property.location}</span>
        </div>

        <Link
          to={'/imovel/' + property.id}
          className="block text-[13px] sm:text-lg font-semibold text-[#14245F] leading-snug line-clamp-2 hover:text-[#D93030]"
        >
          {property.title}
        </Link>

        <div className="mt-1.5 sm:mt-2 text-[13px] sm:text-base font-bold text-[#14245F]">
          {property.priceDisplay}
          {property.pricePeriod && (
            <span className="font-normal text-[10px] sm:text-sm text-[#7A8495]"> {property.pricePeriod}</span>
          )}
        </div>

        <div className="mt-2.5 sm:mt-3 flex items-center gap-2.5 sm:gap-4 text-[9px] sm:text-xs text-[#68738A]">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {property.bedrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {property.area} m²
          </span>
        </div>
      </div>
    </article>
  );
};
