import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, MapPin, Calendar, Wrench, Clock } from 'lucide-react';
import { BookingRequest, User } from '../types';
import { SERVICES_DATA, TRUSTED_WORKERS } from '../data/servicesData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService: string;
  onBookingCreated: (booking: BookingRequest) => void;
  currentUser?: User | null;
  selectedCity?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultService,
  onBookingCreated,
  currentUser,
  selectedCity = 'Bengaluru',
}) => {
  const [serviceName, setServiceName] = useState(defaultService || 'Electrician');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerLocation, setCustomerLocation] = useState(
    currentUser?.locality ? `${currentUser.locality}, ${currentUser.city}` : currentUser?.city || ''
  );
  const [customerMessage, setCustomerMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('Today - Within 2 Hours');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);

  useEffect(() => {
    if (defaultService) {
      setServiceName(defaultService);
    }
  }, [defaultService]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerPhone) setCustomerPhone(currentUser.phone);
      if (!customerLocation) {
        setCustomerLocation(currentUser.locality ? `${currentUser.locality}, ${currentUser.city}` : currentUser.city || '');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentServiceData = SERVICES_DATA.find(
    (s) => s.name.toLowerCase() === serviceName.toLowerCase()
  );

  const handleClose = () => {
    setFormMessage(null);
    setSubmittedBooking(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerLocation.trim()) {
      setFormMessage({
        text: 'Please fill in all mandatory details.',
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);
    setFormMessage(null);

    // Pick an appropriate matching worker
    const matchedWorker =
      TRUSTED_WORKERS.find((w) => w.service.toLowerCase() === serviceName.toLowerCase()) ||
      TRUSTED_WORKERS[0];

    // Generate reference code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newBooking: BookingRequest = {
      id: `KML-${randomCode}`,
      serviceName,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerLocation: customerLocation.trim(),
      preferredTime,
      message: customerMessage.trim(),
      status: 'Confirmed',
      assignedWorker: matchedWorker,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onBookingCreated(newBooking);
      setSubmittedBooking(newBooking);
      setFormMessage({
        text: `Work order logged successfully for ${serviceName}!`,
        isError: false,
      });
    }, 500);
  };

  return (
    <div
      id="bookingModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="modal-close absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submittedBooking ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 id="modalTitle" className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Book {serviceName}
                </h2>
                <p className="text-xs text-slate-500">
                  Standard Rate Card • Service in {selectedCity}
                </p>
              </div>
            </div>

            {/* Standard Rate Pill & Warranty */}
            {currentServiceData && (
              <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Starting Standard Fare
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {currentServiceData.startingPrice}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    30-Day Warranty
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ₹10,000 damage cover included
                  </span>
                </div>
              </div>
            )}

            <form id="bookingForm" onSubmit={handleSubmit} className="space-y-3.5">
              {/* Service Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Selected Trade Service
                </label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.startingPrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                />
              </div>

              {/* Customer Phone & Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  >
                    <option value="Today - Within 2 Hours">Urgent: Within 2 Hours</option>
                    <option value="Today - Evening (4 PM - 7 PM)">Today Evening (4-7 PM)</option>
                    <option value="Tomorrow - Morning (9 AM - 12 PM)">Tomorrow Morning (9-12 PM)</option>
                    <option value="Tomorrow - Afternoon (1 PM - 4 PM)">Tomorrow Afternoon (1-4 PM)</option>
                    <option value="This Weekend">Weekend Convenient Slot</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Address / Flat No. <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="customerLocation"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    placeholder={`e.g. Flat 302, Palm Heights, Indiranagar, ${selectedCity}`}
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Message / Work Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Describe Work Scope <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </label>
                <textarea
                  id="customerMessage"
                  value={customerMessage}
                  onChange={(e) => setCustomerMessage(e.target.value)}
                  placeholder="e.g. Ceiling fan regulator not functioning and switch needs replacement..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl font-bold text-white bg-slate-900 hover:bg-blue-600 active:bg-blue-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <span>Dispatching Order...</span>
                ) : (
                  <span>Confirm Service Order</span>
                )}
              </button>
            </form>

            {/* Form Message Feedback */}
            {formMessage && (
              <p
                id="formMessage"
                className={`text-center mt-3 text-xs font-bold ${
                  formMessage.isError ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {formMessage.text}
              </p>
            )}
          </div>
        ) : (
          /* Confirmation State */
          <div className="py-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-2xs border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-full mb-3 border border-slate-200">
              Work Order Ref #{submittedBooking.id}
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">
              Service Order Confirmed!
            </h3>

            <p className="text-slate-600 text-xs mb-5 max-w-sm mx-auto">
              Your request for <strong className="text-slate-900">{submittedBooking.serviceName}</strong> has been confirmed. A verified specialist has been assigned for your chosen slot.
            </p>

            {/* Assigned Specialist Details */}
            {submittedBooking.assignedWorker && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left mb-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Assigned Verified Specialist
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      {submittedBooking.assignedWorker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {submittedBooking.assignedWorker.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        ⭐ {submittedBooking.assignedWorker.rating} Rating • {submittedBooking.assignedWorker.badge}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${submittedBooking.assignedWorker.phone}`}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Direct call"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-blue-600 transition-colors cursor-pointer text-xs"
              >
                View in My Requests
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
