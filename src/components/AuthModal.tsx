import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Briefcase,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';
import { ApiClient } from '../services/apiClient';
import { INDIA_STATES_DATA, getDistrictsByState, getCitiesByDistrict } from '../data/indiaLocations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer',
  onAuthSuccess
}) => {
  // Step flow: 'phone' -> 'otp' -> 'profile_setup'
  const [step, setStep] = useState<'phone' | 'otp' | 'profile_setup'>('phone');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);

  // Profile setup fields
  const [name, setName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('Indiranagar');
  const [language, setLanguage] = useState('Hindi / English');

  // Pending user object once authenticated
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.requestOtp(clean);
      if (res.sandboxCode) {
        setSandboxCode(res.sandboxCode);
      } else {
        setSandboxCode(null);
      }
      setOtpInput('');
      setStep('otp');
      setTimer(res.retryAfterSeconds || 45);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpInput.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91 ${phoneNumber.replace(/\D/g, '')}`;
      const res = await ApiClient.verifyOtp(fullPhone, otpInput.trim(), role);
      const user = res.user;

      // Keep client store in sync
      KaamlyStore.setCurrentUser(user);
      KaamlyStore.saveUser(user);

      if (res.isNew || !user.name || user.name === 'Kaamly Member' || user.name === 'New Kaamly Worker') {
        setPendingUser(user);
        setName(user.name.startsWith('New') || user.name.startsWith('Kaamly') ? '' : user.name);
        setState(user.state || 'Karnataka');
        setDistrict(user.district || 'Bengaluru Urban');
        setCity(user.city || 'Bengaluru');
        setLocality(user.locality || '');
        setStep('profile_setup');
      } else {
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!pendingUser) return;

    setLoading(true);
    try {
      const profileUpdates: Partial<User> = {
        name: name.trim(),
        role,
        state,
        district,
        city,
        locality: locality.trim() || city,
        language
      };

      const res = await ApiClient.updateProfile(profileUpdates);
      const updatedUser = res.user;

      // If worker, ensure worker profile
      if (role === 'worker') {
        await ApiClient.updateWorkerProfile({
          name: updatedUser.name,
          category: 'Electrician',
          skills: ['House Wiring', 'Appliance Repair'],
          experienceYears: 3,
          hourlyRate: 250,
          dailyRate: 800,
          availability: 'available',
          contactPreference: 'both',
          state: updatedUser.state,
          district: updatedUser.district,
          city: updatedUser.city,
          locality: updatedUser.locality,
          languages: [language],
          shortDescription: `Skilled professional service provider in ${updatedUser.city}.`
        });
      }

      KaamlyStore.saveUser(updatedUser);
      KaamlyStore.setCurrentUser(updatedUser);
      onAuthSuccess(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (stateName: string) => {
    setState(stateName);
    const stateDistricts = getDistrictsByState(stateName);
    if (stateDistricts.length > 0) {
      setDistrict(stateDistricts[0].name);
      setCity(stateDistricts[0].cities[0] || stateName);
    }
  };

  const handleDistrictChange = (distName: string) => {
    setDistrict(distName);
    const distCities = getCitiesByDistrict(state, distName);
    if (distCities.length > 0) {
      setCity(distCities[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
              K
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {step === 'phone' ? 'Sign In / Register' : step === 'otp' ? 'Enter Verification Code' : 'Complete Your Profile'}
              </h3>
              <p className="text-xs text-slate-400">KAAMLY • Local Work, Trusted People</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  I want to use KAAMLY as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      role === 'customer'
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <UserIcon className={`w-4 h-4 ${role === 'customer' ? 'text-amber-400' : 'text-slate-400'}`} />
                      {role === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="font-bold text-sm text-white">Customer</span>
                    <span className="text-[11px] text-slate-400">Hire workers & post work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      role === 'worker'
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Briefcase className={`w-4 h-4 ${role === 'worker' ? 'text-amber-400' : 'text-slate-400'}`} />
                      {role === 'worker' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="font-bold text-sm text-white">Worker / Mistri</span>
                    <span className="text-[11px] text-slate-400">Find jobs & earn daily</span>
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number (India)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-slate-400 flex items-center gap-1.5 border-r border-slate-700 pr-2.5">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    maxLength={10}
                    autoFocus
                    required
                    className="w-full pl-22 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-base tracking-wider focus:outline-none focus:border-amber-400 placeholder-slate-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  We will send a 6-digit OTP verification code via SMS.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-300">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Secure SMS Verification</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  A single-use 6-digit code has been dispatched to <strong className="text-white">+91 {phoneNumber}</strong>. Valid for 5 minutes.
                </p>
                {sandboxCode && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-amber-400/90 font-medium">🧪 Sandbox Code (Dev Testing):</span>
                    <button
                      type="button"
                      onClick={() => setOtpInput(sandboxCode)}
                      className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono font-bold rounded cursor-pointer transition-colors"
                    >
                      {sandboxCode} (Auto-Fill)
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  maxLength={6}
                  autoFocus
                  required
                  className="w-full text-center py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-2xl tracking-[0.4em] font-mono focus:outline-none focus:border-amber-400 placeholder-slate-600"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-slate-400 hover:text-white"
                >
                  Change Number
                </button>

                {canResend ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const clean = phoneNumber.replace(/\D/g, '');
                        const res = await ApiClient.requestOtp(clean);
                        if (res.sandboxCode) setSandboxCode(res.sandboxCode);
                        setTimer(res.retryAfterSeconds || 45);
                        setCanResend(false);
                      } catch (err: any) {
                        setError(err.message || 'Failed to resend OTP.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                ) : (
                  <span className="text-slate-500 font-mono">Resend in {timer}s</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpInput.length !== 6}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify & Login'}</span>
              </button>
            </form>
          )}

          {step === 'profile_setup' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Business Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {INDIA_STATES_DATA.map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {getDistrictsByState(state).map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City / Town
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {getCitiesByDistrict(state, district).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Locality / Area
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Sector 18"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-amber-400 placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Hindi / English">Hindi / English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Bhojpuri">Bhojpuri (भोजपुरी)</option>
                  <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & Start Using KAAMLY</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
