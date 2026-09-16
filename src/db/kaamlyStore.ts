import {
  User,
  WorkerProfile,
  CustomerProfile,
  Job,
  JobApplication,
  Booking,
  Review,
  Message,
  Conversation,
  NotificationItem,
  Report,
  Favorite,
  UserLocation,
  UserRole,
  CategoryInfo
} from '../types';
import { ApiClient } from '../services/apiClient';

export const POPULAR_CATEGORIES: CategoryInfo[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    icon: 'Zap',
    description: 'Wiring, MCB fitting, ceiling fans, switchboards & power troubleshooting.',
    popularSkills: ['House Wiring', 'Fan Repair', 'MCB Installation', 'Inverter Setup', 'Appliance Connection'],
    averageRate: '₹250 - ₹500 / job'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    icon: 'Wrench',
    description: 'Tap repair, pipe leaks, sanitary fittings, water tanks and motor lines.',
    popularSkills: ['Pipe Leak Repair', 'Tap & Shower Fitting', 'Drain Cleaning', 'Water Tank Connection', 'Geyser Piping'],
    averageRate: '₹300 - ₹600 / job'
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: 'Hammer',
    description: 'Furniture repair, door locks, hinges, modular work & custom woodwork.',
    popularSkills: ['Door Lock Fitting', 'Wardrobe Repair', 'Hinges & Handles', 'Custom Shelves', 'Furniture Assembly'],
    averageRate: '₹400 - ₹800 / day'
  },
  {
    id: 'painter',
    name: 'Painter',
    icon: 'Paintbrush',
    description: 'Interior & exterior wall painting, waterproof putty, texture & touch-ups.',
    popularSkills: ['Wall Putty', 'Interior Emulsion', 'Waterproofing', 'Primer Coat', 'Wood Polish'],
    averageRate: '₹600 - ₹1000 / day'
  },
  {
    id: 'mason',
    name: 'Mason / Mistri',
    icon: 'BrickWall',
    description: 'Brickwork, plastering, tile laying, floor repair and masonry renovation.',
    popularSkills: ['Tile Laying', 'Brick Work', 'Plastering', 'Cement Repair', 'Bathroom Renovation'],
    averageRate: '₹800 - ₹1200 / day'
  },
  {
    id: 'cleaner',
    name: 'House Cleaner',
    icon: 'Sparkles',
    description: 'Deep home cleaning, bathroom scrubbing, kitchen degreasing & sofa wash.',
    popularSkills: ['Deep Home Cleaning', 'Bathroom Scrubbing', 'Kitchen Cleaning', 'Balcony Wash', 'Floor Polishing'],
    averageRate: '₹400 - ₹900 / visit'
  },
  {
    id: 'ac-tech',
    name: 'AC Technician',
    icon: 'Snowflake',
    description: 'AC jet service, gas filling, cooling issue repair and split AC install.',
    popularSkills: ['Jet Foam Service', 'Gas Leak Testing', 'Copper Piping', 'Compressor Repair', 'AC Uninstallation'],
    averageRate: '₹499 - ₹1200 / service'
  },
  {
    id: 'appliance-repair',
    name: 'Appliance Repair',
    icon: 'Cpu',
    description: 'Washing machine, refrigerator, microwave, geyser and RO purifier service.',
    popularSkills: ['Washing Machine', 'Refrigerator Cooling', 'Microwave Magnetron', 'Water Purifier Filter', 'Geyser Element'],
    averageRate: '₹350 - ₹700 / visit'
  },
  {
    id: 'welder',
    name: 'Welder / Fabrication',
    icon: 'Flame',
    description: 'Iron gates, window grills, shed fabrication, railing repair and welding.',
    popularSkills: ['Arc Welding', 'Iron Gate Repair', 'Window Grill Fitting', 'Staircase Railing', 'Tin Shed'],
    averageRate: '₹700 - ₹1100 / day'
  },
  {
    id: 'daily-wage',
    name: 'Daily Wage Helper',
    icon: 'Users',
    description: 'Loading, unloading, shifting assistance, garden clearing and manual labor.',
    popularSkills: ['Loading / Unloading', 'Material Shifting', 'Debris Clearing', 'Digging / Gardening', 'General Assistance'],
    averageRate: '₹500 - ₹800 / day'
  }
];

// Local Storage Keys
const STORAGE_PREFIX = 'kaamly_';
const KEYS = {
  USERS: `${STORAGE_PREFIX}users_v1`,
  WORKERS: `${STORAGE_PREFIX}worker_profiles_v1`,
  CUSTOMERS: `${STORAGE_PREFIX}customer_profiles_v1`,
  JOBS: `${STORAGE_PREFIX}jobs_v1`,
  APPLICATIONS: `${STORAGE_PREFIX}job_applications_v1`,
  BOOKINGS: `${STORAGE_PREFIX}bookings_v1`,
  REVIEWS: `${STORAGE_PREFIX}reviews_v1`,
  MESSAGES: `${STORAGE_PREFIX}messages_v1`,
  CONVERSATIONS: `${STORAGE_PREFIX}conversations_v1`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications_v1`,
  REPORTS: `${STORAGE_PREFIX}reports_v1`,
  FAVORITES: `${STORAGE_PREFIX}favorites_v1`,
  BLOCKED: `${STORAGE_PREFIX}blocked_users_v1`,
  SESSION: `${STORAGE_PREFIX}current_session_v1`,
  ACTIVE_LOCATION: `${STORAGE_PREFIX}active_location_v1`
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing localStorage key ${key}:`, err);
  }
}

// Initial Realistic Seed Workers for immediate usability across top categories
const SEED_WORKERS: WorkerProfile[] = [
  {
    id: 'w-rajesh',
    userId: 'u-rajesh',
    name: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    category: 'Electrician',
    skills: ['House Wiring', 'Fan Repair', 'MCB Installation', 'Inverter Setup', 'Switchboard Repair'],
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
    shortDescription: 'Certified licensed electrical technician with 12 years of hands-on experience in residential wiring, short-circuit troubleshooting, and MCB setups.',
    rating: 4.9,
    reviewsCount: 148,
    completedJobsCount: 320,
    verifiedStatus: 'verified',
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w-manoj',
    userId: 'u-manoj',
    name: 'Manoj Paswan',
    phone: '+91 98112 34567',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    category: 'Plumber',
    skills: ['Pipe Leak Repair', 'Tap & Shower Fitting', 'Drain Cleaning', 'Water Tank Connection'],
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
    shortDescription: 'Expert in persistent pipeline leakage, CPVC pipe fitting, toilet diverters, and overhead tank water pumps.',
    rating: 4.8,
    reviewsCount: 96,
    completedJobsCount: 215,
    verifiedStatus: 'verified',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w-satish',
    userId: 'u-satish',
    name: 'Satish Carpenter',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'Carpenter',
    skills: ['Door Lock Fitting', 'Wardrobe Repair', 'Hinges & Handles', 'Modular Work'],
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
    shortDescription: 'Skilled wood artisan specializing in smart door locks, modular kitchen adjustments, antique furniture restoration, and squeaky door fixes.',
    rating: 4.95,
    reviewsCount: 182,
    completedJobsCount: 410,
    verifiedStatus: 'verified',
    createdAt: new Date(Date.now() - 150 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w-vikas',
    userId: 'u-vikas',
    name: 'Vikas Kumar',
    phone: '+91 97170 98765',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'Painter',
    skills: ['Wall Putty', 'Interior Emulsion', 'Waterproofing', 'Primer Coat'],
    experienceYears: 9,
    hourlyRate: 200,
    dailyRate: 800,
    availability: 'available',
    contactPreference: 'both',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    locality: 'Kothrud / Baner',
    languages: ['Marathi', 'Hindi'],
    shortDescription: 'Contractor and skilled wall painter. Clean masking, zero-drip rolling, and anti-dampness putty work guaranteed.',
    rating: 4.75,
    reviewsCount: 74,
    completedJobsCount: 165,
    verifiedStatus: 'verified',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w-ramesh',
    userId: 'u-ramesh',
    name: 'Ramesh Yadav',
    phone: '+91 94310 11223',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    category: 'Mason / Mistri',
    skills: ['Tile Laying', 'Brick Work', 'Plastering', 'Cement Repair'],
    experienceYears: 18,
    hourlyRate: 350,
    dailyRate: 1100,
    availability: 'available',
    contactPreference: 'both',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    locality: 'Kankarbagh / Boring Road',
    languages: ['Hindi', 'Bhojpuri'],
    shortDescription: 'Senior mason with extensive experience in precision vitrified floor tiling, wall plastering, dampness treatment and parapet wall brickwork.',
    rating: 4.88,
    reviewsCount: 112,
    completedJobsCount: 290,
    verifiedStatus: 'verified',
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w-imran',
    userId: 'u-imran',
    name: 'Imran Ali',
    phone: '+91 99887 66554',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    category: 'AC Technician',
    skills: ['Jet Foam Service', 'Gas Leak Testing', 'Copper Piping', 'Compressor Repair'],
    experienceYears: 7,
    hourlyRate: 350,
    dailyRate: 1200,
    availability: 'available',
    contactPreference: 'both',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    city: 'Lucknow',
    locality: 'Gomti Nagar / Alambagh',
    languages: ['Hindi', 'Urdu'],
    shortDescription: 'Trained HVAC specialist. Pressure jet chemical wash, R32/R410A refrigerant gas filling and PCB board diagnostics.',
    rating: 4.9,
    reviewsCount: 88,
    completedJobsCount: 195,
    verifiedStatus: 'verified',
    createdAt: new Date(Date.now() - 75 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SEED_JOBS: Job[] = [
  {
    id: 'job-1',
    customerId: 'u-arun',
    customerName: 'Arun Nambiar',
    customerPhone: '+91 98451 99887',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Ceiling Fan Replacement & Balcony Switchboard Repair',
    category: 'Electrician',
    skills: ['Fan Repair', 'House Wiring'],
    description: 'Need an experienced electrician to install 2 new BLDC ceiling fans and fix a sparked socket in the balcony switchboard. Fans and step ladder are ready at site.',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    locality: 'Indiranagar 12th Main',
    budgetType: 'fixed',
    budget: 650,
    preferredDate: 'Today or Tomorrow Morning',
    status: 'open',
    applicationsCount: 2,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'job-2',
    customerId: 'u-shreya',
    customerName: 'Shreya Kulkarni',
    customerPhone: '+91 97654 32190',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Kitchen Sink Under-Drain Pipe Leakage & Tap Cartridge Replacement',
    category: 'Plumber',
    skills: ['Pipe Leak Repair', 'Tap & Shower Fitting'],
    description: 'Water is dripping from the sink PVC connector under the counter. Also need to replace the mixer ceramic spindle for the main kitchen faucet.',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    locality: 'Koramangala 4th Block',
    budgetType: 'fixed',
    budget: 500,
    preferredDate: 'Urgent - Within 3 Hours',
    status: 'open',
    applicationsCount: 1,
    createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 3600000).toISOString()
  },
  {
    id: 'job-3',
    customerId: 'u-deepak',
    customerName: 'Deepak Mehrotra',
    customerPhone: '+91 98110 55443',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Wooden Main Door Godrej Lock Installation',
    category: 'Carpenter',
    skills: ['Door Lock Fitting'],
    description: 'Need a carpenter to mortise and fix a new Godrej Rim lock on the solid teak wood entrance door with clean wood chiseling.',
    state: 'Delhi',
    district: 'South Delhi',
    city: 'Saket',
    locality: 'Saket J-Block',
    budgetType: 'fixed',
    budget: 700,
    preferredDate: 'This Weekend',
    status: 'open',
    applicationsCount: 0,
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600000).toISOString()
  }
];

export class KaamlyStore {
  // Initialization
  public static init(): void {
    const workers = getStorageItem<WorkerProfile[]>(KEYS.WORKERS, []);
    if (workers.length === 0) {
      setStorageItem(KEYS.WORKERS, SEED_WORKERS);
    }

    const jobs = getStorageItem<Job[]>(KEYS.JOBS, []);
    if (jobs.length === 0) {
      setStorageItem(KEYS.JOBS, SEED_JOBS);
    }
  }

  // Session & Authentication
  public static getCurrentUser(): User | null {
    return getStorageItem<User | null>(KEYS.SESSION, null);
  }

  public static setCurrentUser(user: User | null): void {
    setStorageItem(KEYS.SESSION, user);
  }

  public static getUsers(): User[] {
    return getStorageItem<User[]>(KEYS.USERS, []);
  }

  public static saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    setStorageItem(KEYS.USERS, users);

    // If active session matches
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      this.setCurrentUser(user);
    }
  }

  public static authenticateWithPhone(phone: string, role: UserRole = 'customer'): { user: User; isNew: boolean } {
    const cleanPhone = phone.trim();
    const users = this.getUsers();
    let existing = users.find(u => u.phone === cleanPhone);
    let isNew = false;

    if (!existing) {
      isNew = true;
      const now = new Date().toISOString();
      existing = {
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        phone: cleanPhone,
        name: role === 'worker' ? 'New Kaamly Worker' : 'Kaamly Member',
        role,
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
      this.saveUser(existing);
    }

    this.setCurrentUser(existing);
    return { user: existing, isNew };
  }

  public static logout(): void {
    ApiClient.logout().catch(() => {});
    localStorage.removeItem(KEYS.SESSION);
    sessionStorage.removeItem(KEYS.SESSION);
  }

  public static deleteAccount(userId: string): void {
    ApiClient.deleteAccount().catch(() => {});

    // Remove user
    let users = this.getUsers().filter(u => u.id !== userId);
    setStorageItem(KEYS.USERS, users);

    // Remove worker profile if any
    let workers = this.getWorkers().filter(w => w.userId !== userId);
    setStorageItem(KEYS.WORKERS, workers);

    // Remove customer jobs
    let jobs = this.getJobs().filter(j => j.customerId !== userId);
    setStorageItem(KEYS.JOBS, jobs);

    // Clear session if current
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.logout();
    }
  }

  // Workers
  public static getWorkers(filters?: {
    city?: string;
    category?: string;
    search?: string;
    availability?: string;
    minRating?: number;
    maxRate?: number;
  }): WorkerProfile[] {
    let list = getStorageItem<WorkerProfile[]>(KEYS.WORKERS, SEED_WORKERS);

    if (filters) {
      if (filters.city && filters.city.trim() && filters.city !== 'All Cities') {
        const c = filters.city.trim().toLowerCase();
        list = list.filter(w => w.city.toLowerCase() === c || w.state.toLowerCase() === c);
      }
      if (filters.category && filters.category.trim() && filters.category !== 'All') {
        const cat = filters.category.trim().toLowerCase();
        list = list.filter(w => w.category.toLowerCase() === cat);
      }
      if (filters.availability && filters.availability !== 'all') {
        list = list.filter(w => w.availability === filters.availability);
      }
      if (filters.minRating) {
        list = list.filter(w => w.rating >= filters.minRating!);
      }
      if (filters.maxRate) {
        list = list.filter(w => (w.hourlyRate ? w.hourlyRate <= filters.maxRate! : true));
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        list = list.filter(
          w =>
            w.name.toLowerCase().includes(q) ||
            w.category.toLowerCase().includes(q) ||
            w.city.toLowerCase().includes(q) ||
            w.locality?.toLowerCase().includes(q) ||
            w.skills.some(s => s.toLowerCase().includes(q)) ||
            w.shortDescription.toLowerCase().includes(q)
        );
      }
    }

    return list;
  }

  public static getWorkerById(id: string): WorkerProfile | null {
    const list = this.getWorkers();
    return list.find(w => w.id === id || w.userId === id) || null;
  }

  public static saveWorkerProfile(profile: WorkerProfile): void {
    const workers = this.getWorkers();
    const idx = workers.findIndex(w => w.id === profile.id || w.userId === profile.userId);
    if (idx >= 0) {
      workers[idx] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      workers.unshift(profile);
    }
    setStorageItem(KEYS.WORKERS, workers);
  }

  // Jobs
  public static getJobs(filters?: {
    city?: string;
    category?: string;
    search?: string;
    status?: string;
    customerId?: string;
  }): Job[] {
    let list = getStorageItem<Job[]>(KEYS.JOBS, SEED_JOBS);

    if (filters) {
      if (filters.customerId) {
        list = list.filter(j => j.customerId === filters.customerId);
      }
      if (filters.city && filters.city.trim() && filters.city !== 'All Cities') {
        const c = filters.city.trim().toLowerCase();
        list = list.filter(j => j.city.toLowerCase() === c || j.state.toLowerCase() === c);
      }
      if (filters.category && filters.category.trim() && filters.category !== 'All') {
        const cat = filters.category.trim().toLowerCase();
        list = list.filter(j => j.category.toLowerCase() === cat);
      }
      if (filters.status) {
        list = list.filter(j => j.status === filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        list = list.filter(
          j =>
            j.title.toLowerCase().includes(q) ||
            j.category.toLowerCase().includes(q) ||
            j.city.toLowerCase().includes(q) ||
            j.locality.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q) ||
            j.skills.some(s => s.toLowerCase().includes(q))
        );
      }
    }

    return list;
  }

  public static getJobById(id: string): Job | null {
    const jobs = this.getJobs();
    return jobs.find(j => j.id === id) || null;
  }

  public static createJob(data: Omit<Job, 'id' | 'applicationsCount' | 'status' | 'createdAt' | 'updatedAt'>): Job {
    const jobs = this.getJobs();
    const now = new Date().toISOString();
    const newJob: Job = {
      ...data,
      id: `job-${Date.now()}`,
      status: 'open',
      applicationsCount: 0,
      createdAt: now,
      updatedAt: now
    };
    jobs.unshift(newJob);
    setStorageItem(KEYS.JOBS, jobs);

    // Trigger system notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: data.customerId,
      title: 'Job Posted Successfully',
      body: `"${newJob.title}" is now visible to local ${newJob.category}s in ${newJob.city}.`,
      type: 'system',
      read: false,
      createdAt: now
    });

    return newJob;
  }

  public static updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    jobs[idx] = { ...jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    setStorageItem(KEYS.JOBS, jobs);
    return jobs[idx];
  }

  // Job Applications
  public static getApplications(filters?: { jobId?: string; workerUserId?: string }): JobApplication[] {
    let list = getStorageItem<JobApplication[]>(KEYS.APPLICATIONS, []);
    if (filters?.jobId) {
      list = list.filter(a => a.jobId === filters.jobId);
    }
    if (filters?.workerUserId) {
      list = list.filter(a => a.workerUserId === filters.workerUserId);
    }
    return list;
  }

  public static submitApplication(data: Omit<JobApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): JobApplication {
    return this.applyToJob(data);
  }

  public static applyToJob(data: Omit<JobApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): JobApplication {
    const applications = this.getApplications();
    const now = new Date().toISOString();
    const app: JobApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
    applications.unshift(app);
    setStorageItem(KEYS.APPLICATIONS, applications);

    // Update applications count on job
    const job = this.getJobById(data.jobId);
    if (job) {
      this.updateJob(job.id, { applicationsCount: (job.applicationsCount || 0) + 1 });

      // Notify customer
      this.addNotification({
        id: `notif-${Date.now()}`,
        userId: job.customerId,
        title: 'New Application Received!',
        body: `${data.workerName} applied for "${job.title}" at ₹${data.proposedRate}.`,
        type: 'job_application',
        read: false,
        data: { jobId: job.id, applicationId: app.id },
        createdAt: now
      });
    }

    return app;
  }

  public static updateApplicationStatus(appId: string, status: 'accepted' | 'rejected'): JobApplication | null {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) return null;

    const app = apps[idx];
    app.status = status;
    app.updatedAt = new Date().toISOString();
    setStorageItem(KEYS.APPLICATIONS, apps);

    const job = this.getJobById(app.jobId);

    if (status === 'accepted') {
      if (job) {
        this.updateJob(job.id, {
          status: 'assigned',
          selectedWorkerId: app.workerId,
          selectedWorkerName: app.workerName
        });

        // Automatically create a Booking record
        this.createBooking({
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
          agreedPrice: app.proposedRate,
          scheduledDate: job.preferredDate,
          state: job.state,
          district: job.district,
          city: job.city,
          locality: job.locality,
          notes: app.coverNote
        });
      }

      // Notify worker
      this.addNotification({
        id: `notif-${Date.now()}`,
        userId: app.workerUserId,
        title: 'Application Accepted! 🎉',
        body: `Your proposal for "${app.jobTitle}" was accepted. You can now contact the customer.`,
        type: 'application_accepted',
        read: false,
        data: { jobId: app.jobId, applicationId: app.id },
        createdAt: new Date().toISOString()
      });
    }

    return app;
  }

  // Bookings
  public static getBookings(filters?: { customerId?: string; workerUserId?: string }): Booking[] {
    let list = getStorageItem<Booking[]>(KEYS.BOOKINGS, []);
    if (filters?.customerId) {
      list = list.filter(b => b.customerId === filters.customerId);
    }
    if (filters?.workerUserId) {
      list = list.filter(b => b.workerUserId === filters.workerUserId);
    }
    return list;
  }

  public static createBooking(
    data: Omit<Booking, 'id' | 'status' | 'customerReviewed' | 'workerReviewed' | 'createdAt' | 'updatedAt'>
  ): Booking {
    const list = this.getBookings();
    const now = new Date().toISOString();
    const title = (data as any).title || (data as any).jobTitle || 'Service Request';
    const price = (data as any).agreedPrice ?? (data as any).agreedRate ?? 500;
    const booking: Booking = {
      ...data,
      title,
      jobTitle: title,
      agreedPrice: price,
      agreedRate: price,
      id: `bkg-${Date.now()}`,
      status: 'confirmed',
      customerReviewed: false,
      workerReviewed: false,
      createdAt: now,
      updatedAt: now
    };
    list.unshift(booking);
    setStorageItem(KEYS.BOOKINGS, list);

    // Notify both parties
    this.addNotification({
      id: `notif-${Date.now()}-c`,
      userId: data.customerId,
      title: 'Booking Confirmed',
      body: `Booking for ${data.serviceCategory} with ${data.workerName} confirmed.`,
      type: 'booking_confirmed',
      read: false,
      data: { bookingId: booking.id },
      createdAt: now
    });

    this.addNotification({
      id: `notif-${Date.now()}-w`,
      userId: data.workerUserId,
      title: 'Work Scheduled',
      body: `Work order for ${data.customerName} in ${data.city} scheduled.`,
      type: 'booking_confirmed',
      read: false,
      data: { bookingId: booking.id },
      createdAt: now
    });

    return booking;
  }

  public static updateBookingStatus(
    bookingId: string,
    status: 'in_progress' | 'completed' | 'cancelled'
  ): Booking | null {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.id === bookingId);
    if (idx === -1) return null;

    const b = list[idx];
    b.status = status;
    b.updatedAt = new Date().toISOString();
    setStorageItem(KEYS.BOOKINGS, list);

    if (status === 'completed') {
      // If linked to job, mark job completed
      if (b.jobId) {
        this.updateJob(b.jobId, { status: 'completed' });
      }

      // Notify customer to review
      this.addNotification({
        id: `notif-${Date.now()}`,
        userId: b.customerId,
        title: 'Work Completed! Please Rate & Review',
        body: `${b.workerName} marked "${b.title}" as completed. Share your feedback.`,
        type: 'job_completed',
        read: false,
        data: { bookingId: b.id },
        createdAt: new Date().toISOString()
      });
    }

    return b;
  }

  // Reviews
  public static getReviews(toUserId?: string): Review[] {
    let list = getStorageItem<Review[]>(KEYS.REVIEWS, []);
    if (toUserId) {
      list = list.filter(r => r.toUserId === toUserId);
    }
    return list;
  }

  public static submitReview(data: any): Review {
    return this.createReview({
      bookingId: data.bookingId,
      jobId: data.jobId,
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      fromUserRole: data.fromUserRole || 'customer',
      toUserId: data.toUserId,
      toUserName: data.toUserName,
      targetType: data.targetType || 'worker',
      rating: data.rating,
      comment: data.comment,
      tags: data.tags,
      serviceCategory: data.serviceCategory || 'General Work'
    });
  }

  public static createReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Review {
    const list = this.getReviews();
    const now = new Date().toISOString();
    const review: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    list.unshift(review);
    setStorageItem(KEYS.REVIEWS, list);

    // If review is for worker, update worker aggregate rating
    if (data.targetType === 'worker') {
      const worker = this.getWorkerById(data.toUserId);
      if (worker) {
        const workerReviews = list.filter(r => r.toUserId === worker.userId);
        const avg = workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length;
        this.saveWorkerProfile({
          ...worker,
          rating: Number(avg.toFixed(2)),
          reviewsCount: workerReviews.length
        });
      }
    }

    // Mark booking reviewed
    if (data.bookingId) {
      const bookings = this.getBookings();
      const bIdx = bookings.findIndex(b => b.id === data.bookingId);
      if (bIdx >= 0) {
        if (data.fromUserRole === 'customer') {
          bookings[bIdx].customerReviewed = true;
        } else {
          bookings[bIdx].workerReviewed = true;
        }
        setStorageItem(KEYS.BOOKINGS, bookings);
      }
    }

    // Notify recipient
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: data.toUserId,
      title: 'You received a new review!',
      body: `${data.fromUserName} rated you ${data.rating} stars: "${data.comment}"`,
      type: 'new_review',
      read: false,
      data: { reviewId: review.id },
      createdAt: now
    });

    return review;
  }

  // Messages & Conversations
  public static getConversations(userId: string): Conversation[] {
    const list = getStorageItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    return list.filter(c => c.participantIds.includes(userId));
  }

  public static getMessages(conversationId: string): Message[] {
    const list = getStorageItem<Message[]>(KEYS.MESSAGES, []);
    return list.filter(m => m.conversationId === conversationId);
  }

  public static getOrCreateConversation(
    userA: { id: string; name: string; avatar?: string; role: UserRole; phone?: string },
    userB: { id: string; name: string; avatar?: string; role: UserRole; phone?: string },
    jobContext?: { jobId: string; jobTitle: string }
  ): Conversation {
    const conversations = getStorageItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    let conv = conversations.find(
      c => c.participantIds.includes(userA.id) && c.participantIds.includes(userB.id)
    );

    if (!conv) {
      const now = new Date().toISOString();
      conv = {
        id: `conv-${Date.now()}`,
        participantIds: [userA.id, userB.id],
        participantDetails: [userA, userB],
        lastMessage: 'Conversation started',
        lastMessageTimestamp: now,
        unreadCount: { [userA.id]: 0, [userB.id]: 0 },
        jobId: jobContext?.jobId,
        jobTitle: jobContext?.jobTitle,
        createdAt: now,
        updatedAt: now
      };
      conversations.unshift(conv);
      setStorageItem(KEYS.CONVERSATIONS, conversations);
    }

    return conv;
  }

  public static getChatHistory(userIdA: string, userIdB: string): Message[] {
    const conversations = getStorageItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    const conv = conversations.find(
      c => c.participantIds.includes(userIdA) && c.participantIds.includes(userIdB)
    );
    if (!conv) return [];
    return this.getMessages(conv.id);
  }

  public static sendMessage(
    conversationIdOrPayload: string | { senderId: string; senderName: string; receiverId: string; receiverName: string; content: string },
    senderId?: string,
    senderName?: string,
    text?: string
  ): Message {
    let convId: string;
    let sId: string;
    let sName: string;
    let content: string;

    if (typeof conversationIdOrPayload === 'object') {
      const payload = conversationIdOrPayload;
      const conv = this.getOrCreateConversation(
        { id: payload.senderId, name: payload.senderName, role: 'customer' },
        { id: payload.receiverId, name: payload.receiverName, role: 'worker' }
      );
      convId = conv.id;
      sId = payload.senderId;
      sName = payload.senderName;
      content = payload.content;
    } else {
      convId = conversationIdOrPayload;
      sId = senderId || '';
      sName = senderName || 'User';
      content = text || '';
    }

    const messages = getStorageItem<Message[]>(KEYS.MESSAGES, []);
    const conversations = getStorageItem<Conversation[]>(KEYS.CONVERSATIONS, []);

    const conv = conversations.find(c => c.id === convId);
    const recipientId = conv?.participantIds.find(id => id !== sId) || '';

    const now = new Date().toISOString();
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: sId,
      senderName: sName,
      recipientId,
      text: content.trim(),
      read: false,
      createdAt: now
    };
    messages.push(msg);
    setStorageItem(KEYS.MESSAGES, messages);

    // Update conversation snippet
    if (conv) {
      conv.lastMessage = msg.text;
      conv.lastMessageTimestamp = now;
      conv.unreadCount = conv.unreadCount || {};
      conv.unreadCount[recipientId] = (conv.unreadCount[recipientId] || 0) + 1;
      conv.updatedAt = now;
      setStorageItem(KEYS.CONVERSATIONS, conversations);

      // Notification
      this.addNotification({
        id: `notif-${Date.now()}`,
        userId: recipientId,
        title: `Message from ${sName}`,
        body: msg.text.length > 60 ? `${msg.text.substring(0, 60)}...` : msg.text,
        type: 'new_message',
        read: false,
        data: { conversationId: convId },
        createdAt: now
      });
    }

    return msg;
  }

  // Notifications
  public static getNotifications(userId: string): NotificationItem[] {
    const list = getStorageItem<NotificationItem[]>(KEYS.NOTIFICATIONS, []);
    return list.filter(n => n.userId === userId);
  }

  public static addNotification(notif: NotificationItem): void {
    const list = getStorageItem<NotificationItem[]>(KEYS.NOTIFICATIONS, []);
    list.unshift(notif);
    setStorageItem(KEYS.NOTIFICATIONS, list);
  }

  public static markNotificationAsRead(id: string): void {
    const list = getStorageItem<NotificationItem[]>(KEYS.NOTIFICATIONS, []);
    const notif = list.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      setStorageItem(KEYS.NOTIFICATIONS, list);
    }
  }

  // Trust & Safety
  public static reportItem(data: Omit<Report, 'id' | 'status' | 'createdAt'>): Report {
    const list = getStorageItem<Report[]>(KEYS.REPORTS, []);
    const report: Report = {
      ...data,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(report);
    setStorageItem(KEYS.REPORTS, list);
    return report;
  }

  public static blockUser(userId: string, blockedUserId: string): void {
    const blocked = getStorageItem<Record<string, string[]>>(KEYS.BLOCKED, {});
    if (!blocked[userId]) blocked[userId] = [];
    if (!blocked[userId].includes(blockedUserId)) {
      blocked[userId].push(blockedUserId);
      setStorageItem(KEYS.BLOCKED, blocked);
    }
  }

  public static isUserBlocked(userId: string, targetUserId: string): boolean {
    const blocked = getStorageItem<Record<string, string[]>>(KEYS.BLOCKED, {});
    return !!(blocked[userId] && blocked[userId].includes(targetUserId));
  }

  // Favorites
  public static toggleFavorite(userId: string, workerId: string): boolean {
    let favs = getStorageItem<Favorite[]>(KEYS.FAVORITES, []);
    const existingIdx = favs.findIndex(f => f.userId === userId && f.workerId === workerId);
    if (existingIdx >= 0) {
      favs.splice(existingIdx, 1);
      setStorageItem(KEYS.FAVORITES, favs);
      return false;
    } else {
      favs.push({
        id: `fav-${Date.now()}`,
        userId,
        workerId,
        createdAt: new Date().toISOString()
      });
      setStorageItem(KEYS.FAVORITES, favs);
      return true;
    }
  }

  public static isFavorite(userId: string, workerId: string): boolean {
    const favs = getStorageItem<Favorite[]>(KEYS.FAVORITES, []);
    return favs.some(f => f.userId === userId && f.workerId === workerId);
  }

  // Location Active State
  public static getActiveLocation(): UserLocation {
    return getStorageItem<UserLocation>(KEYS.ACTIVE_LOCATION, {
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      city: 'Bengaluru',
      locality: 'Indiranagar',
      isGPS: false
    });
  }

  public static setActiveLocation(loc: UserLocation): void {
    setStorageItem(KEYS.ACTIVE_LOCATION, loc);
  }
}

// Ensure store is seeded upon import
if (typeof window !== 'undefined') {
  KaamlyStore.init();
}
