import React from 'react';
import { ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';
import { CITIES } from './Header';

interface FooterProps {
  onServiceClick: (serviceName: string) => void;
  onNavigate: (sectionId: string) => void;
  onSelectCity?: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onServiceClick, 
  onNavigate,
  onSelectCity 
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-lg">
                K
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                KAAMLY
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm mb-5 max-w-sm leading-relaxed">
              India's verified marketplace for everyday home repairs and trade services. Backed by standard rate cards, background audits, and a 30-day rework warranty.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-200">1800-120-KAAMLY (Toll-Free 24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@kaamly.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Standard Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Why KAAMLY
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support Hotline
                </button>
              </li>
            </ul>
          </div>

          {/* Top Services */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Standard Rate Cards
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onServiceClick('Electrician')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full max-w-[200px]"
                >
                  <span>Electrician Work</span>
                  <span className="text-slate-500 font-mono">₹199/hr</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onServiceClick('Plumber')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full max-w-[200px]"
                >
                  <span>Plumbing & Leakage</span>
                  <span className="text-slate-500 font-mono">₹249/hr</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onServiceClick('AC Repair')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full max-w-[200px]"
                >
                  <span>AC Servicing & Gas</span>
                  <span className="text-slate-500 font-mono">₹499/unit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onServiceClick('Cleaning')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full max-w-[200px]"
                >
                  <span>Deep Cleaning</span>
                  <span className="text-slate-500 font-mono">₹699/room</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onServiceClick('Carpenter')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full max-w-[200px]"
                >
                  <span>Carpentry & Furniture</span>
                  <span className="text-slate-500 font-mono">₹299/hr</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Service Cities */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Cities Served
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity?.(city)}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-2.5 h-2.5 text-blue-400" />
                  <span>{city}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Urban Safety & ID Audited</span>
              </div>
              <p className="leading-relaxed">
                All personnel carry verified digital badges with Aadhaar authentication.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p id="year">
            © {currentYear} KAAMLY Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Trust & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
