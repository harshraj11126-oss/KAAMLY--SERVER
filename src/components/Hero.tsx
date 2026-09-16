import React from 'react';
import { 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  BadgeCheck, 
  Clock, 
  MapPin, 
  Wrench, 
  CheckCircle2,
  CalendarCheck,
  Smartphone
} from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
  selectedCity?: string;
  onQuickBook?: (service: string) => void;
  onOpenStorePublish?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreClick, 
  onHowItWorksClick,
  selectedCity = 'Bengaluru',
  onQuickBook,
  onOpenStorePublish,
}) => {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-slate-900 text-white"
    >
      {/* Structural subtle grid backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Subtle professional ambient depth */}
      <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-slate-800/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Pro Credential Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 text-blue-400 text-xs font-bold tracking-wide mb-6 border border-slate-700/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Institutional Quality • 100% Police & Skill Audited</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-5">
              Verified local experts.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                Transparent upfront pricing.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              Book certified electricians, plumbers, carpenters, and appliance repair technicians in <span className="text-white font-semibold underline decoration-blue-500 underline-offset-4">{selectedCity}</span>. Guaranteed standard rate card with a 30-day rework warranty.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                onClick={onExploreClick}
                id="hero-find-service-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm"
              >
                <span>Browse Services & Rates</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onHowItWorksClick}
                id="hero-how-it-works-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm"
              >
                Standard Safety Process
              </button>

              {onOpenStorePublish && (
                <button
                  onClick={onOpenStorePublish}
                  id="hero-store-publish-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Play Store & App Store Ready</span>
                </button>
              )}
            </div>

            {/* Trust Metrics Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 max-w-2xl">
              <div>
                <strong className="block text-2xl font-black text-white">50,000+</strong>
                <span className="text-xs font-medium text-slate-400">Verified Bookings</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-emerald-400">4.92 ★</strong>
                <span className="text-xs font-medium text-slate-400">Customer Rating</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-white">30-Day</strong>
                <span className="text-xs font-medium text-slate-400">Rework Warranty</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-blue-400">₹10,000</strong>
                <span className="text-xs font-medium text-slate-400">Damage Cover</span>
              </div>
            </div>
          </div>

          {/* Right Hero Card: Professional Verified Technician Profile */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xl relative">
              
              {/* Card Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/70">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>On-Duty & Ready in {selectedCity}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Avg arrival 30 min
                </span>
              </div>

              {/* Verified Pro Profile */}
              <div className="flex items-start gap-4 my-5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center border-2 border-slate-200 shadow-sm">
                    RS
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full text-xs shadow-xs" title="Aadhaar & Police Verified">
                    <BadgeCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-slate-900 truncate">
                      Rajesh Sharma
                    </h3>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                      Master Pro
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Wrench className="w-3 h-3 text-slate-400" />
                    <span>Certified Senior Electrician • 9+ Yrs Exp</span>
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-xs font-bold text-slate-700">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      4.95
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">342 Completed Jobs</span>
                  </div>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 mb-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Govt. ID (Aadhaar) & Police background cleared</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Equipped with certified safety gear & standard toolkits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Carries verified rate card with no hidden visit surcharges</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Starting Standard Fare
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ₹199 <span className="text-xs font-normal text-slate-500">/ base</span>
                  </span>
                </div>

                <button
                  onClick={() => onQuickBook ? onQuickBook('Electrician') : onExploreClick()}
                  id="hero-card-book-pro-btn"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-blue-600 shadow-sm transition-all cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Book Technician</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
