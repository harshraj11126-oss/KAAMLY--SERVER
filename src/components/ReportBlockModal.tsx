import React, { useState } from 'react';
import { X, Flag, ShieldAlert, Ban, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, WorkerProfile, Job } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';

interface ReportBlockModalProps {
  targetUser?: { id: string; name: string } | null;
  targetJob?: Job | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const REPORT_REASONS = [
  'Fraud, scam or asking for advance money',
  'Abusive, threatening or inappropriate language',
  'No show or abandoning work after agreement',
  'Fake work description or misleading pricing',
  'Spam or multiple duplicate listings',
  'Other safety concern'
];

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  targetUser,
  targetJob,
  currentUser,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [actionType, setActionType] = useState<'report' | 'block'>('report');
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetName = targetUser?.name || targetJob?.customerName || 'User / Listing';
  const targetId = targetUser?.id || targetJob?.customerId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please login to report or block.');
      return;
    }

    if (actionType === 'report') {
      if (!details.trim()) {
        setError('Please describe what happened in detail.');
        return;
      }

      KaamlyStore.reportItem({
        reporterId: currentUser.id,
        reportedUserId: targetId,
        reportedJobId: targetJob?.id,
        reason,
        details: details.trim()
      });

      onSuccess(`Report against "${targetName}" submitted to KAAMLY Trust & Safety. Thank you.`);
    } else {
      if (targetId) {
        KaamlyStore.blockUser(currentUser.id, targetId);
        onSuccess(`"${targetName}" has been blocked. They cannot message you or see your listings.`);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white text-base">Trust & Safety</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActionType('report')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              actionType === 'report'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            Report Issue
          </button>
          <button
            type="button"
            onClick={() => setActionType('block')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              actionType === 'block'
                ? 'border-red-400 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            Block User
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

          {actionType === 'report' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reason for Reporting
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-400"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Explain What Happened *
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder="Please provide specific details to help our safety moderation team investigate..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-red-400 placeholder-slate-500 leading-relaxed"
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                Reports are treated with strict confidentiality. Our team investigates fraudulent behavior, fake reviews, and harassment to maintain a safe local community.
              </p>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Submit Confidential Report</span>
              </button>
            </>
          ) : (
            <>
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl space-y-2 text-xs text-slate-300">
                <p className="font-semibold text-red-400">
                  Are you sure you want to block {targetName}?
                </p>
                <p>
                  Blocking will immediately:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>Prevent them from sending you messages or calls in KAAMLY</li>
                  <li>Hide your posted jobs and contact details from their feed</li>
                  <li>Cancel any pending job proposals between you</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                <span>Confirm & Block {targetName}</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
