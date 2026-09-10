import React from 'react';
import { 
  ClipboardList, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose Standard Service',
      description: 'Select your repair or maintenance need with clear, upfront Indian rate card pricing.',
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
    },
    {
      number: '02',
      title: 'Verified Pro Dispatch',
      description: 'System automatically pairs you with an Aadhaar & police background-cleared tradesperson.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      number: '03',
      title: 'Doorstep Execution',
      description: 'Technician arrives on schedule equipped with standard toolkits and certified safety gear.',
      icon: <Wrench className="w-5 h-5 text-indigo-600" />,
    },
    {
      number: '04',
      title: 'Warranty & Digital Pay',
      description: 'Inspect work, pay securely upon completion, and receive our 30-day rework warranty card.',
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-600" />,
    },
  ];

  return (
    <section id="how" className="py-16 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-blue-600 text-xs font-extrabold tracking-widest uppercase block mb-2">
            STANDARDIZED WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            How KAAMLY works
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Four simple steps to reliable, accountable home maintenance.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="flex flex-col justify-between p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black tracking-wider text-slate-400 font-mono">
                    STEP {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-4 pt-3 border-t border-slate-200/60">
                  <span>Next step</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
