import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  Users,
  ChevronRight,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { User, Job, JobApplication, Booking, WorkerProfile } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';

interface MyWorkScreenProps {
  currentUser: User | null;
  onSelectJob: (job: Job) => void;
  onOpenReview: (booking: Booking) => void;
  onStartChatWithUser: (user: { id: string; name: string; phone?: string }) => void;
  onNavigateToPostWork: () => void;
  onNavigateToSearch: () => void;
  onRequireAuth: () => void;
}

export const MyWorkScreen: React.FC<MyWorkScreenProps> = ({
  currentUser,
  onSelectJob,
  onOpenReview,
  onStartChatWithUser,
  onNavigateToPostWork,
  onNavigateToSearch,
  onRequireAuth
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Track Work</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Log in with your mobile number to view your posted jobs, applications, active bookings and customer ratings.
        </p>
        <button
          onClick={onRequireAuth}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const isWorker = currentUser.role === 'worker';
  const [activeTab, setActiveTab] = useState<string>(isWorker ? 'applications' : 'posted_jobs');

  // Customer Data
  const myPostedJobs = KaamlyStore.getJobs({ customerId: currentUser.id });
  const myCustomerBookings = KaamlyStore.getBookings({ customerId: currentUser.id });

  // Worker Data
  const myApplications = KaamlyStore.getApplications({ workerUserId: currentUser.id });
  const myWorkerBookings = KaamlyStore.getBookings({ workerUserId: currentUser.id });

  const handleCompleteBooking = (bookingId: string) => {
    KaamlyStore.updateBookingStatus(bookingId, 'completed');
    const booking = myCustomerBookings.find((b) => b.id === bookingId) || myWorkerBookings.find((b) => b.id === bookingId);
    if (booking) {
      onOpenReview(booking);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isWorker ? 'Worker Hub & Orders' : 'My Work & Bookings'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isWorker
              ? 'Track your proposals, active client bookings and earnings'
              : 'Manage your posted work requirements and hired service providers'}
          </p>
        </div>

        <div>
          {isWorker ? (
            <button
              onClick={onNavigateToSearch}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Open Jobs</span>
            </button>
          ) : (
            <button
              onClick={onNavigateToPostWork}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post New Work</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {isWorker ? (
          <>
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>My Applications ({myApplications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hired Bookings ({myWorkerBookings.length})</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('posted_jobs')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'posted_jobs'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Posted Jobs ({myPostedJobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customer_bookings')}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'customer_bookings'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Hired Workers ({myCustomerBookings.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Tab 1: Customer's Posted Jobs */}
      {!isWorker && activeTab === 'posted_jobs' && (
        <div className="space-y-4">
          {myPostedJobs.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No jobs posted yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Post what needs fixing or building in your home or shop. Local workers will submit proposals.
              </p>
              <button
                onClick={onNavigateToPostWork}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Post Your First Work Listing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myPostedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
                        {job.category}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          job.status === 'open'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base truncate">{job.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{job.description}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="font-bold text-white">Budget: ₹{job.budget}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        {job.applicationsCount || 0} Proposals
                      </span>
                      <span>•</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Proposals</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Customer's Active Bookings */}
      {!isWorker && activeTab === 'customer_bookings' && (
        <div className="space-y-4">
          {myCustomerBookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No active worker bookings</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When you accept a worker's proposal or hire directly, their booking details will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myCustomerBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 block mb-1">
                        {b.serviceCategory} Work
                      </span>
                      <h4 className="font-bold text-white text-base">{b.jobTitle}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Assigned Worker: <span className="text-white font-semibold">{b.workerName}</span> ({b.workerPhone})
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        b.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-blue-950/80 text-blue-400 border border-blue-800'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      <span>Agreed Rate: </span>
                      <span className="font-bold text-emerald-400 text-sm">₹{b.agreedRate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onStartChatWithUser({
                            id: b.workerUserId,
                            name: b.workerName,
                            phone: b.workerPhone
                          })
                        }
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        Chat
                      </button>

                      <a
                        href={`tel:${b.workerPhone}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Call
                      </a>

                      {b.status !== 'completed' ? (
                        <button
                          onClick={() => handleCompleteBooking(b.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Done & Review
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenReview(b)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Rate Worker
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Worker's Submitted Applications */}
      {isWorker && activeTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No job proposals submitted yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore local jobs posted in your city and submit quotes with your proposed rate.
              </p>
              <button
                onClick={onNavigateToSearch}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Browse Open Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 block mb-0.5">
                        {app.workerCategory}
                      </span>
                      <h4 className="font-bold text-white text-base">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Your Proposed Quote: <span className="font-bold text-emerald-400">₹{app.proposedRate}</span> ({app.rateType})
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'accepted'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-red-950/80 text-red-400 border border-red-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 italic">
                      "{app.coverNote}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                    <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>

                    {app.status === 'accepted' && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Proposal Accepted by Client!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Worker's Hired Bookings */}
      {isWorker && activeTab === 'bookings' && (
        <div className="space-y-4">
          {myWorkerBookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No active work orders yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once customers accept your quote, confirmed jobs and direct contact details appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myWorkerBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 block mb-0.5">
                        Client Order
                      </span>
                      <h4 className="font-bold text-white text-base">{b.jobTitle}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Customer: <span className="text-white font-semibold">{b.customerName}</span> ({b.customerPhone})
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        b.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-blue-950/80 text-blue-400 border border-blue-800'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      <span>Rate to Collect: </span>
                      <span className="font-bold text-emerald-400 text-sm">₹{b.agreedRate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onStartChatWithUser({
                            id: b.customerId,
                            name: b.customerName,
                            phone: b.customerPhone
                          })
                        }
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        Chat
                      </button>

                      <a
                        href={`tel:${b.customerPhone}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Call
                      </a>

                      {b.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteBooking(b.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Work Finished
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
