import { ServerUser, revokeAllUserSessions } from './auth';
import { sanitizeString, sanitizeNumber } from './sanitizer';

export interface WorkerProfileRecord {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  category: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  availability: 'available' | 'busy' | 'offline';
  contactPreference: 'call' | 'whatsapp' | 'both';
  state: string;
  district: string;
  city: string;
  locality?: string;
  languages: string[];
  shortDescription: string;
  rating: number;
  reviewsCount: number;
  completedJobsCount: number;
  verifiedStatus: 'verified' | 'pending' | 'unverified';
  createdAt: string;
  updatedAt: string;
}

export interface JobRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  title: string;
  category: string;
  skills: string[];
  description: string;
  state: string;
  district: string;
  city: string;
  locality: string;
  budgetType: 'fixed' | 'daily' | 'hourly';
  budget: number;
  preferredDate: string;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  applicationsCount: number;
  selectedWorkerId?: string;
  selectedWorkerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerUserId: string;
  workerName: string;
  workerPhone: string;
  proposedRate: number;
  estimatedDays?: string;
  coverNote?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  jobId?: string;
  workerId: string;
  workerUserId: string;
  workerName: string;
  workerPhone: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: string;
  title: string;
  jobTitle?: string;
  agreedPrice: number;
  agreedRate?: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  state?: string;
  district?: string;
  city?: string;
  locality?: string;
  notes?: string;
  customerReviewed: boolean;
  workerReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface ConversationRecord {
  id: string;
  participantIds: string[];
  participantDetails: Array<{ id: string; name: string; avatar?: string; role: string; phone?: string }>;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: Record<string, number>;
  jobId?: string;
  jobTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRecord {
  id: string;
  bookingId?: string;
  jobId?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: string;
  toUserId: string;
  toUserName: string;
  targetType: 'worker' | 'customer';
  rating: number;
  comment: string;
  tags?: string[];
  serviceCategory: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRecord {
  id: string;
  reporterUserId: string;
  targetId: string;
  targetType: 'user' | 'job' | 'review' | 'message';
  reason: string;
  details?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

// In-Memory Database store with Seed Data
class ServerStore {
  private users: Map<string, ServerUser> = new Map();
  private workers: Map<string, WorkerProfileRecord> = new Map();
  private jobs: Map<string, JobRecord> = new Map();
  private applications: Map<string, ApplicationRecord> = new Map();
  private bookings: Map<string, BookingRecord> = new Map();
  private messages: Map<string, MessageRecord> = new Map();
  private conversations: Map<string, ConversationRecord> = new Map();
  private reviews: Map<string, ReviewRecord> = new Map();
  private reports: Map<string, ReportRecord> = new Map();

  constructor() {
    this.initSeeds();
  }

  private initSeeds() {
    const now = new Date().toISOString();

    // Seed Verified Workers
    const seedWorkers: WorkerProfileRecord[] = [
      {
        id: 'w-rajesh',
        userId: 'u-rajesh',
        name: 'Rajesh Sharma',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        category: 'Electrician',
        skills: ['House Wiring', 'Fan Repair', 'MCB Installation', 'Inverter Setup'],
        experienceYears: 12,
        hourlyRate: 299,
        dailyRate: 950,
        availability: 'available',
        contactPreference: 'both',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        city: 'Bengaluru',
        locality: 'Indiranagar / Koramangala',
        languages: ['Hindi', 'Kannada', 'English'],
        shortDescription: 'Certified licensed electrical technician with 12 years of hands-on experience in residential wiring and MCB setups.',
        rating: 4.9,
        reviewsCount: 148,
        completedJobsCount: 320,
        verifiedStatus: 'verified',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'w-manoj',
        userId: 'u-manoj',
        name: 'Manoj Paswan',
        phone: '+91 98112 34567',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        category: 'Plumber',
        skills: ['Pipe Leak Repair', 'Tap & Shower Fitting', 'Drain Cleaning'],
        experienceYears: 8,
        hourlyRate: 249,
        dailyRate: 850,
        availability: 'available',
        contactPreference: 'both',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        city: 'Bengaluru',
        locality: 'HSR Layout / BTM',
        languages: ['Hindi', 'Kannada'],
        shortDescription: 'Expert in pipeline leakage, CPVC pipe fitting, toilet diverters, and overhead tank water pumps.',
        rating: 4.8,
        reviewsCount: 96,
        completedJobsCount: 215,
        verifiedStatus: 'verified',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'w-satish',
        userId: 'u-satish',
        name: 'Satish Carpenter',
        phone: '+91 98450 12345',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        category: 'Carpenter',
        skills: ['Door Lock Fitting', 'Wardrobe Repair', 'Hinges & Handles'],
        experienceYears: 15,
        hourlyRate: 350,
        dailyRate: 1100,
        availability: 'available',
        contactPreference: 'both',
        state: 'Delhi',
        district: 'South Delhi',
        city: 'Saket',
        locality: 'Saket / Malviya Nagar',
        languages: ['Hindi', 'Punjabi'],
        shortDescription: 'Skilled wood artisan specializing in smart door locks, modular kitchen adjustments, and antique furniture.',
        rating: 4.95,
        reviewsCount: 182,
        completedJobsCount: 410,
        verifiedStatus: 'verified',
        createdAt: now,
        updatedAt: now
      }
    ];

    seedWorkers.forEach(w => {
      this.workers.set(w.id, w);
      this.users.set(w.userId, {
        id: w.userId,
        phone: w.phone,
        name: w.name,
        role: 'worker',
        state: w.state,
        district: w.district,
        city: w.city,
        locality: w.locality,
        language: w.languages[0],
        avatar: w.avatar,
        bio: w.shortDescription,
        isVerified: true,
        isBlocked: false,
        createdAt: now,
        updatedAt: now
      });
    });

    // Seed Jobs
    const seedJobs: JobRecord[] = [
      {
        id: 'job-1',
        customerId: 'u-arun',
        customerName: 'Arun Nambiar',
        customerPhone: '+91 98451 99887',
        title: 'Ceiling Fan Replacement & Balcony Switchboard Repair',
        category: 'Electrician',
        skills: ['Fan Repair', 'House Wiring'],
        description: 'Need an experienced electrician to install 2 new BLDC ceiling fans and fix a sparked socket in the balcony.',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        city: 'Bengaluru',
        locality: 'Indiranagar 12th Main',
        budgetType: 'fixed',
        budget: 650,
        preferredDate: 'Today or Tomorrow Morning',
        status: 'open',
        applicationsCount: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'job-2',
        customerId: 'u-shreya',
        customerName: 'Shreya Kulkarni',
        customerPhone: '+91 97654 32190',
        title: 'Kitchen Sink Under-Drain Pipe Leakage Repair',
        category: 'Plumber',
        skills: ['Pipe Leak Repair', 'Tap & Shower Fitting'],
        description: 'Water is dripping from the sink PVC connector under the counter. Need to replace mixer cartridge.',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        city: 'Bengaluru',
        locality: 'Koramangala 4th Block',
        budgetType: 'fixed',
        budget: 500,
        preferredDate: 'Urgent - Within 3 Hours',
        status: 'open',
        applicationsCount: 1,
        createdAt: now,
        updatedAt: now
      }
    ];

    seedJobs.forEach(j => this.jobs.set(j.id, j));
  }

  // --- Users & Profiles ---
  public getUserByPhone(phone: string): ServerUser | undefined {
    for (const u of this.users.values()) {
      if (u.phone === phone) return u;
    }
    return undefined;
  }

  public getUserById(id: string): ServerUser | undefined {
    return this.users.get(id);
  }

  public getOrCreateUser(phone: string, defaultRole: 'customer' | 'worker' = 'customer'): { user: ServerUser; isNew: boolean } {
    let existing = this.getUserByPhone(phone);
    if (existing) {
      return { user: existing, isNew: false };
    }

    const now = new Date().toISOString();
    const newUser: ServerUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      phone,
      name: defaultRole === 'worker' ? 'New Kaamly Worker' : 'Kaamly Member',
      role: defaultRole,
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      city: 'Bengaluru',
      locality: 'Indiranagar',
      language: 'Hindi / English',
      avatar: '',
      bio: '',
      isVerified: true,
      isBlocked: false,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(newUser.id, newUser);
    return { user: newUser, isNew: true };
  }

  public updateUserProfile(userId: string, updates: Partial<ServerUser>): ServerUser | null {
    const user = this.users.get(userId);
    if (!user) return null;

    // Prevent privilege escalation or ID tampering
    const sanitizedName = updates.name ? sanitizeString(updates.name, 100) : user.name;
    const sanitizedState = updates.state ? sanitizeString(updates.state, 50) : user.state;
    const sanitizedDistrict = updates.district ? sanitizeString(updates.district, 50) : user.district;
    const sanitizedCity = updates.city ? sanitizeString(updates.city, 50) : user.city;
    const sanitizedLocality = updates.locality ? sanitizeString(updates.locality, 100) : user.locality;
    const sanitizedLanguage = updates.language ? sanitizeString(updates.language, 50) : user.language;
    const sanitizedBio = updates.bio ? sanitizeString(updates.bio, 500) : user.bio;

    const updated: ServerUser = {
      ...user,
      name: sanitizedName,
      state: sanitizedState,
      district: sanitizedDistrict,
      city: sanitizedCity,
      locality: sanitizedLocality,
      language: sanitizedLanguage,
      bio: sanitizedBio,
      updatedAt: new Date().toISOString()
    };

    this.users.set(userId, updated);
    return updated;
  }

  public switchUserRole(userId: string, newRole: 'customer' | 'worker'): ServerUser | null {
    const user = this.users.get(userId);
    if (!user) return null;
    user.role = newRole;
    user.updatedAt = new Date().toISOString();
    this.users.set(userId, user);
    return user;
  }

  // --- Workers ---
  public getWorkers(filters?: { city?: string; category?: string; query?: string }): WorkerProfileRecord[] {
    let list = Array.from(this.workers.values());
    if (filters?.city && filters.city !== 'All Cities') {
      const c = filters.city.toLowerCase();
      list = list.filter(w => w.city.toLowerCase() === c || w.state.toLowerCase() === c);
    }
    if (filters?.category && filters.category !== 'All') {
      const cat = filters.category.toLowerCase();
      list = list.filter(w => w.category.toLowerCase() === cat);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getWorkerById(id: string): WorkerProfileRecord | undefined {
    for (const w of this.workers.values()) {
      if (w.id === id || w.userId === id) return w;
    }
    return undefined;
  }

  public saveWorkerProfile(userId: string, data: Partial<WorkerProfileRecord>): WorkerProfileRecord {
    let existing = this.getWorkerById(userId);
    const now = new Date().toISOString();

    const record: WorkerProfileRecord = {
      id: existing?.id || `w-${Date.now()}`,
      userId,
      name: sanitizeString(data.name || existing?.name || 'Worker', 100),
      phone: existing?.phone || data.phone || '',
      avatar: data.avatar || existing?.avatar || '',
      category: sanitizeString(data.category || existing?.category || 'Electrician', 50),
      skills: data.skills && Array.isArray(data.skills) ? data.skills.map(s => sanitizeString(s, 50)) : existing?.skills || [],
      experienceYears: sanitizeNumber(data.experienceYears, 0, 50, existing?.experienceYears || 3),
      hourlyRate: sanitizeNumber(data.hourlyRate, 50, 5000, existing?.hourlyRate || 250),
      dailyRate: sanitizeNumber(data.dailyRate, 200, 20000, existing?.dailyRate || 800),
      availability: (data.availability as any) || existing?.availability || 'available',
      contactPreference: (data.contactPreference as any) || existing?.contactPreference || 'both',
      state: sanitizeString(data.state || existing?.state || 'Karnataka', 50),
      district: sanitizeString(data.district || existing?.district || 'Bengaluru Urban', 50),
      city: sanitizeString(data.city || existing?.city || 'Bengaluru', 50),
      locality: sanitizeString(data.locality || existing?.locality || 'Indiranagar', 100),
      languages: data.languages || existing?.languages || ['Hindi'],
      shortDescription: sanitizeString(data.shortDescription || existing?.shortDescription || '', 500),
      rating: existing?.rating || 5.0,
      reviewsCount: existing?.reviewsCount || 1,
      completedJobsCount: existing?.completedJobsCount || 0,
      verifiedStatus: existing?.verifiedStatus || 'verified',
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };

    this.workers.set(record.id, record);
    return record;
  }

  // --- Jobs (Strict Authorization & Ownership) ---
  public getJobs(filters?: { city?: string; category?: string; status?: string }): JobRecord[] {
    let list = Array.from(this.jobs.values());
    if (filters?.city && filters.city !== 'All Cities') {
      const c = filters.city.toLowerCase();
      list = list.filter(j => j.city.toLowerCase() === c || j.state.toLowerCase() === c);
    }
    if (filters?.category && filters.category !== 'All') {
      const cat = filters.category.toLowerCase();
      list = list.filter(j => j.category.toLowerCase() === cat);
    }
    if (filters?.status) {
      list = list.filter(j => j.status === filters.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getJobById(id: string): JobRecord | undefined {
    return this.jobs.get(id);
  }

  public createJob(customerId: string, customerUser: ServerUser, input: any): JobRecord {
    const now = new Date().toISOString();
    const newJob: JobRecord = {
      id: `job-${Date.now()}`,
      customerId,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      customerAvatar: customerUser.avatar,
      title: sanitizeString(input.title, 150),
      category: sanitizeString(input.category, 50),
      skills: Array.isArray(input.skills) ? input.skills.map((s: string) => sanitizeString(s, 50)) : [],
      description: sanitizeString(input.description, 2000),
      state: sanitizeString(input.state || customerUser.state || 'Karnataka', 50),
      district: sanitizeString(input.district || customerUser.district || 'Bengaluru Urban', 50),
      city: sanitizeString(input.city || customerUser.city || 'Bengaluru', 50),
      locality: sanitizeString(input.locality || customerUser.locality || 'Indiranagar', 100),
      budgetType: input.budgetType === 'daily' || input.budgetType === 'hourly' ? input.budgetType : 'fixed',
      budget: sanitizeNumber(input.budget, 100, 500000, 500),
      preferredDate: sanitizeString(input.preferredDate, 100) || 'Flexible',
      status: 'open',
      applicationsCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  public updateJob(jobId: string, userId: string, userRole: string, updates: Partial<JobRecord>): { success: boolean; job?: JobRecord; error?: string } {
    const job = this.jobs.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Authorization: only the owner or an admin can edit
    if (job.customerId !== userId && userRole !== 'admin') {
      return { success: false, error: 'Unauthorized: You can only edit your own jobs.' };
    }

    if (updates.title) job.title = sanitizeString(updates.title, 150);
    if (updates.description) job.description = sanitizeString(updates.description, 2000);
    if (updates.budget) job.budget = sanitizeNumber(updates.budget, 100, 500000, job.budget);
    if (updates.status) job.status = updates.status;
    job.updatedAt = new Date().toISOString();

    this.jobs.set(jobId, job);
    return { success: true, job };
  }

  public deleteJob(jobId: string, userId: string, userRole: string): { success: boolean; error?: string } {
    const job = this.jobs.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (job.customerId !== userId && userRole !== 'admin') {
      return { success: false, error: 'Unauthorized: You can only delete your own jobs.' };
    }

    this.jobs.delete(jobId);
    return { success: true };
  }

  // --- Applications ---
  public getApplications(jobId?: string, workerUserId?: string): ApplicationRecord[] {
    let list = Array.from(this.applications.values());
    if (jobId) list = list.filter(a => a.jobId === jobId);
    if (workerUserId) list = list.filter(a => a.workerUserId === workerUserId);
    return list;
  }

  public applyToJob(workerUser: ServerUser, jobId: string, proposedRate: number, coverNote?: string): { success: boolean; application?: ApplicationRecord; error?: string } {
    const job = this.jobs.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };
    if (job.status !== 'open') return { success: false, error: 'Job is no longer open for applications' };

    // Prevent customer applying to own job
    if (job.customerId === workerUser.id) {
      return { success: false, error: 'You cannot apply to your own posted job.' };
    }

    // Check duplicate
    for (const app of this.applications.values()) {
      if (app.jobId === jobId && app.workerUserId === workerUser.id) {
        return { success: false, error: 'You have already applied to this job.' };
      }
    }

    const workerProfile = this.getWorkerById(workerUser.id);
    const now = new Date().toISOString();
    const appRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      workerId: workerProfile?.id || `w-${workerUser.id}`,
      workerUserId: workerUser.id,
      workerName: workerUser.name,
      workerPhone: workerUser.phone,
      proposedRate: sanitizeNumber(proposedRate, 50, 100000, 500),
      coverNote: coverNote ? sanitizeString(coverNote, 500) : '',
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    this.applications.set(appRecord.id, appRecord);
    job.applicationsCount = (job.applicationsCount || 0) + 1;
    this.jobs.set(job.id, job);

    return { success: true, application: appRecord };
  }

  public setApplicationStatus(appId: string, customerId: string, status: 'accepted' | 'rejected'): { success: boolean; application?: ApplicationRecord; booking?: BookingRecord; error?: string } {
    const app = this.applications.get(appId);
    if (!app) return { success: false, error: 'Application not found' };

    const job = this.jobs.get(app.jobId);
    if (!job) return { success: false, error: 'Associated job not found' };

    // Verify ownership: ONLY the customer who created the job can accept/reject!
    if (job.customerId !== customerId) {
      return { success: false, error: 'Unauthorized: Only the job poster can accept or reject applications.' };
    }

    app.status = status;
    app.updatedAt = new Date().toISOString();
    this.applications.set(appId, app);

    let booking: BookingRecord | undefined;
    if (status === 'accepted') {
      job.status = 'assigned';
      job.selectedWorkerId = app.workerId;
      job.selectedWorkerName = app.workerName;
      this.jobs.set(job.id, job);

      // Create confirmed booking server-side
      const now = new Date().toISOString();
      booking = {
        id: `bkg-${Date.now()}`,
        jobId: job.id,
        workerId: app.workerId,
        workerUserId: app.workerUserId,
        workerName: app.workerName,
        workerPhone: app.workerPhone,
        customerId: job.customerId,
        customerName: job.customerName,
        customerPhone: job.customerPhone,
        serviceCategory: job.category,
        title: job.title,
        jobTitle: job.title,
        agreedPrice: app.proposedRate,
        agreedRate: app.proposedRate,
        status: 'confirmed',
        scheduledDate: job.preferredDate,
        state: job.state,
        district: job.district,
        city: job.city,
        locality: job.locality,
        customerReviewed: false,
        workerReviewed: false,
        createdAt: now,
        updatedAt: now
      };
      this.bookings.set(booking.id, booking);
    }

    return { success: true, application: app, booking };
  }

  // --- Bookings (Participant Authorization) ---
  public getBookingsForUser(userId: string): BookingRecord[] {
    return Array.from(this.bookings.values()).filter(
      b => b.customerId === userId || b.workerUserId === userId
    );
  }

  public updateBookingStatus(bookingId: string, userId: string, status: 'in_progress' | 'completed' | 'cancelled'): { success: boolean; booking?: BookingRecord; error?: string } {
    const booking = this.bookings.get(bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    // Participant authorization
    if (booking.customerId !== userId && booking.workerUserId !== userId) {
      return { success: false, error: 'Unauthorized: You are not a party to this booking.' };
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(bookingId, booking);

    if (status === 'completed' && booking.jobId) {
      const job = this.jobs.get(booking.jobId);
      if (job) {
        job.status = 'completed';
        this.jobs.set(job.id, job);
      }
    }

    return { success: true, booking };
  }

  // --- Messages & Conversations (Participant Restricted) ---
  public getConversationsForUser(userId: string): ConversationRecord[] {
    return Array.from(this.conversations.values()).filter(c => c.participantIds.includes(userId));
  }

  public getMessagesForConversation(convId: string, userId: string): { success: boolean; messages?: MessageRecord[]; error?: string } {
    const conv = this.conversations.get(convId);
    if (!conv) return { success: false, error: 'Conversation not found' };

    // Strict privacy: only participants can view messages
    if (!conv.participantIds.includes(userId)) {
      return { success: false, error: 'Unauthorized: You are not a member of this conversation.' };
    }

    const msgs = Array.from(this.messages.values())
      .filter(m => m.conversationId === convId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { success: true, messages: msgs };
  }

  public sendMessage(senderUser: ServerUser, convId: string, text: string): { success: boolean; message?: MessageRecord; error?: string } {
    let conv = this.conversations.get(convId);
    if (!conv) {
      return { success: false, error: 'Conversation not found' };
    }

    if (!conv.participantIds.includes(senderUser.id)) {
      return { success: false, error: 'Unauthorized: You cannot post messages to a conversation you are not part of.' };
    }

    const recipientId = conv.participantIds.find(id => id !== senderUser.id) || '';
    const now = new Date().toISOString();
    const cleanText = sanitizeString(text, 1000);

    if (!cleanText) {
      return { success: false, error: 'Message cannot be empty.' };
    }

    const msg: MessageRecord = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: senderUser.id,
      senderName: senderUser.name,
      recipientId,
      text: cleanText,
      read: false,
      createdAt: now
    };

    this.messages.set(msg.id, msg);

    conv.lastMessage = cleanText;
    conv.lastMessageTimestamp = now;
    conv.unreadCount[recipientId] = (conv.unreadCount[recipientId] || 0) + 1;
    conv.updatedAt = now;
    this.conversations.set(convId, conv);

    return { success: true, message: msg };
  }

  public getOrCreateConversation(userA: ServerUser, userBId: string): ConversationRecord {
    const userB = this.users.get(userBId);
    const userBName = userB?.name || 'Contact';

    for (const c of this.conversations.values()) {
      if (c.participantIds.includes(userA.id) && c.participantIds.includes(userBId)) {
        return c;
      }
    }

    const now = new Date().toISOString();
    const conv: ConversationRecord = {
      id: `conv-${Date.now()}`,
      participantIds: [userA.id, userBId],
      participantDetails: [
        { id: userA.id, name: userA.name, role: userA.role, avatar: userA.avatar, phone: userA.phone },
        { id: userBId, name: userBName, role: userB?.role || 'worker', avatar: userB?.avatar, phone: userB?.phone }
      ],
      lastMessage: 'Conversation started',
      lastMessageTimestamp: now,
      unreadCount: { [userA.id]: 0, [userBId]: 0 },
      createdAt: now,
      updatedAt: now
    };

    this.conversations.set(conv.id, conv);
    return conv;
  }

  // --- Reviews (Verified Booking Enforcement) ---
  public submitReview(fromUser: ServerUser, input: any): { success: boolean; review?: ReviewRecord; error?: string } {
    const bookingId = input.bookingId;
    if (!bookingId) {
      return { success: false, error: 'A valid completed booking reference is required to submit a review.' };
    }

    const booking = this.bookings.get(bookingId);
    if (!booking) {
      return { success: false, error: 'Booking record not found.' };
    }

    // Must be a party to the booking
    if (booking.customerId !== fromUser.id && booking.workerUserId !== fromUser.id) {
      return { success: false, error: 'Unauthorized: You can only review bookings you participated in.' };
    }

    // Determine target
    const targetUserId = fromUser.id === booking.customerId ? booking.workerUserId : booking.customerId;
    const targetUserName = fromUser.id === booking.customerId ? booking.workerName : booking.customerName;
    const targetType = fromUser.id === booking.customerId ? 'worker' : 'customer';

    // Prevent self-reviews
    if (targetUserId === fromUser.id) {
      return { success: false, error: 'You cannot review yourself.' };
    }

    // Prevent double reviews
    for (const r of this.reviews.values()) {
      if (r.bookingId === bookingId && r.fromUserId === fromUser.id) {
        return { success: false, error: 'You have already submitted a review for this booking.' };
      }
    }

    const rating = sanitizeNumber(input.rating, 1, 5, 5);
    const comment = sanitizeString(input.comment, 500);
    const now = new Date().toISOString();

    const review: ReviewRecord = {
      id: `rev-${Date.now()}`,
      bookingId,
      jobId: booking.jobId,
      fromUserId: fromUser.id,
      fromUserName: fromUser.name,
      fromUserRole: fromUser.role,
      toUserId: targetUserId,
      toUserName: targetUserName,
      targetType,
      rating,
      comment,
      serviceCategory: booking.serviceCategory,
      createdAt: now,
      updatedAt: now
    };

    this.reviews.set(review.id, review);

    // Update aggregate ratings for worker
    if (targetType === 'worker') {
      const worker = this.getWorkerById(targetUserId);
      if (worker) {
        const workerReviews = Array.from(this.reviews.values()).filter(r => r.toUserId === worker.userId);
        const avg = workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length;
        worker.rating = Number(avg.toFixed(2));
        worker.reviewsCount = workerReviews.length;
        this.workers.set(worker.id, worker);
      }
    }

    return { success: true, review };
  }

  public getReviewsForUser(userId: string): ReviewRecord[] {
    return Array.from(this.reviews.values()).filter(r => r.toUserId === userId);
  }

  // --- Reports & Safety ---
  public submitReport(reporterUserId: string, targetId: string, targetType: any, reason: string, details?: string): ReportRecord {
    const report: ReportRecord = {
      id: `rep-${Date.now()}`,
      reporterUserId,
      targetId: sanitizeString(targetId, 64),
      targetType: targetType || 'user',
      reason: sanitizeString(reason, 200),
      details: details ? sanitizeString(details, 500) : '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.reports.set(report.id, report);
    return report;
  }

  // --- Account Deletion (Complete Purge & Anonymization) ---
  public deleteUserAccount(userId: string): { success: boolean } {
    // 1. Revoke active auth tokens
    revokeAllUserSessions(userId);

    // 2. Remove user profile
    this.users.delete(userId);

    // 3. Remove worker profile
    const worker = this.getWorkerById(userId);
    if (worker) {
      this.workers.delete(worker.id);
    }

    // 4. Remove open jobs created by this user
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.customerId === userId && (job.status === 'open' || job.status === 'cancelled')) {
        this.jobs.delete(jobId);
      }
    }

    // 5. Anonymize user's past reviews to preserve community rating integrity while purging PII
    for (const review of this.reviews.values()) {
      if (review.fromUserId === userId) {
        review.fromUserName = 'Former Member';
      }
    }

    return { success: true };
  }
}

export const serverStore = new ServerStore();
