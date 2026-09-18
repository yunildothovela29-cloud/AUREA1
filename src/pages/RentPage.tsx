import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilter } from '../components/PropertyFilter';
import { FilterState } from '../types';
import { useProperties } from '../hooks/useProperties';

export const RentPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading } = useProperties();
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    operation: 'arrendamento',
    location: searchParams.get('bairro') || '',
    type: searchParams.get('tipo') || '',
    minPrice: '',
    maxPrice: searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : '',
    bedrooms: '',
    sortBy: 'featured',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get('bairro') || '',
      type: searchParams.get('tipo') || '',
      maxPrice: searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : '',
    }));
  }, [searchParams]);

  const results = useMemo(() => properties
    .filter((p) => p.operation === 'arrendamento')
    .filter((p) => {
      const q = filters.searchQuery.trim().toLowerCase();
      if (!q) return true;
      return [p.title, p.location, p.neighborhood, p.description, ...(p.amenities || [])]
        .join(' ').toLowerCase().includes(q);
    })
    .filter((p) => !filters.location || p.location === filters.location)
    .filter((p) => !filters.type || p.type === filters.type)
    .filter((p) => !filters.bedrooms || p.bedrooms >= Number(filters.bedrooms))
    .filter((p) => filters.minPrice === '' || p.price >= Number(filters.minPrice))
    .filter((p) => filters.maxPrice === '' || p.price <= Number(filters.maxPrice))
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'area-desc') return b.area - a.area;
      return Number(b.featured) - Number(a.featured);
    }), [properties, filters]);

  const reset = () => {
    setFilters({ searchQuery: '', operation: 'arrendamento', location: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', sortBy: 'featured' });
    setSearchParams({});
  };

  return (
    <div className="pt-28 pb-20 bg-[#F7F9FC] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.18em] text-[#D93030] font-bold">Arrendamento</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#14245F] mt-2">Imóveis para arrendar</h1>
          <p className="text-sm sm:text-base text-[#667085] mt-2 max-w-2xl">Casas e apartamentos disponíveis para arrendamento. Veja os detalhes e marque uma visita.</p>
        </div>

        <PropertyFilter filters={filters} onFilterChange={(update) => setFilters((prev) => ({ ...prev, ...update }))} onReset={reset} totalCount={results.length} hideOperationFilter />

        {loading ? (
          <div className="py-16 text-center text-sm text-[#667085]">A carregar imóveis…</div>
        ) : results.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-5 lg:gap-6 mt-7">
            {results.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#C7CFDC] rounded-2xl py-16 px-5 text-center mt-7">
            <SearchX className="w-6 h-6 text-[#8A95A7] mx-auto" />
            <h3 className="text-lg font-semibold text-[#14245F] mt-3">Nenhum imóvel encontrado</h3>
            <p className="text-sm text-[#667085] mt-2">Não encontramos imóveis para arrendar com estes filtros.</p>
            <button onClick={reset} className="mt-5 px-4 py-2.5 rounded-xl bg-[#14245F] text-white text-sm font-semibold">Limpar filtros</button>
          </div>
        )}
      </section>
    </div>
  );
};
