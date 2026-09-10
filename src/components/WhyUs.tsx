import React from 'react';
import { ShieldCheck, CircleDollarSign, Clock, Award } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const features = [
    {
      id: 'f1',
      title: 'Aadhaar & Police Verified Tradespeople',
      description: 'Zero freelance uncertainty. Every professional passes strict identity authentication, criminal background check, and skill audit before onboard.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'f2',
      title: 'Fixed Rate Card & Upfront Pricing',
      description: 'Never haggle at your doorstep again. Transparent price tables for every standard task with itemized billing and digital receipts.',
      icon: <CircleDollarSign className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'f3',
      title: 'Same-Day Rapid Dispatch SLA',
      description: 'Need an emergency plumber or electrician? Enjoy rapid doorstep dispatch within 30-60 minutes across all supported pin codes.',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'f4',
      title: '30-Day Free Rework Warranty',
      description: 'Your satisfaction is protected by institutional guarantee. In the rare event an issue recurs, our pro revisits at zero extra charge.',
      icon: <Award className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <section id="why" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-blue-600 text-xs font-extrabold tracking-widest uppercase block mb-2">
            THE KAAMLY ADVANTAGE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Why leading households choose KAAMLY
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Setting the standard for safety, transparency, and workmanship in local home services.
          </p>
        </div>

        {/* Features 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-200 shadow-2xs">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
