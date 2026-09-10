import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  CalendarCheck, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  MapPin, 
  Briefcase,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types';

export const CITIES = [
  'Bengaluru',
  'Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai',
  'Ahmedabad',
];

interface HeaderProps {
  onOpenBookings: () => void;
  bookingsCount: number;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenBookings, 
  bookingsCount,
  currentUser,
  onOpenAuth,
  onSignOut,
  selectedCity = 'Bengaluru',
  onSelectCity,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ['home', 'services', 'how', 'why', 'contact'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCityDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Institutional Trust Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 border-b border-slate-800 hidden md:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Background & Police Verified Specialists
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              Standard Indian Rate Card • Zero Hidden Charges
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-semibold">
              30-Day Free Rework Warranty
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <a
              href="tel:18001205226"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-blue-400" />
              <span>Toll-Free 24x7: 1800-120-KAAMLY</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200'
            : 'bg-white border-b border-slate-200/90'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-18 flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & City Selector */}
            <div className="flex items-center gap-3 sm:gap-5">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
                id="brand-logo"
                className="flex items-center gap-2.5 group shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:bg-blue-600 transition-colors">
                  K
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                    KAAMLY
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">
                    Verified Home Services
                  </span>
                </div>
              </a>

              {/* City Selector Pill */}
              <div className="relative hidden sm:block" ref={cityRef}>
                <button
                  type="button"
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  title="Select your service city"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedCity}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {cityDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Available Service Cities
                    </div>
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          onSelectCity?.(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                          selectedCity === city
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <button
                onClick={() => scrollToSection('home')}
                className={`hover:text-blue-600 transition-colors cursor-pointer py-1 ${
                  activeSection === 'home' ? 'text-blue-600 font-bold' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`hover:text-blue-600 transition-colors cursor-pointer py-1 ${
                  activeSection === 'services' ? 'text-blue-600 font-bold' : ''
                }`}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('how')}
                className={`hover:text-blue-600 transition-colors cursor-pointer py-1 ${
                  activeSection === 'how' ? 'text-blue-600 font-bold' : ''
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('why')}
                className={`hover:text-blue-600 transition-colors cursor-pointer py-1 ${
                  activeSection === 'why' ? 'text-blue-600 font-bold' : ''
                }`}
              >
                Why KAAMLY
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`hover:text-blue-600 transition-colors cursor-pointer py-1 ${
                  activeSection === 'contact' ? 'text-blue-600 font-bold' : ''
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* My Requests Tracker */}
              <button
                onClick={onOpenBookings}
                id="my-bookings-btn"
                className="relative flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                title="View your booked services"
              >
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">My Requests</span>
                {bookingsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {bookingsCount}
                  </span>
                )}
              </button>

              {/* User State or Login/Register */}
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-xs font-bold text-slate-800 transition-all cursor-pointer"
                    aria-expanded={userDropdownOpen}
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="p-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900 leading-tight">
                              {currentUser.name}
                            </p>
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-0.5">
                              {currentUser.role === 'technician' ? 'Technician Pro' : 'Homeowner'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 truncate mt-1">
                          {currentUser.email}
                        </p>
                        {currentUser.location && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{currentUser.location}</span>
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenBookings();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Track My Requests ({bookingsCount})</span>
                        </button>

                        {currentUser.role === 'technician' && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              scrollToSection('services');
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg flex items-center gap-2 cursor-pointer"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span>View Incoming Jobs</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onSignOut();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    id="nav-login-btn"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Log In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuth('register')}
                    id="nav-register-btn"
                    className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 active:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <span>Register</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                id="menuBtn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div id="mobileMenu" className="lg:hidden py-4 border-t border-slate-100 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
              {/* Mobile City Selector */}
              <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> City:
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity?.(e.target.value)}
                  className="text-xs font-bold text-slate-900 bg-transparent border-none outline-none cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {currentUser ? (
                <div className="px-3 py-2 bg-slate-50 rounded-xl mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-1 mb-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="py-2 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="py-2 px-3 text-center text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-blue-600 cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              )}

              <button
                onClick={() => scrollToSection('home')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('how')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('why')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                Why KAAMLY
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
