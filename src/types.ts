export type UserRole = 'worker' | 'customer';

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export type ContactPreference = 'phone' | 'chat' | 'both';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export type JobStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  state: string;
  district: string;
  city: string;
  locality?: string;
  language: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  category: string;
  skills: string[];
  experienceYears: number;
  hourlyRate?: number;
  dailyRate?: number;
  availability: AvailabilityStatus;
  contactPreference: ContactPreference;
  state: string;
  district: string;
  city: string;
  locality?: string;
  languages: string[];
  shortDescription: string;
  rating: number;
  reviewsCount: number;
  completedJobsCount: number;
  verifiedStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  city: string;
  locality?: string;
  postedJobsCount: number;
  hiredWorkersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
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
  contactPreference?: ContactPreference;
  budgetType: 'fixed' | 'daily' | 'hourly';
  budget: number;
  preferredDate: string;
  status: JobStatus;
  applicationsCount: number;
  selectedWorkerId?: string;
  selectedWorkerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId?: string;
  workerUserId: string;
  workerName: string;
  workerPhone: string;
  workerCategory: string;
  workerRating: number;
  workerAvatar?: string;
  proposedRate: number;
  rateType: 'fixed' | 'daily' | 'hourly';
  coverNote: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  jobId?: string;
  workerId?: string;
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
  rateType?: 'fixed' | 'daily' | 'hourly';
  status: BookingStatus;
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

// Legacy Compatibility Types
export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  colorTheme?: {
    bg: string;
    text: string;
    border: string;
    lightBg: string;
  };
  rating: number;
  reviewsCount: number;
  startingPrice: string | number;
  priceUnit?: string;
  typicalDuration?: string;
  turnaroundTime?: string;
  description: string;
  searchKeywords?: string;
  badges?: string[];
  popularTasks?: string[];
  features?: string[];
  reviews?: any[];
}

export interface BookingRequest {
  id: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  preferredTime: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedWorker?: any;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId?: string;
  jobId?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: UserRole;
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  content?: string;
  read: boolean;
  createdAt: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantDetails: {
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
    phone?: string;
  }[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: Record<string, number>;
  jobId?: string;
  jobTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type:
    | 'job_application'
    | 'application_accepted'
    | 'application_rejected'
    | 'new_message'
    | 'booking_confirmed'
    | 'work_reminder'
    | 'job_completed'
    | 'new_review'
    | 'system';
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedJobId?: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  workerId: string;
  createdAt: string;
}

export interface UserLocation {
  latitude?: number;
  longitude?: number;
  state: string;
  district: string;
  city: string;
  locality: string;
  isGPS: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  popularSkills: string[];
  averageRate: string;
}
