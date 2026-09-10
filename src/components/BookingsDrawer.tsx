import React from 'react';
import { X, CalendarCheck, MapPin, Clock, Phone, Trash2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BookingRequest } from '../types';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRequest[];
  onCancelBooking: (id: string) => void;
  onBookNewService: () => void;
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onBookNewService,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                My Service Requests
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {bookings.length} active service order{bookings.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 transition-all hover:border-slate-300 relative"
              >
                {/* Top status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    #{b.id}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {b.status}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 mb-1">
                  {b.serviceName}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{b.preferredTime}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{b.customerLocation}</span>
                  </div>
                  {b.message && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/70 mt-1">
                      "{b.message}"
                    </p>
                  )}
                </div>

                {/* Assigned Specialist */}
                {b.assignedWorker && (
                  <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between mb-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                        {b.assignedWorker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{b.assignedWorker.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{b.assignedWorker.badge}</span>
                          <span>•</span>
                          <span className="text-amber-600 font-bold">{b.assignedWorker.rating} ★</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${b.assignedWorker.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>Call</span>
                    </a>
                  </div>
                )}

                {/* Assurance notice */}
                <div className="text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>30-day rework warranty + ₹10k insurance active</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400">Created: {b.createdAt}</span>
                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel Request</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3 text-lg font-bold">
                ✓
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                No active service requests
              </h4>
              <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
                Need a verified electrician, plumber, or appliance technician? Submit a request and track it here in real-time.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNewService();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              onClose();
              onBookNewService();
            }}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer text-center"
          >
            + Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
};
