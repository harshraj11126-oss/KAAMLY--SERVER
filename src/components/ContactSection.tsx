import React from 'react';
import { ArrowRight, PhoneCall, ShieldCheck, Headphones } from 'lucide-react';

interface ContactSectionProps {
  onGetStarted: () => void;
  onRegisterPro?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  onGetStarted,
  onRegisterPro,
}) => {
  return (
    <section id="contact" className="py-16 md:py-20 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-slate-800/70 border border-slate-700/80 rounded-3xl p-8 sm:p-12">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-extrabold tracking-widest uppercase mb-3">
              <Headphones className="w-4 h-4" />
              <span>ROUND-THE-CLOCK ASSISTANCE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3">
              Ready to book a verified professional?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Skip the uncertainty. Get background-verified technicians at standardized rates with our 30-day rework warranty.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <a
                href="tel:18001205226"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200">Toll-Free 24x7: 1800-120-KAAMLY</span>
              </a>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Average doorstep dispatch: under 30 minutes
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onRegisterPro && (
              <button
                type="button"
                onClick={onRegisterPro}
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all cursor-pointer text-xs"
              >
                Join as Technician Pro
              </button>
            )}

            <button
              onClick={onGetStarted}
              id="contact-get-started-btn"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <span>Explore Services & Book</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
