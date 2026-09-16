import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  IndianRupee,
  Briefcase,
  User as UserIcon,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Phone,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Job, User, JobApplication } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';

interface JobDetailsModalProps {
  job: Job | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  onAcceptApplicant: (app: JobApplication) => void;
  onRejectApplicant: (app: JobApplication) => void;
  onContactWorker: (app: JobApplication) => void;
  onContactCustomer: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  currentUser,
  isOpen,
  onClose,
  onApply,
  onAcceptApplicant,
  onRejectApplicant,
  onContactWorker,
  onContactCustomer
}) => {
  if (!isOpen || !job) return null;

  const isCustomerOwner = currentUser?.id === job.customerId;
  const isWorker = currentUser?.role === 'worker';

  // Applications for this job
  const applications = KaamlyStore.getApplications({ jobId: job.id });

  // Has current worker already applied?
  const alreadyApplied = isWorker
    ? applications.some((a) => a.workerUserId === currentUser?.id)
    : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              {job.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                job.status === 'open'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : job.status === 'assigned'
                  ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {job.status === 'open'
                ? 'Open for Applications'
                : job.status === 'assigned'
                ? 'Worker Assigned'
                : job.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">{job.title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{job.locality}, {job.city}, {job.state}</span>
            </div>
          </div>

          {/* Job Overview Stats */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Budget Offered</span>
              <div className="text-base font-bold text-white flex items-center">
                <span>₹{job.budget}</span>
                <span className="text-xs font-normal text-slate-400 ml-1">
                  ({job.budgetType === 'fixed' ? 'Fixed Work' : job.budgetType === 'daily' ? 'Per Day' : 'Per Hour'})
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Preferred Timing</span>
              <div className="text-sm font-semibold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">{job.preferredDate}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Work Description
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customer / Employer info */}
          <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                {job.customerName?.charAt(0) || 'C'}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{job.customerName}</span>
                <span className="text-[11px] text-slate-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {!isCustomerOwner && (
              <button
                onClick={() => onContactCustomer(job)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact</span>
              </button>
            )}
          </div>

          {/* If customer owns job: List of Received Applications */}
          {isCustomerOwner && (
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Received Applications ({applications.length})
                </h4>
                <span className="text-[11px] text-slate-400">Direct proposals from workers</span>
              </div>

              {applications.length === 0 ? (
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 text-center">
                  <Clock className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400">No proposals received yet.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Local {job.category}s in {job.city} are being shown this posting.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        app.status === 'accepted'
                          ? 'bg-emerald-950/30 border-emerald-700/60'
                          : app.status === 'rejected'
                          ? 'bg-slate-900/50 border-slate-800 opacity-60'
                          : 'bg-slate-800/50 border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.workerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80'}
                            alt={app.workerName}
                            className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{app.workerName}</div>
                            <div className="text-[11px] text-amber-400 font-medium">
                              ★ {app.workerRating.toFixed(1)} • {app.workerCategory}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-white">₹{app.proposedRate}</div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                              app.status === 'accepted'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : app.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {app.coverNote && (
                        <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 italic">
                          "{app.coverNote}"
                        </p>
                      )}

                      {/* Customer action on application */}
                      {app.status === 'pending' && job.status === 'open' && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-end gap-2">
                          <button
                            onClick={() => onContactWorker(app)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Chat
                          </button>

                          <button
                            onClick={() => onRejectApplicant(app)}
                            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Decline
                          </button>

                          <button
                            onClick={() => onAcceptApplicant(app)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Accept & Hire
                          </button>
                        </div>
                      )}

                      {app.status === 'accepted' && (
                        <div className="mt-2.5 p-2 bg-emerald-950/60 rounded-lg border border-emerald-800 text-[11px] text-emerald-300 flex items-center justify-between">
                          <span className="flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Worker Hired. Work order confirmed!
                          </span>
                          <a
                            href={`tel:${app.workerPhone}`}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call Worker
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer for Worker */}
        {!isCustomerOwner && isWorker && job.status === 'open' && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/90">
            {alreadyApplied ? (
              <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You have already submitted a proposal for this job.</span>
              </div>
            ) : (
              <button
                onClick={() => onApply(job)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Apply for This Job Now</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
