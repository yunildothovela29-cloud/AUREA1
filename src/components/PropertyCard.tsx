import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import { Property } from '../types';

export const PropertyCard: React.FC<{ property: Property; className?: string }> = ({ property, className = '' }) => {
  const rental = property.operation === 'arrendamento';
  return (
    <article className={'group ' + className}>
      <Link to={'/imovel/' + property.id} className="block overflow-hidden rounded-2xl bg-[#EEF2F6] border border-[#E3E8F0]">
        <div className="relative aspect-[4/3]">
          <img src={property.images?.[0]} alt={property.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-[#14245F] shadow-sm">
            {rental ? 'Arrendamento' : 'Venda'}
          </div>
        </div>
      </Link>
      <div className="pt-4">
        <div className="flex items-center gap-2 text-xs text-[#738096] mb-1"><MapPin className="w-3.5 h-3.5" />{property.neighborhood || property.location}</div>
        <div className="flex items-start justify-between gap-3">
          <Link to={'/imovel/' + property.id} className="text-lg font-semibold text-[#14245F] leading-snug hover:text-[#D93030]">{property.title}</Link>
          <Link to={'/imovel/' + property.id} className="shrink-0 p-2 rounded-lg border border-[#E1E6EE] hover:border-[#D93030]"><ArrowUpRight className="w-4 h-4 text-[#14245F]" /></Link>
        </div>
        <div className="mt-2 text-base font-bold text-[#14245F]">{property.priceDisplay}{property.pricePeriod ? <span className="font-normal text-sm text-[#7A8495]"> {property.pricePeriod}</span> : null}</div>
        <div className="mt-3 flex items-center gap-4 text-xs text-[#68738A]">
          {property.bedrooms > 0 && <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" />{property.bedrooms}</span>}
          <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" />{property.bathrooms}</span>
          <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4" />{property.area} m²</span>
        </div>
      </div>
    </article>
  );
};
