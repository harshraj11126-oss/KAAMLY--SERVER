import React from 'react';
import { Search, X, MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  resultsCount: number;
  totalCount: number;
  onSearchSubmit: () => void;
  selectedCity?: string;
}

const CATEGORIES = [
  'All',
  'Electrical',
  'Plumbing',
  'Cooling',
  'Cleaning',
  'Carpentry',
  'Painting',
  'Appliances',
];

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  resultsCount,
  totalCount,
  onSearchSubmit,
  selectedCity = 'Bengaluru',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <section id="search" className="relative -mt-7 z-20 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-900/5">
        
        {/* Main Search Input Box */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          
          {/* City Indicator Badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100/90 text-slate-700 text-xs font-bold shrink-0 border border-slate-200/60">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[130px]">{selectedCity}</span>
          </div>

          <div className="flex-1 flex items-center min-w-0 bg-slate-50 rounded-xl border border-slate-200/70 px-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />

            <input
              type="text"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by trade, task, or issue (e.g., fan switch, tap leakage, deep clean)..."
              autoComplete="off"
              className="flex-1 min-w-0 py-2.5 sm:py-3 px-2.5 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm outline-none bg-transparent"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/70 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="searchBtn"
            onClick={onSearchSubmit}
            className="px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Find Service
          </button>
        </div>

        {/* Quick Filter Category Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-slate-400 font-semibold pl-1 pr-1 hidden sm:flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div id="searchMessage" className="text-center mt-3 text-xs font-semibold text-slate-500 h-5">
        {searchQuery.trim() !== '' || selectedCategory !== 'All' ? (
          resultsCount > 0 ? (
            <span className="text-blue-600">
              Showing {resultsCount} verified service{resultsCount === 1 ? '' : 's'} available in {selectedCity}
            </span>
          ) : (
            <span className="text-rose-500">
              No matching service found. Try a different keyword like "electrician", "tap", or "ac".
            </span>
          )
        ) : (
          <span className="text-slate-400">
            {totalCount} verified service trades available with standardized rate cards in {selectedCity}
          </span>
        )}
      </div>
    </section>
  );
};
