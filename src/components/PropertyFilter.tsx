import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState } from '../types';

interface PropertyFilterProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  hideOperationFilter?: boolean;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}) => {
  const [expanded, setExpanded] = useState(false);

  const locations = ['Todas', 'Polana', 'Sommerschield', 'Costa do Sol', 'Triunfo', 'Coop', 'Matola'];
  const types = ['Todos', 'Apartamento', 'Moradia', 'Penthouse', 'Escritório'];
  const bedroomOptions = [
    { label: 'Qualquer', value: '' },
    { label: '2+ Quartos', value: '2' },
    { label: '3+ Quartos', value: '3' },
    { label: '4+ Quartos', value: '4' },
  ];

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.location ||
    filters.type ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms ||
    filters.sortBy !== 'featured'
  );

  return (
    <div className="bg-white rounded-3xl border border-[#E8E2D6] p-6 sm:p-8 shadow-xs mb-10">
      {/* Primary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#8C8074] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Pesquisar por zona, tipologia ou palavras-chave..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs sm:text-sm text-[#221A15] placeholder-[#8C8074] focus:outline-hidden focus:border-[#825A39] transition-colors"
          />
        </div>

        {/* Location Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] transition-colors cursor-pointer"
          >
            <option value="">Localização (Todas)</option>
            {locations.filter((l) => l !== 'Todas').map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Type Dropdown */}
        <div className="md:col-span-2">
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full py-2.5 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs sm:text-sm text-[#221A15] focus:outline-hidden focus:border-[#825A39] transition-colors cursor-pointer"
          >
            <option value="">Tipo (Todos)</option>
            {types.filter((t) => t !== 'Todos').map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Filters Button */}
        <div className="md:col-span-2 flex gap-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              expanded || hasActiveFilters
                ? 'bg-[#3E2819] text-[#FAF8F5] border-[#3E2819]'
                : 'bg-[#FAF8F5] text-[#443831] border-[#E0D7C9] hover:bg-[#F2ECE1]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Secondary Filters */}
      {expanded && (
        <div className="pt-5 mt-4 border-t border-[#EFE9DF] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Minimum Price */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1.5">
              Preço Mínimo (MT)
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : '',
                })
              }
              placeholder="Ex: 5000000"
              className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39]"
            />
          </div>

          {/* Maximum Price */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1.5">
              Preço Máximo (MT)
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : '',
                })
              }
              placeholder="Ex: 35000000"
              className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39]"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1.5">
              Quartos Mínimos
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
              className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39]"
            >
              {bedroomOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Order / Sort */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B5E54] uppercase tracking-wider mb-1.5">
              Ordenar por
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-xs text-[#221A15] focus:outline-hidden focus:border-[#825A39]"
            >
              <option value="featured">Destaques da Curadoria</option>
              <option value="price-asc">Preço: Mais Baixo primeiro</option>
              <option value="price-desc">Preço: Mais Alto primeiro</option>
              <option value="area-desc">Maior Área (m²)</option>
            </select>
          </div>
        </div>
      )}

      {/* Sub-bar with Results count & Reset */}
      <div className="pt-3 mt-3 flex items-center justify-between text-xs text-[#6B5E54]">
        <div>
          <span className="font-semibold text-[#221A15]">{totalCount}</span>{' '}
          {totalCount === 1 ? 'propriedade encontrada' : 'propriedades encontradas'}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#825A39] hover:text-[#3E2819] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};

