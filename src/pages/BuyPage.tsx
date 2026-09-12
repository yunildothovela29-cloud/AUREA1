import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROPERTIES } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilter } from '../components/PropertyFilter';
import { FilterState } from '../types';
import { SearchX } from 'lucide-react';

export const BuyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params
  const initialLocation = searchParams.get('bairro') || '';
  const initialType = searchParams.get('tipo') || '';
  const initialMaxPrice = searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : '';

  const initialFilters: FilterState = {
    searchQuery: '',
    operation: 'venda',
    location: initialLocation,
    type: initialType,
    minPrice: '',
    maxPrice: initialMaxPrice,
    bedrooms: '',
    sortBy: 'featured',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync when query params change from navigation
  useEffect(() => {
    const loc = searchParams.get('bairro') || '';
    const typ = searchParams.get('tipo') || '';
    const maxP = searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : '';
    setFilters((prev) => ({
      ...prev,
      location: loc,
      type: typ,
      maxPrice: maxP,
    }));
  }, [searchParams]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      operation: 'venda',
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  // Filter and sort properties for sale
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((p) => {
      // Must be for sale
      if (p.operation !== 'venda') return false;

      // Text query match
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLoc = p.location.toLowerCase().includes(query) || p.neighborhood.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesAmenities = p.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matchesTitle && !matchesLoc && !matchesDesc && !matchesAmenities) return false;
      }

      // Location match
      if (filters.location && p.location !== filters.location) {
        return false;
      }

      // Type match
      if (filters.type && p.type !== filters.type) {
        return false;
      }

      // Bedrooms match
      if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) {
        return false;
      }

      // Min Price
      if (filters.minPrice !== '' && p.price < Number(filters.minPrice)) {
        return false;
      }

      // Max Price
      if (filters.maxPrice !== '' && p.price > Number(filters.maxPrice)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'area-desc') return b.area - a.area;
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [filters]);

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#261B14]">
      {/* Header section */}
      <div className="max-w-3xl mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-[#825A39] font-semibold block mb-4">
          Portfólio de Aquisição
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#221A15] font-normal tracking-tight mb-4">
          Imóveis para Comprar
        </h1>
        <p className="text-base text-[#5E5249] leading-relaxed tracking-wide">
          Explore a nossa selecção exclusiva de moradias contemporâneas, penthouses com vista mar e residências premium para compra em Maputo e arredores.
        </p>
      </div>

      {/* Filter Bar Component */}
      <PropertyFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalCount={filteredProperties.length}
        hideOperationFilter
      />

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 lg:gap-y-20 lg:gap-x-10 mt-12">
          {filteredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E8E2D6] rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF5EE] border border-[#E8E2D6] flex items-center justify-center mx-auto mb-4 text-[#825A39]">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-[#221A15] mb-2">
            Nenhum imóvel encontrado
          </h3>
          <p className="text-xs text-[#6B5E54] mb-6 leading-relaxed">
            Não encontramos propriedades para venda com os filtros seleccionados. Tente ajustar a localização, o tipo ou a faixa de preço.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-full bg-[#3E2819] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#26180E] transition-colors cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};
