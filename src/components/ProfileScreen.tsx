import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  Star,
  Globe,
  LogOut,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Settings,
  HelpCircle,
  ShieldAlert,
  Smartphone,
  Award
} from 'lucide-react';
import { User, WorkerProfile, UserRole } from '../types';
import { KaamlyStore, POPULAR_CATEGORIES } from '../db/kaamlyStore';
import { INDIA_STATES_DATA, getDistrictsByState, getCitiesByDistrict } from '../data/indiaLocations';

interface ProfileScreenProps {
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onRequireAuth: () => void;
  onOpenStorePublish: () => void;
  onOpenReport: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  onRequireAuth,
  onOpenStorePublish,
  onOpenReport
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your KAAMLY Profile</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Sign in to manage your account details, switch between worker and customer mode, and access settings.
        </p>
        <button
          onClick={onRequireAuth}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const isWorker = currentUser.role === 'worker';
  const workerProfile = KaamlyStore.getWorkerById(currentUser.id);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [state, setState] = useState(currentUser.state);
  const [district, setDistrict] = useState(currentUser.district);
  const [city, setCity] = useState(currentUser.city);
  const [locality, setLocality] = useState(currentUser.locality);
  const [language, setLanguage] = useState(currentUser.language || 'Hindi / English');

  // Worker specifics
  const [category, setCategory] = useState(workerProfile?.category || 'Electrician');
  const [dailyRate, setDailyRate] = useState(workerProfile?.dailyRate || 800);
  const [experienceYears, setExperienceYears] = useState(workerProfile?.experienceYears || 3);
  const [shortDescription, setShortDescription] = useState(
    workerProfile?.shortDescription || 'Professional local service provider.'
  );
  const [isAvailable, setIsAvailable] = useState(workerProfile?.availability === 'available');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name: name.trim(),
      state,
      district,
      city,
      locality: locality.trim() || city,
      language,
      updatedAt: new Date().toISOString()
    };

    KaamlyStore.saveUser(updatedUser);

    if (isWorker) {
      KaamlyStore.saveWorkerProfile({
        id: workerProfile?.id || `w-${Date.now()}`,
        userId: currentUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        category,
        skills: workerProfile?.skills || [category],
        experienceYears: Number(experienceYears),
        hourlyRate: Math.round(Number(dailyRate) / 8),
        dailyRate: Number(dailyRate),
        availability: isAvailable ? 'available' : 'busy',
        contactPreference: 'both',
        state: updatedUser.state,
        district: updatedUser.district,
        city: updatedUser.city,
        locality: updatedUser.locality,
        languages: [language],
        shortDescription,
        rating: workerProfile?.rating || 5.0,
        reviewsCount: workerProfile?.reviewsCount || 1,
        completedJobsCount: workerProfile?.completedJobsCount || 0,
        verifiedStatus: 'verified',
        createdAt: workerProfile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleToggleRole = () => {
    const newRole: UserRole = currentUser.role === 'customer' ? 'worker' : 'customer';
    const updatedUser: User = {
      ...currentUser,
      role: newRole,
      updatedAt: new Date().toISOString()
    };

    // If switching to worker and no worker profile yet, create standard one
    if (newRole === 'worker' && !workerProfile) {
      KaamlyStore.saveWorkerProfile({
        id: `w-${Date.now()}`,
        userId: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        category: 'Electrician',
        skills: ['House Wiring', 'Appliance Repair'],
        experienceYears: 3,
        hourlyRate: 250,
        dailyRate: 800,
        availability: 'available',
        contactPreference: 'both',
        state: currentUser.state,
        district: currentUser.district,
        city: currentUser.city,
        locality: currentUser.locality,
        languages: [currentUser.language || 'Hindi / English'],
        shortDescription: `Skilled professional in ${currentUser.city}. Ready for local jobs.`,
        rating: 5.0,
        reviewsCount: 1,
        completedJobsCount: 0,
        verifiedStatus: 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    KaamlyStore.saveUser(updatedUser);
    onUpdateUser(updatedUser);
  };

  const handleDeleteAccount = () => {
    KaamlyStore.deleteAccount(currentUser.id);
    onLogout();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isWorker
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {isWorker ? '🛠️ Worker / Mistri' : '👤 Customer / Employer'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.phone}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.locality || currentUser.city}, {currentUser.state}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Role Switcher Banner */}
        <div className="mt-5 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white block">
              Active Mode: {isWorker ? 'Worker (Mistri)' : 'Customer (Employer)'}
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              {isWorker
                ? 'Switch to Customer to post jobs and hire other workers'
                : 'Switch to Worker to showcase your trade skills and get hired'}
            </p>
          </div>
          <button
            onClick={handleToggleRole}
            className="px-4 py-2 bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            Switch to {isWorker ? 'Customer Mode' : 'Worker Mode'}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-white">Update Profile Information</h3>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    const d = getDistrictsByState(e.target.value);
                    if (d.length > 0) {
                      setDistrict(d[0].name);
                      setCity(d[0].cities[0] || e.target.value);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                >
                  {INDIA_STATES_DATA.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const c = getCitiesByDistrict(state, e.target.value);
                    if (c.length > 0) setCity(c[0]);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                >
                  {getDistrictsByState(state).map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">City / Town</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                >
                  {getCitiesByDistrict(state, district).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Locality</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Sector 18"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Worker Specific Edit Fields */}
            {isWorker && (
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Worker Trade & Rate Settings
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Trade Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                    >
                      {POPULAR_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Standard Daily Rate (₹)</label>
                    <input
                      type="number"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="availCheck"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <label htmlFor="availCheck" className="text-xs text-slate-300 font-medium">
                    Mark my profile as "Available for Work Now"
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md"
            >
              Save Profile Changes
            </button>
          </form>
        )}
      </div>

      {/* Production Readiness & Store Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Application & Store Standards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onOpenStorePublish}
            className="p-4 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl text-left transition-all group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm group-hover:text-emerald-400">
                <span>Play Store Publication Hub</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Verify package name, target API 36+, bundle AAB, and Play Store store listings.
              </p>
            </div>
          </button>

          <button
            onClick={onOpenReport}
            className="p-4 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/40 rounded-2xl text-left transition-all group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-red-950 text-red-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm group-hover:text-red-400">
                <span>Trust & Safety Moderation</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Report suspicious fraud, abusive behavior, or request worker verification.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Account Actions
        </h3>

        <button
          onClick={onLogout}
          className="w-full p-3.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out of Session</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-3.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Delete KAAMLY Account & Purge Data</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-500" />
          </button>
        ) : (
          <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-red-300">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p>
                Permanent Action: All your posted jobs, worker profile, received reviews and active chats will be immediately deleted. This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
