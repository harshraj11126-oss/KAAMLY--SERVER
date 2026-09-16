import React from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Clock,
  Award,
  Calendar,
  Flag
} from 'lucide-react';
import { WorkerProfile, User } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';

interface WorkerProfileModalProps {
  worker: WorkerProfile | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (worker: WorkerProfile) => void;
  onDirectHire: (worker: WorkerProfile) => void;
  onReport: (worker: WorkerProfile) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  currentUser,
  isOpen,
  onClose,
  onStartChat,
  onDirectHire,
  onReport
}) => {
  if (!isOpen || !worker) return null;

  const reviews = KaamlyStore.getReviews(worker.userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              {worker.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{worker.verifiedStatus === 'verified' ? 'Identity Verified' : 'Standard Profile'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Hero Card */}
          <div className="flex items-start gap-4">
            <img
              src={worker.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'}
              alt={worker.name}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-amber-500/30 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg truncate">{worker.name}</h3>
                {worker.verifiedStatus === 'verified' && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-amber-400 font-medium">{worker.category}</p>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {worker.rating.toFixed(1)}
                  <span className="text-slate-400 font-normal">({worker.reviewsCount})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  {worker.experienceYears}+ yrs exp
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{worker.locality || worker.city}, {worker.state}</span>
              </div>
            </div>
          </div>

          {/* Price & Availability Strip */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div>
              <span className="text-[11px] text-slate-400 block">Expected Pricing</span>
              <div className="text-base font-bold text-white mt-0.5">
                ₹{worker.dailyRate || worker.hourlyRate || 300}
                <span className="text-xs font-normal text-slate-400">
                  {worker.dailyRate ? ' / day' : ' / hour'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Current Status</span>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Available Now</span>
              </div>
            </div>
          </div>

          {/* Description / Bio */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              About & Experience
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              {worker.shortDescription}
            </p>
          </div>

          {/* Skills Badges */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Verified Skills & Tools
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Spoken Languages
            </h4>
            <p className="text-xs text-slate-300">
              {worker.languages && worker.languages.length > 0
                ? worker.languages.join(', ')
                : 'Hindi, English'}
            </p>
          </div>

          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Customer Reviews ({reviews.length})
              </h4>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-800/20 p-3 rounded-xl border border-slate-800">
                No individual customer reviews recorded yet. Worker holds a verified community baseline rating of {worker.rating.toFixed(1)}★.
              </p>
            ) : (
              <div className="space-y-2.5">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{r.fromUserName}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{r.rating}★</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">{r.comment}</p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Report link */}
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => onReport(worker)}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              Report suspicious profile
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 grid grid-cols-2 gap-3">
          <button
            onClick={() => onStartChat(worker)}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Chat Online</span>
          </button>

          <button
            onClick={() => onDirectHire(worker)}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-slate-950" />
            <span>Hire & Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
