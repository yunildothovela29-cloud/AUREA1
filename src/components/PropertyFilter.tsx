import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';

export const PropertyFilter: React.FC<{
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  hideOperationFilter?: boolean;
}> = ({ filters, onFilterChange, onReset, totalCount }) => {
  const [more, setMore] = useState(false);
  const hasFilters = Boolean(filters.searchQuery || filters.location || filters.type || filters.minPrice || filters.maxPrice || filters.bedrooms || filters.sortBy !== 'featured');
  const locations = ['Polana', 'Sommerschield', 'Costa do Sol', 'Triunfo', 'Coop', 'Matola'];
  const types = ['Apartamento', 'Moradia', 'Penthouse', 'Escritório', 'Terreno'];

  return (
    <section className="bg-white border border-[#E1E6EE] rounded-2xl p-3 sm:p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1fr_auto] gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A95A7]" />
          <input value={filters.searchQuery} onChange={(e) => onFilterChange({ searchQuery: e.target.value })} placeholder="Pesquisar por zona ou tipo..." className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E1E6EE] text-sm text-[#14245F] outline-none focus:border-[#14245F]" />
        </div>
        <select value={filters.location} onChange={(e) => onFilterChange({ location: e.target.value })} className="px-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E1E6EE] text-sm text-[#14245F] outline-none"><option value="">Localização</option>{locations.map((v) => <option key={v}>{v}</option>)}</select>
        <select value={filters.type} onChange={(e) => onFilterChange({ type: e.target.value })} className="px-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E1E6EE] text-sm text-[#14245F] outline-none"><option value="">Tipo</option>{types.map((v) => <option key={v}>{v}</option>)}</select>
        <button onClick={() => setMore((v) => !v)} type="button" className={'px-3 py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ' + (more || hasFilters ? 'bg-[#14245F] text-white border-[#14245F]' : 'bg-white text-[#14245F] border-[#E1E6EE]')}><SlidersHorizontal className="w-4 h-4" /> Filtros <ChevronDown className={'w-4 h-4 transition-transform ' + (more ? 'rotate-180' : '')} /></button>
      </div>

      {more && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-3 mt-3 border-t border-[#EDF0F4]">
          <input type="number" min="0" value={filters.minPrice} onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : '' })} placeholder="Preço mínimo (MT)" className="field-lite" />
          <input type="number" min="0" value={filters.maxPrice} onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : '' })} placeholder="Preço máximo (MT)" className="field-lite" />
          <select value={filters.bedrooms} onChange={(e) => onFilterChange({ bedrooms: e.target.value })} className="field-lite"><option value="">Quartos</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select>
          <select value={filters.sortBy} onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })} className="field-lite"><option value="featured">Mais relevantes</option><option value="price-asc">Preço mais baixo</option><option value="price-desc">Preço mais alto</option><option value="area-desc">Maior área</option></select>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 px-1 text-xs text-[#6E7788]">
        <span><strong className="text-[#14245F]">{totalCount}</strong> {totalCount === 1 ? 'imóvel' : 'imóveis'}</span>
        {hasFilters && <button onClick={onReset} type="button" className="flex items-center gap-1 text-[#D93030] font-semibold"><RotateCcw className="w-3 h-3" /> Limpar</button>}
      </div>
      <style>{'.field-lite{width:100%;padding:11px 12px;border-radius:12px;border:1px solid #E1E6EE;background:#F7F9FC;color:#14245F;font-size:14px;outline:none}.field-lite:focus{border-color:#14245F}'}</style>
    </section>
  );
};
