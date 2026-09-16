import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Search, Check, X, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { INDIA_STATES_DATA, getDistrictsByState, getCitiesByDistrict, searchLocations } from '../data/indiaLocations';
import { detectCurrentLocation } from '../services/locationService';
import { UserLocation } from '../types';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (location: UserLocation) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'search'>('hierarchy');
  const [selectedState, setSelectedState] = useState<string>(currentLocation.state || 'Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentLocation.district || 'Bengaluru Urban');
  const [selectedCity, setSelectedCity] = useState<string>(currentLocation.city || 'Bengaluru');
  const [localityInput, setLocalityInput] = useState<string>(currentLocation.locality || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Available districts for chosen state
  const districts = useMemo(() => {
    return getDistrictsByState(selectedState);
  }, [selectedState]);

  // Available cities for chosen state & district
  const cities = useMemo(() => {
    return getCitiesByDistrict(selectedState, selectedDistrict);
  }, [selectedState, selectedDistrict]);

  // Search results
  const searchResults = useMemo(() => {
    return searchLocations(searchQuery, 20);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateDistricts = getDistrictsByState(stateName);
    if (stateDistricts.length > 0) {
      const firstDist = stateDistricts[0];
      setSelectedDistrict(firstDist.name);
      setSelectedCity(firstDist.cities[0] || stateName);
    } else {
      setSelectedDistrict('');
      setSelectedCity(stateName);
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const distCities = getCitiesByDistrict(selectedState, distName);
    if (distCities.length > 0) {
      setSelectedCity(distCities[0]);
    } else {
      setSelectedCity(distName);
    }
  };

  const handleConfirmLocation = () => {
    onSelectLocation({
      state: selectedState,
      district: selectedDistrict,
      city: selectedCity,
      locality: localityInput.trim() || selectedCity,
      isGPS: false
    });
    onClose();
  };

  const handleGPSDetect = async () => {
    setIsDetectingGPS(true);
    setGpsError(null);
    const result = await detectCurrentLocation();
    setIsDetectingGPS(false);

    if (result.success && result.location) {
      onSelectLocation(result.location);
      onClose();
    } else {
      setGpsError(result.errorMessage || 'Could not fetch GPS location.');
    }
  };

  const handleSelectSearchResult = (item: { city: string; district: string; state: string }) => {
    setSelectedState(item.state);
    setSelectedDistrict(item.district);
    setSelectedCity(item.city);
    onSelectLocation({
      state: item.state,
      district: item.district,
      city: item.city,
      locality: item.city,
      isGPS: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Select Your Location</h3>
              <p className="text-xs text-slate-400">All 28 States & 8 UTs of India</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Detect Button */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800">
          <button
            onClick={handleGPSDetect}
            disabled={isDetectingGPS}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium shadow-md hover:shadow-emerald-500/20 transition-all text-sm disabled:opacity-50"
          >
            {isDetectingGPS ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Detecting GPS Location...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Use My Current GPS Location</span>
              </>
            )}
          </button>

          {gpsError && (
            <div className="mt-2.5 p-2.5 bg-red-950/60 border border-red-800/60 rounded-lg flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-4 pt-2">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'hierarchy'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            State &gt; District &gt; City
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Quick City Search
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'hierarchy' ? (
            <div className="space-y-3.5">
              {/* 1. State / UT Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  1. State / Union Territory (28 States & 8 UTs)
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                >
                  <optgroup label="28 States of India">
                    {INDIA_STATES_DATA.filter((s) => s.type === 'state').map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="8 Union Territories">
                    {INDIA_STATES_DATA.filter((s) => s.type === 'ut').map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name} (UT)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. District Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  2. District in {selectedState}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={districts.length === 0}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 disabled:opacity-50"
                >
                  {districts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. City / Town Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  3. City / Town in {selectedDistrict || selectedState}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={cities.length === 0}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 disabled:opacity-50"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Locality / Area (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  4. Locality / Landmark / Ward (Optional)
                </label>
                <input
                  type="text"
                  value={localityInput}
                  onChange={(e) => setLocalityInput(e.target.value)}
                  placeholder="e.g. Sector 18, Indiranagar, Station Road"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
              </div>

              {/* Selection Summary Pill */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Target Area: </span>
                  {selectedCity}, {selectedDistrict}, {selectedState}
                </div>
                <Check className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type city or district (e.g. Noida, Patna, Pune...)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                  autoFocus
                />
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {searchQuery.trim().length < 2 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Type at least 2 letters to search across all Indian cities and districts.
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No matching location found. Use the State &gt; District &gt; City tab.
                  </p>
                ) : (
                  searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">
                          {item.city}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.district}, {item.state}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {activeTab === 'hierarchy' && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLocation}
              className="px-6 py-2.5 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              Set Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
