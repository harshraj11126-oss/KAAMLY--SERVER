import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, MainTab } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { PostJobScreen } from './components/PostJobScreen';
import { MyWorkScreen } from './components/MyWorkScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ProfileScreen } from './components/ProfileScreen';

// Modals & Drawers
import { LocationPickerModal } from './components/LocationPickerModal';
import { AuthModal } from './components/AuthModal';
import { WorkerProfileModal } from './components/WorkerProfileModal';
import { JobDetailsModal } from './components/JobDetailsModal';
import { JobApplicationModal } from './components/JobApplicationModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportBlockModal } from './components/ReportBlockModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { StorePublishModal } from './components/StorePublishModal';
import { OfflineIndicator } from './components/OfflineIndicator';

// Data & Store
import { KaamlyStore } from './db/kaamlyStore';
import {
  User,
  UserLocation,
  WorkerProfile,
  Job,
  JobApplication,
  Booking,
  NotificationItem,
  UserRole
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  // Core Data State
  const [currentUser, setCurrentUser] = useState<User | null>(() => KaamlyStore.getCurrentUser());
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(() =>
    KaamlyStore.getActiveLocation()
  );
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => KaamlyStore.getWorkers());
  const [jobs, setJobs] = useState<Job[]>(() => KaamlyStore.getJobs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    currentUser ? KaamlyStore.getNotifications(currentUser.id) : []
  );

  // Search Screen filter state
  const [searchCategory, setSearchCategory] = useState<string>('All');

  // Active Chat partner
  const [activeChatPartner, setActiveChatPartner] = useState<{
    id: string;
    name: string;
    phone?: string;
  } | null>(null);

  // Modals visibility
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('customer');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reportTarget, setReportTarget] = useState<{
    user?: { id: string; name: string };
    job?: Job;
  } | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isStorePublishOpen, setIsStorePublishOpen] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Reload data
  const refreshData = useCallback(() => {
    setWorkers(KaamlyStore.getWorkers());
    setJobs(KaamlyStore.getJobs());
    if (currentUser) {
      setNotifications(KaamlyStore.getNotifications(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [currentUser, refreshData]);

  // Handle Location changes
  const handleSelectLocation = (newLoc: UserLocation) => {
    setCurrentLocation(newLoc);
    KaamlyStore.setActiveLocation(newLoc);
    showToast(`Location set to ${newLoc.city}, ${newLoc.district || newLoc.state}`);
  };

  // Handle Auth success
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.city && user.state) {
      const loc: UserLocation = {
        state: user.state,
        district: user.district,
        city: user.city,
        locality: user.locality || user.city,
        isGPS: false
      };
      setCurrentLocation(loc);
      KaamlyStore.setActiveLocation(loc);
    }
    refreshData();
    showToast(`Welcome to KAAMLY, ${user.name}!`);
  };

  const handleLogout = () => {
    KaamlyStore.logout();
    setCurrentUser(null);
    setNotifications([]);
    setActiveTab('home');
    showToast('Signed out successfully.');
  };

  // Category select from Home
  const handleSelectCategory = (catName: string) => {
    setSearchCategory(catName);
    setActiveTab('search');
  };

  // Start Chat with a worker or customer
  const handleStartChatWithWorker = (worker: WorkerProfile) => {
    if (!currentUser) {
      setAuthRole('customer');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedWorker(null);
    setActiveChatPartner({ id: worker.userId, name: worker.name, phone: worker.phone });
    setActiveTab('messages');
  };

  const handleStartChatWithUser = (user: { id: string; name: string; phone?: string }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveChatPartner(user);
    setActiveTab('messages');
  };

  // Direct Hire of Worker
  const handleDirectHireWorker = (worker: WorkerProfile) => {
    if (!currentUser) {
      setAuthRole('customer');
      setIsAuthModalOpen(true);
      return;
    }

    const rate = worker.dailyRate || worker.hourlyRate || 500;
    const reqTitle = `Direct Service Request for ${worker.category}`;
    const booking = KaamlyStore.createBooking({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      workerUserId: worker.userId,
      workerName: worker.name,
      workerPhone: worker.phone,
      serviceCategory: worker.category,
      title: reqTitle,
      jobTitle: reqTitle,
      agreedPrice: rate,
      agreedRate: rate,
      rateType: worker.dailyRate ? 'daily' : 'hourly',
      scheduledDate: 'Immediate'
    });

    setSelectedWorker(null);
    refreshData();
    showToast(`Direct work order placed with ${worker.name}! Opening phone dialer...`);

    // Initiate phone call
    window.location.href = `tel:${worker.phone}`;
  };

  // Job proposal submission
  const handleOpenApplyForJob = (job: Job) => {
    if (!currentUser) {
      setAuthRole('worker');
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.role !== 'worker') {
      showToast('Please switch to Worker mode in your Profile to submit job proposals.');
      return;
    }
    setSelectedJob(null);
    setApplyingJob(job);
  };

  const handleSubmitApplication = (appData: {
    jobId: string;
    jobTitle: string;
    proposedRate: number;
    rateType: 'fixed' | 'daily' | 'hourly';
    coverNote: string;
  }) => {
    if (!currentUser) return;
    const workerProfile = KaamlyStore.getWorkerById(currentUser.id);

    KaamlyStore.submitApplication({
      jobId: appData.jobId,
      jobTitle: appData.jobTitle,
      workerUserId: currentUser.id,
      workerName: currentUser.name,
      workerPhone: currentUser.phone,
      workerCategory: workerProfile?.category || 'General Worker',
      workerRating: workerProfile?.rating || 5.0,
      workerAvatar: currentUser.avatar,
      proposedRate: appData.proposedRate,
      rateType: appData.rateType,
      coverNote: appData.coverNote
    });

    setApplyingJob(null);
    refreshData();
    showToast('Job proposal submitted directly to customer!');
  };

  // Customer accepts applicant proposal
  const handleAcceptApplicant = (app: JobApplication) => {
    KaamlyStore.updateApplicationStatus(app.id, 'accepted');
    refreshData();
    showToast(`Accepted proposal from ${app.workerName}. Work order confirmed!`);
  };

  // Customer declines applicant proposal
  const handleRejectApplicant = (app: JobApplication) => {
    KaamlyStore.updateApplicationStatus(app.id, 'rejected');
    refreshData();
    showToast(`Proposal declined.`);
  };

  // Review submission
  const handleSubmitReview = (reviewData: {
    bookingId: string;
    jobId?: string;
    rating: number;
    comment: string;
    tags: string[];
    toUserId: string;
    toUserName: string;
    targetType: 'worker' | 'customer';
    serviceCategory: string;
  }) => {
    if (!currentUser) return;
    KaamlyStore.submitReview({
      bookingId: reviewData.bookingId,
      jobId: reviewData.jobId,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: reviewData.toUserId,
      toUserName: reviewData.toUserName,
      targetType: reviewData.targetType,
      rating: reviewData.rating,
      comment: reviewData.comment,
      tags: reviewData.tags,
      serviceCategory: reviewData.serviceCategory
    });

    setReviewBooking(null);
    refreshData();
    showToast(`Review published for ${reviewData.toUserName}. Thank you!`);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = currentUser
    ? KaamlyStore.getConversations(currentUser.id).reduce((acc, c) => acc + (c.unreadCount?.[currentUser.id] || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 antialiased flex flex-col">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 border border-amber-500/40 text-amber-300 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Mobile Bottom Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        currentLocation={currentLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenStorePublish={() => setIsStorePublishOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Tab Screen Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            currentUser={currentUser}
            currentLocation={currentLocation}
            workers={workers}
            jobs={jobs}
            onSelectCategory={handleSelectCategory}
            onSelectWorker={(worker) => setSelectedWorker(worker)}
            onSelectJob={(job) => setSelectedJob(job)}
            onPostWorkClick={() => setActiveTab('post_work')}
            onSearchClick={() => setActiveTab('search')}
            onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
          />
        )}

        {activeTab === 'search' && (
          <SearchScreen
            workers={workers}
            jobs={jobs}
            currentLocation={currentLocation}
            initialCategory={searchCategory}
            onSelectWorker={(worker) => setSelectedWorker(worker)}
            onSelectJob={(job) => setSelectedJob(job)}
          />
        )}

        {activeTab === 'post_work' && (
          <PostJobScreen
            currentUser={currentUser}
            currentLocation={currentLocation}
            onJobCreated={(newJob) => {
              refreshData();
              showToast(`Work requirement "${newJob.title}" posted successfully!`);
              setActiveTab('my_work');
            }}
            onRequireAuth={() => {
              setAuthRole('customer');
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'my_work' && (
          <MyWorkScreen
            currentUser={currentUser}
            onSelectJob={(job) => setSelectedJob(job)}
            onOpenReview={(booking) => setReviewBooking(booking)}
            onStartChatWithUser={handleStartChatWithUser}
            onNavigateToPostWork={() => setActiveTab('post_work')}
            onNavigateToSearch={() => setActiveTab('search')}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesScreen
            currentUser={currentUser}
            activeChatPartnerId={activeChatPartner?.id}
            activeChatPartnerName={activeChatPartner?.name}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              refreshData();
              showToast('Profile saved successfully.');
            }}
            onLogout={handleLogout}
            onRequireAuth={() => setIsAuthModalOpen(true)}
            onOpenStorePublish={() => setIsStorePublishOpen(true)}
            onOpenReport={() => setReportTarget({})}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Location Picker (All 28 States & 8 UTs) */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* 2. Real Phone Number OTP Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authRole}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 3. Worker Profile Modal */}
      <WorkerProfileModal
        worker={selectedWorker}
        currentUser={currentUser}
        isOpen={selectedWorker !== null}
        onClose={() => setSelectedWorker(null)}
        onStartChat={handleStartChatWithWorker}
        onDirectHire={handleDirectHireWorker}
        onReport={(w) => {
          setSelectedWorker(null);
          setReportTarget({ user: { id: w.userId, name: w.name } });
        }}
      />

      {/* 4. Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        currentUser={currentUser}
        isOpen={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
        onApply={handleOpenApplyForJob}
        onAcceptApplicant={handleAcceptApplicant}
        onRejectApplicant={handleRejectApplicant}
        onContactWorker={(app) => {
          setSelectedJob(null);
          handleStartChatWithUser({
            id: app.workerUserId,
            name: app.workerName,
            phone: app.workerPhone
          });
        }}
        onContactCustomer={(job) => {
          setSelectedJob(null);
          handleStartChatWithUser({
            id: job.customerId,
            name: job.customerName,
            phone: job.customerPhone
          });
        }}
      />

      {/* 5. Job Proposal / Application Modal */}
      <JobApplicationModal
        job={applyingJob}
        currentUser={currentUser}
        workerProfile={currentUser ? KaamlyStore.getWorkerById(currentUser.id) : null}
        isOpen={applyingJob !== null}
        onClose={() => setApplyingJob(null)}
        onSubmit={handleSubmitApplication}
      />

      {/* 6. Review & Rating Modal */}
      <ReviewModal
        booking={reviewBooking}
        currentUser={currentUser}
        isOpen={reviewBooking !== null}
        onClose={() => setReviewBooking(null)}
        onSubmitReview={handleSubmitReview}
      />

      {/* 7. Trust, Safety & Report/Block Modal */}
      <ReportBlockModal
        targetUser={reportTarget?.user}
        targetJob={reportTarget?.job}
        currentUser={currentUser}
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* 8. Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onRefresh={refreshData}
        onNotificationClick={(notif) => {
          setIsNotificationDrawerOpen(false);
          if (notif.type === 'job_application' || notif.type === 'application_accepted') {
            setActiveTab('my_work');
          } else if (notif.type === 'new_message') {
            setActiveTab('messages');
          }
        }}
      />

      {/* 9. Google Play Store & Apple App Store Publication Hub */}
      <StorePublishModal
        isOpen={isStorePublishOpen}
        onClose={() => setIsStorePublishOpen(false)}
      />

      {/* 10. Offline Resilience Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
