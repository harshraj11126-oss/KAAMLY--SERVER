import React from 'react';
import { 
  Zap, 
  Wrench, 
  Snowflake, 
  Sparkles, 
  Hammer, 
  Palette, 
  Cpu, 
  Briefcase, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  Star,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesGridProps {
  services: ServiceItem[];
  onBookService: (serviceName: string) => void;
  onResetSearch: () => void;
  onViewReviews?: (service: ServiceItem) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  onBookService,
  onResetSearch,
  onViewReviews,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 'Snowflake':
        return <Snowflake className="w-5 h-5 text-cyan-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-amber-800" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-purple-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-rose-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50/50 scroll-mt-20 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-extrabold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Standardized Trade Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Everyday Home Services
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md">
            Fixed standard rate cards with zero hidden travel charges. All jobs performed by background-cleared tradespeople.
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div id="servicesGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <article
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  {/* Top Bar: Icon & Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100/90 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(service.iconName)}
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {service.startingPrice}
                      </span>
                    </div>
                  </div>

                  {/* Title & Interactive Rating */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>

                    {/* Clickable Rating Badge */}
                    <button
                      type="button"
                      onClick={() => onViewReviews?.(service)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      title="View customer reviews"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{service.rating}</span>
                      <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
                    </button>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4 min-h-[36px]">
                    {service.description}
                  </p>

                  {/* Inclusions */}
                  <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-100">
                    {service.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {service.typicalDuration}
                      </span>
                      <span className="text-emerald-600 font-semibold">
                        30-Day Warranty
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Details & Book Now */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onViewReviews?.(service)}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookService(service.name)}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div id="noResults" className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xl">
              🔍
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              No matching service in our verified directory
            </h4>
            <p className="text-slate-500 text-xs mb-5 max-w-xs mx-auto">
              Please check your keyword or reset filters to browse all verified trade specialties.
            </p>
            <button
              onClick={onResetSearch}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & View All Services</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
