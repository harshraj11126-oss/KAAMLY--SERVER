import React, { useState } from 'react';
import { X, Send, IndianRupee, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Job, User, WorkerProfile } from '../types';

interface JobApplicationModalProps {
  job: Job | null;
  currentUser: User | null;
  workerProfile: WorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: {
    jobId: string;
    jobTitle: string;
    proposedRate: number;
    rateType: 'fixed' | 'daily' | 'hourly';
    coverNote: string;
  }) => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  currentUser,
  workerProfile,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [proposedRate, setProposedRate] = useState<number>(job ? job.budget : 500);
  const [rateType, setRateType] = useState<'fixed' | 'daily' | 'hourly'>(job?.budgetType || 'fixed');
  const [coverNote, setCoverNote] = useState<string>(
    'I have extensive experience in this work. I carry all required professional tools and can arrive punctually.'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedRate || proposedRate <= 0) {
      setError('Please enter a valid proposed rate in ₹.');
      return;
    }
    if (!coverNote.trim()) {
      setError('Please write a short note for the customer.');
      return;
    }

    onSubmit({
      jobId: job.id,
      jobTitle: job.title,
      proposedRate: Number(proposedRate),
      rateType,
      coverNote: coverNote.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <h3 className="font-bold text-white text-base">Submit Job Proposal</h3>
            <p className="text-xs text-slate-400 truncate max-w-xs">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Job budget guideline */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-400">Customer Budget:</span>
            <span className="font-bold text-amber-400">
              ₹{job.budget} ({job.budgetType === 'fixed' ? 'Fixed Total' : job.budgetType === 'daily' ? 'Per Day' : 'Per Hour'})
            </span>
          </div>

          {/* Proposed Rate */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Proposed Rate (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={proposedRate}
                onChange={(e) => setProposedRate(Number(e.target.value))}
                min={50}
                step={50}
                required
                className="w-full pl-8 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-base font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Rate Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Rate Basis
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['fixed', 'daily', 'hourly'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRateType(type)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all capitalize ${
                    rateType === type
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {type === 'fixed' ? 'Fixed Total' : type === 'daily' ? 'Per Day' : 'Per Hour'}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Message to Customer *
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={4}
              placeholder="Tell the customer about your relevant experience, tools you bring, and when you can start..."
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 placeholder-slate-500 leading-relaxed"
            />
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-2 text-[11px] text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Direct deal. KAAMLY charges 0% commission from your earnings.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>Send Proposal to Customer</span>
          </button>
        </form>
      </div>
    </div>
  );
};
