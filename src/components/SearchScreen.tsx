import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  X,
  SlidersHorizontal,
  Briefcase,
  Users
} from 'lucide-react';
import { WorkerProfile, Job, UserLocation } from '../types';
import { POPULAR_CATEGORIES } from '../db/kaamlyStore';
import { INDIA_STATES_DATA } from '../data/indiaLocations';

interface SearchScreenProps {
  workers: WorkerProfile[];
  jobs: Job[];
  currentLocation: UserLocation;
  initialCategory?: string;
  onSelectWorker: (worker: WorkerProfile) => void;
  onSelectJob: (job: Job) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  workers,
  jobs,
  currentLocation,
  initialCategory,
  onSelectWorker,
  onSelectJob
}) => {
  const [searchMode, setSearchMode] = useState<'workers' | 'jobs'>('workers');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedState, setSelectedState] = useState<string>(currentLocation.state || 'All States');
  const [selectedCity, setSelectedCity] = useState<string>(currentLocation.city || 'All Cities');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filtered Workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      // Search query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          w.name.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.city.toLowerCase().includes(q) ||
          (w.locality && w.locality.toLowerCase().includes(q)) ||
          w.skills.some((s) => s.toLowerCase().includes(q)) ||
          w.shortDescription.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'All' && w.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // State
      if (selectedState !== 'All States' && w.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // City
      if (selectedCity !== 'All Cities' && w.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Rating
      if (minRating > 0 && w.rating < minRating) {
        return false;
      }

      // Availability
      if (onlyAvailable && w.availability !== 'available') {
        return false;
      }

      return true;
    });
  }, [workers, query, selectedCategory, selectedState, selectedCity, minRating, onlyAvailable]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.city.toLowerCase().includes(q) ||
          j.locality.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedCategory !== 'All' && j.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (selectedState !== 'All States' && j.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      if (selectedCity !== 'All Cities' && j.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [jobs, query, selectedCategory, selectedState, selectedCity]);

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedState('All States');
    setSelectedCity('All Cities');
    setMinRating(0);
    setOnlyAvailable(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Top Search Bar & Mode Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setSearchMode('workers')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                searchMode === 'workers'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Find Workers ({filteredWorkers.length})</span>
            </button>

            <button
              onClick={() => setSearchMode('jobs')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                searchMode === 'jobs'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Find Work / Jobs ({filteredJobs.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilters
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Query Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'workers'
                ? 'Search electricians, plumbers, carpenters, skills or areas...'
                : 'Search open work by title, category or neighborhood...'
            }
            className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Scrolling Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === 'All'
                ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat.name
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer/Box */}
        {showFilters && (
          <div className="p-4 bg-slate-900/95 border border-slate-800 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Refine Search Results
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-400 hover:underline"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* State */}
              <div>
                <label className="block text-slate-400 mb-1">State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('All Cities');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                >
                  <option value="All States">All States of India</option>
                  {INDIA_STATES_DATA.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-slate-400 mb-1">City Filter</label>
                <input
                  type="text"
                  value={selectedCity === 'All Cities' ? '' : selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value || 'All Cities')}
                  placeholder="e.g. Bengaluru, Pune, Delhi"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 placeholder-slate-500"
                />
              </div>

              {/* Rating */}
              {searchMode === 'workers' && (
                <div>
                  <label className="block text-slate-400 mb-1">Minimum Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5★ and higher</option>
                    <option value={4.0}>4.0★ and higher</option>
                    <option value={3.5}>3.5★ and higher</option>
                  </select>
                </div>
              )}
            </div>

            {searchMode === 'workers' && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="onlyAvail"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="onlyAvail" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Show only workers marked as "Available Now"
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {searchMode === 'workers' ? (
        <div>
          {filteredWorkers.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No workers match your exact filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening the city or rating filters, or search for a broader skill like "Wiring" or "Leakage".
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5">
                      <img
                        src={worker.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'}
                        alt={worker.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-amber-500/20 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-sm truncate">{worker.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{worker.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-amber-400 block mt-0.5">
                          {worker.category}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{worker.locality || worker.city}, {worker.state}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {worker.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {worker.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rate</span>
                      <span className="text-xs font-bold text-white">
                        ₹{worker.dailyRate || worker.hourlyRate || 300}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {worker.dailyRate ? ' / day' : ' / hr'}
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectWorker(worker)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <span>View & Hire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No jobs match your search</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active work postings currently match this filter. Try selecting "All Categories" or searching a different city.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
                        {job.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {job.applicationsCount || 0} applied
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors line-clamp-2">
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{job.locality}, {job.city}, {job.state}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Budget</span>
                      <span className="text-sm font-bold text-emerald-400">₹{job.budget}</span>
                    </div>

                    <span className="text-xs text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                      View Details & Apply <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
