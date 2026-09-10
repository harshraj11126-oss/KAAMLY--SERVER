import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [role, setRole] = useState<'homeowner' | 'technician'>('homeowner');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmailOrPhone('');
    setPassword('');
    setPhone('');
    setError(null);
    setSuccessMessage(null);
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleQuickDemo = (demoType: 'homeowner' | 'technician') => {
    if (demoType === 'homeowner') {
      const demoUser: User = {
        id: 'user-demo-1',
        name: 'Harsh Raaj',
        email: 'harshraj11126@gmail.com',
        phone: '+91 98765 43210',
        location: 'Indiranagar, Bengaluru',
        role: 'homeowner',
        avatar: '👨‍💼',
        joinedDate: 'September 2026',
      };
      setSuccessMessage('Logged in as demo homeowner!');
      setTimeout(() => {
        onAuthSuccess(demoUser);
        onClose();
        resetForm();
      }, 500);
    } else {
      const demoTech: User = {
        id: 'user-demo-2',
        name: 'Rajesh Sharma',
        email: 'rajesh.electrician@kaamly.in',
        phone: '+91 98112 34567',
        location: 'Sector 62, Noida, Delhi NCR',
        role: 'technician',
        avatar: '👨‍🔧',
        joinedDate: 'August 2026',
      };
      setSuccessMessage('Logged in as verified technician!');
      setTimeout(() => {
        onAuthSuccess(demoTech);
        onClose();
        resetForm();
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!emailOrPhone.trim()) {
        setError('Please enter your email address or mobile number.');
        return;
      }
      if (!password || password.length < 4) {
        setError('Please enter your password (minimum 4 characters).');
        return;
      }

      // Check existing accounts in localStorage or create session
      let existingUsers: User[] = [];
      try {
        const stored = localStorage.getItem('kaamly_users');
        if (stored) existingUsers = JSON.parse(stored);
      } catch {
        // Fallback
      }

      const foundUser = existingUsers.find(
        (u) =>
          u.email.toLowerCase() === emailOrPhone.trim().toLowerCase() ||
          u.phone.replace(/\s+/g, '') === emailOrPhone.trim().replace(/\s+/g, '')
      );

      const authenticatedUser: User = foundUser || {
        id: `user-${Date.now().toString().slice(-6)}`,
        name: emailOrPhone.includes('@')
          ? emailOrPhone.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Kaamly Member',
        email: emailOrPhone.includes('@') ? emailOrPhone.trim() : `${emailOrPhone.trim()}@user.kaamly.in`,
        phone: emailOrPhone.startsWith('+') || /^\d+$/.test(emailOrPhone) ? emailOrPhone.trim() : '+91 98765 43210',
        location: 'Bengaluru, India',
        role: 'homeowner',
        avatar: '👤',
        joinedDate: 'Just now',
      };

      setSuccessMessage(`Welcome back, ${authenticatedUser.name}!`);
      setTimeout(() => {
        onAuthSuccess(authenticatedUser);
        onClose();
        resetForm();
      }, 500);
    } else {
      // Register validation
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!emailOrPhone.trim() || !emailOrPhone.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter your 10-digit mobile number.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const newUser: User = {
        id: `user-${Date.now().toString().slice(-6)}`,
        name: name.trim(),
        email: emailOrPhone.trim().toLowerCase(),
        phone: phone.trim().startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
        location: location.trim(),
        role: role,
        avatar: role === 'technician' ? '👨‍🔧' : '👤',
        joinedDate: 'Joined today',
      };

      // Store in users registry
      try {
        const stored = localStorage.getItem('kaamly_users');
        const usersList: User[] = stored ? JSON.parse(stored) : [];
        usersList.push(newUser);
        localStorage.setItem('kaamly_users', JSON.stringify(usersList));
      } catch {
        // Fallback
      }

      setSuccessMessage(`Account created successfully! Welcome to KAAMLY, ${newUser.name}.`);
      setTimeout(() => {
        onAuthSuccess(newUser);
        onClose();
        resetForm();
      }, 600);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-xs">
              K
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                {mode === 'login' ? 'Welcome to KAAMLY' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mode === 'login'
                  ? 'Sign in to manage bookings and track requests'
                  : 'Join local homeowners and trusted service professionals'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Account Type Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    I want to join as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('homeowner')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                        role === 'homeowner'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700 ring-1 ring-blue-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>🏠</span>
                      <div>
                        <div className="leading-tight">Homeowner</div>
                        <div className="text-[10px] text-slate-400 font-normal">Book services</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('technician')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                        role === 'technician'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700 ring-1 ring-blue-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>🔧</span>
                      <div>
                        <div className="leading-tight">Technician</div>
                        <div className="text-[10px] text-slate-400 font-normal">Provide work</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Harsh Raaj"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            {/* Email or Phone */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                {mode === 'login' ? 'Email or Mobile Number' : 'Email Address'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={
                    mode === 'login' ? 'name@example.com or 9876543210' : 'name@example.com'
                  }
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    City / State
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all truncate"
                    >
                      <option value="Bengaluru, Karnataka">Bengaluru</option>
                      <option value="Delhi NCR, New Delhi">Delhi NCR</option>
                      <option value="Mumbai, Maharashtra">Mumbai</option>
                      <option value="Pune, Maharashtra">Pune</option>
                      <option value="Hyderabad, Telangana">Hyderabad</option>
                      <option value="Kolkata, West Bengal">Kolkata</option>
                      <option value="Ahmedabad, Gujarat">Ahmedabad</option>
                      <option value="Jaipur, Rajasthan">Jaipur</option>
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email/phone.')}
                    className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                One-Click Quick Login
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Instant test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('homeowner')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1">
                  <span>👨‍💼</span>
                  <span>Harsh Raaj</span>
                </div>
                <div className="text-[10px] text-slate-400">Homeowner (BLR)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('technician')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1">
                  <span>👨‍🔧</span>
                  <span>Rajesh Sharma</span>
                </div>
                <div className="text-[10px] text-slate-400">Technician (Pro)</div>
              </button>
            </div>
          </div>

          {/* Trust Guarantee */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure 256-bit encryption • No spam guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
