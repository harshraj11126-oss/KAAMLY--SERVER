import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  Zap,
  Wrench,
  Smartphone,
  Star
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

type AuthMode = 'otp' | 'password' | 'quick';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer',
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('otp');
  const [role, setRole] = useState<UserRole>(initialRole);

  // OTP flow states: 'phone' -> 'otp' -> 'profile_setup'
  const [otpStep, setOtpStep] = useState<'phone' | 'otp' | 'profile_setup'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [receivedOtpCode, setReceivedOtpCode] = useState<string | null>(null);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  // Password sign-in / registration states
  const [passwordMode, setPasswordMode] = useState<'login' | 'register'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Quick accounts state
  const [quickAccounts, setQuickAccounts] = useState<Array<{
    id: string;
    name: string;
    role: 'customer' | 'worker';
    phone: string;
    email?: string;
    title: string;
    avatar?: string;
    rating?: number;
    category?: string;
    locality?: string;
    city?: string;
  }>>([]);

  // Profile setup states
  const [name, setName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('Indiranagar');
  const [language, setLanguage] = useState('Hindi / English');
  const [workerCategory, setWorkerCategory] = useState('Electrician');
  const [experienceYears, setExperienceYears] = useState(4);
  const [dailyRate, setDailyRate] = useState(800);
  const [hourlyRate, setHourlyRate] = useState(250);

  // Pending user object once authenticated
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Common UI states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load quick login accounts on open
  useEffect(() => {
    if (isOpen) {
      ApiClient.getQuickAccounts()
        .then((res) => {
          if (res.accounts && res.accounts.length > 0) {
            setQuickAccounts(res.accounts);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpStep, timer]);

  if (!isOpen) return null;

  // --- OTP Handlers ---
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
      const code = res.otpCode || res.sandboxCode || '123456';
      setReceivedOtpCode(code);
      setSimulatedSmsToast(`KAAMLY: ${code} is your OTP verification code. Valid for 5 minutes.`);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpStep('otp');
      setTimer(res.retryAfterSeconds || 45);
      setCanResend(false);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const numeric = val.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (!numeric) {
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (numeric.length > 1) {
      const pasted = numeric.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = numeric;
    setOtpDigits(newDigits);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!receivedOtpCode) return;
    const digits = receivedOtpCode.slice(0, 6).split('');
    setOtpDigits(digits);
    otpInputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91 ${phoneNumber.replace(/\D/g, '')}`;
      const res = await ApiClient.verifyOtp(fullPhone, fullCode, role);
      const user = res.user;

      KaamlyStore.setCurrentUser(user);
      KaamlyStore.saveUser(user);

      if (res.isNew || !user.name || user.name === 'Kaamly Member' || user.name === 'New Kaamly Worker') {
        setPendingUser(user);
        setName(user.name.startsWith('New') || user.name.startsWith('Kaamly') ? '' : user.name);
        setState(user.state || 'Karnataka');
        setDistrict(user.district || 'Bengaluru Urban');
        setCity(user.city || 'Bengaluru');
        setLocality(user.locality || '');
        setOtpStep('profile_setup');
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

  // --- Password Handlers ---
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Please enter both email/phone and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.loginWithPassword(loginIdentifier.trim(), loginPassword);
      KaamlyStore.setCurrentUser(res.user);
      KaamlyStore.saveUser(res.user);
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.registerWithPassword({
        name: regName.trim(),
        email: regEmail.trim() || undefined,
        phone: regPhone.trim() || undefined,
        password: regPassword,
        role,
        city: 'Bengaluru',
        state: 'Karnataka'
      });

      KaamlyStore.setCurrentUser(res.user);
      KaamlyStore.saveUser(res.user);

      if (role === 'worker') {
        await ApiClient.updateWorkerProfile({
          name: res.user.name,
          category: workerCategory,
          skills: ['General Service', 'Diagnostics'],
          experienceYears: 3,
          hourlyRate: 250,
          dailyRate: 800,
          availability: 'available',
          contactPreference: 'both',
          state: res.user.state,
          district: res.user.district,
          city: res.user.city,
          locality: res.user.locality,
          languages: ['Hindi', 'English'],
          shortDescription: `Verified professional ${workerCategory} in ${res.user.city}.`
        }).catch(() => {});
      }

      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  // --- Quick One-Tap Login ---
  const handleQuickLogin = async (userId: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await ApiClient.quickLogin(userId);
      KaamlyStore.setCurrentUser(res.user);
      KaamlyStore.saveUser(res.user);
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Google Sign-In ---
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await ApiClient.googleLogin({
        email: 'user.kaamly@gmail.com',
        name: role === 'worker' ? 'Ramesh Patel' : 'Ananya Rao',
        role
      });
      KaamlyStore.setCurrentUser(res.user);
      KaamlyStore.saveUser(res.user);
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Complete Profile Handler ---
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

      if (role === 'worker') {
        await ApiClient.updateWorkerProfile({
          name: updatedUser.name,
          category: workerCategory,
          skills: [workerCategory, 'General Installation', 'Repairs'],
          experienceYears,
          hourlyRate,
          dailyRate,
          availability: 'available',
          contactPreference: 'both',
          state: updatedUser.state,
          district: updatedUser.district,
          city: updatedUser.city,
          locality: updatedUser.locality,
          languages: [language],
          shortDescription: `Skilled professional ${workerCategory} in ${updatedUser.city} with ${experienceYears} years experience.`
        }).catch(() => {});
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Top Simulated SMS Toast Banner */}
      {simulatedSmsToast && (
        <div className="fixed top-4 inset-x-3 max-w-md mx-auto z-60 bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl p-3.5 backdrop-blur-md animate-slide-down">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Messages</span>
                  <span className="text-[10px] text-slate-400">• Just now</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">{simulatedSmsToast}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSimulatedSmsToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {receivedOtpCode && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-amber-400 font-medium">OTP: {receivedOtpCode}</span>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>Tap to Auto-Fill</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
              K
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {otpStep === 'profile_setup' ? 'Complete Your Profile' : 'Sign In to KAAMLY'}
              </h3>
              <p className="text-xs text-slate-400">Trusted Local Workers & Immediate Home Hire</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Method Navigation Tabs (When not on OTP or profile setup) */}
        {otpStep === 'phone' && (
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setError(null);
              }}
              className={`py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'otp'
                  ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setError(null);
              }}
              className={`py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'password'
                  ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('quick');
                setError(null);
              }}
              className={`py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'quick'
                  ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1-Tap Demo</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-xl flex items-center gap-2.5 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= MODE 1: MOBILE OTP ================= */}
          {authMode === 'otp' && otpStep === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Role Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  I am signing in as:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      role === 'customer'
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <UserIcon className={`w-4 h-4 ${role === 'customer' ? 'text-amber-400' : 'text-slate-400'}`} />
                      {role === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="font-bold text-sm text-white">Customer / Owner</span>
                    <span className="text-[11px] text-slate-400">Post jobs & hire workers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      role === 'worker'
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Briefcase className={`w-4 h-4 ${role === 'worker' ? 'text-amber-400' : 'text-slate-400'}`} />
                      {role === 'worker' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="font-bold text-sm text-white">Worker / Mistri</span>
                    <span className="text-[11px] text-slate-400">Find daily work & get hired</span>
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number (India)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-slate-300 flex items-center gap-1.5 border-r border-slate-700 pr-2.5">
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
                  We will send a 6-digit SMS verification code to your phone.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>{loading ? 'Sending Code...' : 'Get Verification Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative py-1 flex items-center justify-center">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold absolute">
                  Or continue with
                </span>
              </div>

              {/* Social Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* ================= OTP VERIFICATION SCREEN ================= */}
          {authMode === 'otp' && otpStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Enter 6-Digit OTP</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Sent to <strong className="text-white">+91 {phoneNumber}</strong>
                </p>
              </div>

              {/* 6 Segmented PIN boxes */}
              <div>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center rounded-xl bg-slate-800 border text-xl sm:text-2xl font-mono font-bold text-white transition-all focus:outline-none ${
                        digit
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                  ))}
                </div>

                {receivedOtpCode && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 transition-colors"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Code: {receivedOtpCode} (Click to Fill)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setOtpStep('phone')}
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
                        const code = res.otpCode || res.sandboxCode || '123456';
                        setReceivedOtpCode(code);
                        setSimulatedSmsToast(`KAAMLY: ${code} is your OTP code. Valid for 5 min.`);
                        setTimer(res.retryAfterSeconds || 45);
                        setCanResend(false);
                      } catch (err: any) {
                        setError(err.message || 'Failed to resend code.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <span className="text-slate-500">
                    Resend code in <strong className="text-slate-400">{timer}s</strong>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
              </button>
            </form>
          )}

          {/* ================= MODE 2: EMAIL & PASSWORD ================= */}
          {authMode === 'password' && otpStep === 'phone' && (
            <div className="space-y-4">
              <div className="flex bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordMode('login');
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    passwordMode === 'login' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordMode('register');
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    passwordMode === 'register' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {passwordMode === 'login' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. rahul@example.com or 9845011223"
                        required
                        autoFocus
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your account password"
                        required
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !loginIdentifier.trim() || !loginPassword}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer mt-1"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          role === 'customer'
                            ? 'border-amber-400 bg-amber-500/15 text-white'
                            : 'border-slate-700 bg-slate-800 text-slate-400'
                        }`}
                      >
                        Customer / Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('worker')}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          role === 'worker'
                            ? 'border-amber-400 bg-amber-500/15 text-white'
                            : 'border-slate-700 bg-slate-800 text-slate-400'
                        }`}
                      >
                        Worker / Mistri
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Suresh Kumar"
                      required
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@mail.com"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Set Password (min. 6 characters) *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !regName.trim() || regPassword.length < 6}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer mt-1"
                  >
                    {loading ? 'Creating Account...' : 'Create Account & Start'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================= MODE 3: 1-TAP DEMO ACCOUNTS ================= */}
          {authMode === 'quick' && otpStep === 'phone' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Instant Preview & Testing
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Select any pre-configured verified persona to instantly explore the complete application without typing credentials.
                </p>
              </div>

              <div className="space-y-2">
                {quickAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickLogin(acc.id)}
                    className="w-full p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl flex items-center justify-between transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {acc.avatar ? (
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold">
                          {acc.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                            {acc.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              acc.role === 'worker'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {acc.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{acc.title}</span>
                          {acc.rating && (
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{acc.rating}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-amber-400 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 3: COMPLETE PROFILE SETUP ================= */}
          {otpStep === 'profile_setup' && (
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

              {role === 'worker' && (
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2.5">
                  <div className="font-semibold text-xs text-amber-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Worker Trade & Rate Settings</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Primary Profession / Trade
                    </label>
                    <select
                      value={workerCategory}
                      onChange={(e) => setWorkerCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Electrician">Electrician (बिजली मिस्त्री)</option>
                      <option value="Plumber">Plumber (प्लंबर)</option>
                      <option value="Carpenter">Carpenter (बढ़ई)</option>
                      <option value="Painter">Painter (पेंटर)</option>
                      <option value="Mason">Mason / Mistri (राजमिस्त्री)</option>
                      <option value="House Cleaner">House Cleaner (सफाई कर्मी)</option>
                      <option value="AC Technician">AC Technician (एसी मैकेनिक)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Daily Wage (₹/day)
                      </label>
                      <input
                        type="number"
                        min={300}
                        max={3000}
                        value={dailyRate}
                        onChange={(e) => setDailyRate(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

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
                    placeholder="e.g. Sector 18 or Indiranagar"
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
                disabled={loading || !name.trim()}
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
