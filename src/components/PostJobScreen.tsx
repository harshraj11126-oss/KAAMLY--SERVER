import React, { useState } from 'react';
import {
  PlusCircle,
  Sparkles,
  MapPin,
  IndianRupee,
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { User, UserLocation, Job } from '../types';
import { KaamlyStore, POPULAR_CATEGORIES } from '../db/kaamlyStore';
import { INDIA_STATES_DATA, getDistrictsByState, getCitiesByDistrict } from '../data/indiaLocations';
import { assistJobDescription } from '../services/geminiService';

interface PostJobScreenProps {
  currentUser: User | null;
  currentLocation: UserLocation;
  onJobCreated: (job: Job) => void;
  onRequireAuth: () => void;
}

const COMMON_CATEGORY_SKILLS: Record<string, string[]> = {
  Electrician: ['Fan Repair', 'Wiring', 'MCB Tripping', 'Switch Replacement', 'Inverter Connection'],
  Plumber: ['Tap Leakage', 'Pipe Fitting', 'Flush Tank', 'Geyser Installation', 'Motor Pump'],
  Carpenter: ['Door Lock', 'Bed Repair', 'Modular Kitchen', 'Drawer Hinges', 'Wood Polishing'],
  Painter: ['Wall Putty', 'Interior Paint', 'Waterproofing', 'Texture Work', 'Exterior Paint'],
  Mason: ['Brickwork', 'Tile Laying', 'Plastering', 'Cement Repair', 'Bathroom Renovation'],
  'Deep Cleaning': ['Full House Cleaning', 'Kitchen Chimney', 'Sofa Shampooing', 'Bathroom Scrubbing'],
  'AC & Appliance': ['AC Gas Refill', 'Washing Machine', 'Refrigerator Cooling', 'Microwave Repair']
};

export const PostJobScreen: React.FC<PostJobScreenProps> = ({
  currentUser,
  currentLocation,
  onJobCreated,
  onRequireAuth
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrician');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(500);
  const [budgetType, setBudgetType] = useState<'fixed' | 'daily' | 'hourly'>('fixed');
  const [preferredDate, setPreferredDate] = useState('Today / Immediate');
  const [contactPreference, setContactPreference] = useState<'call' | 'chat' | 'both'>('both');

  // Location fields
  const [state, setState] = useState(currentLocation.state || 'Karnataka');
  const [district, setDistrict] = useState(currentLocation.district || 'Bengaluru Urban');
  const [city, setCity] = useState(currentLocation.city || 'Bengaluru');
  const [locality, setLocality] = useState(currentLocation.locality || '');

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Wiring']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // AI Assist State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const suggested = COMMON_CATEGORY_SKILLS[newCat];
    if (suggested && suggested.length > 0) {
      setSelectedSkills([suggested[0], suggested[1] || 'General Work']);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(customSkillInput.trim())) {
        setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      }
      setCustomSkillInput('');
    }
  };

  const handleAIAssist = async () => {
    if (!title.trim()) {
      setError('Please enter a brief job title first so AI can draft a description.');
      return;
    }
    setError(null);
    setIsGeneratingAI(true);

    try {
      const generated = await assistJobDescription(
        category,
        title,
        locality ? `${locality}, ${city}` : city
      );
      setDescription(generated);
    } catch (err) {
      setDescription(
        `Looking for a reliable ${category} in ${locality || city} for "${title}". Need someone with proper tools and good punctuality. Please connect with your rates.`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for the work.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief description of what needs to be fixed or done.');
      return;
    }

    if (!budget || budget <= 0) {
      setError('Please enter a valid budget.');
      return;
    }

    const newJob = KaamlyStore.createJob({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      title: title.trim(),
      category,
      description: description.trim(),
      budget: Number(budget),
      budgetType,
      state,
      district,
      city,
      locality: locality.trim() || city,
      skills: selectedSkills,
      preferredDate,
      contactPreference
    });

    setSuccess(true);
    setTimeout(() => {
      onJobCreated(newJob);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>0% Commission • Direct Hiring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Post a Work Requirement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified local mistris and service providers in your city will view this and submit their proposals.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center gap-3 text-sm text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Work Posted Successfully!</p>
              <p className="text-xs text-emerald-400/80">
                Opening your listing and notifying nearby {category}s...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Title */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Work Title / Heading *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need Ceiling Fan Repair & MCB Replacement in 2BHK"
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500 font-medium"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Work Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-amber-400 font-medium"
              >
                {POPULAR_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.averageRate})
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                When Do You Need It Done?
              </label>
              <select
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="Today / Immediate">Today / Immediate (Urgent)</option>
                <option value="Tomorrow Morning">Tomorrow Morning</option>
                <option value="Within this Week">Within this Week</option>
                <option value="Flexible / Weekend">Flexible / On Weekend</option>
              </select>
            </div>
          </div>

          {/* Description + AI Assistant Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Work Details & Requirements *
              </label>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={isGeneratingAI}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:from-amber-500/30 hover:to-amber-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Refine with AI</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the problem, number of items, whether materials are provided by you or worker must bring them..."
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3.5 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500 leading-relaxed"
            />
          </div>

          {/* Required Skills Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Relevant Skills / Keywords
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Suggestions based on Category */}
            {COMMON_CATEGORY_SKILLS[category] && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                <span className="text-[11px] text-slate-500">Suggestions:</span>
                {COMMON_CATEGORY_SKILLS[category]
                  .filter((s) => !selectedSkills.includes(s))
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-[11px]"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Budget & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Offered Budget (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={50}
                  step={50}
                  required
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-base font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Budget Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {(['fixed', 'daily', 'hourly'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBudgetType(type)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all ${
                      budgetType === type
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {type === 'fixed' ? 'Fixed Total' : type === 'daily' ? 'Per Day' : 'Per Hour'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Location */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
              Exact Work Location
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    const dists = getDistrictsByState(e.target.value);
                    if (dists.length > 0) {
                      setDistrict(dists[0].name);
                      setCity(dists[0].cities[0] || e.target.value);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs"
                >
                  {INDIA_STATES_DATA.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const c = getCitiesByDistrict(state, e.target.value);
                    if (c.length > 0) setCity(c[0]);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs"
                >
                  {getDistrictsByState(state).map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City / Town</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs"
                >
                  {getCitiesByDistrict(state, district).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Locality / Landmark *
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Sector 18 or MG Road"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Worker Contact Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setContactPreference('both')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contactPreference === 'both'
                    ? 'border-amber-500 bg-amber-500/20 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call & Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setContactPreference('chat')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contactPreference === 'chat'
                    ? 'border-amber-500 bg-amber-500/20 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Chat Only</span>
              </button>

              <button
                type="button"
                onClick={() => setContactPreference('call')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  contactPreference === 'call'
                    ? 'border-amber-500 bg-amber-500/20 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Call Only</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-base shadow-xl hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-slate-950" />
            <span>Publish Work to Local Community</span>
          </button>
        </form>
      </div>
    </div>
  );
};
