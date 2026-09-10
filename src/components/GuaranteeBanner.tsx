import React from 'react';
import { ShieldCheck, BadgeCheck, FileCheck, CircleDollarSign } from 'lucide-react';

export const GuaranteeBanner: React.FC = () => {
  const pillars = [
    {
      icon: <BadgeCheck className="w-6 h-6 text-blue-600" />,
      title: 'Verified Professionals',
      desc: '3-level background audit, Aadhaar verification, and hands-on skill trade testing.',
    },
    {
      icon: <CircleDollarSign className="w-6 h-6 text-blue-600" />,
      title: 'Upfront Standard Rates',
      desc: 'Transparent Indian rate card. No hidden visit fees, no on-the-spot haggling.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: '30-Day Service Warranty',
      desc: 'Not satisfied? Complimentary technician re-visit with zero additional labor charges.',
    },
    {
      icon: <FileCheck className="w-6 h-6 text-blue-600" />,
      title: '₹10,000 Damage Cover',
      desc: 'Comprehensive work transit and appliance protection policy on every booked service.',
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-14 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>THE KAAMLY PRO PROMISE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Institutional trust for your home.
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Every booking is covered by strict quality audits, verified background checks, and automated digital invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-4 text-blue-400">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
