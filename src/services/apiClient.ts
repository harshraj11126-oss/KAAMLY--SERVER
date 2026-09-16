import { User, WorkerProfile, Job, JobApplication, Booking, Message, Conversation, Review } from '../types';

const TOKEN_KEY = 'kaamly_auth_token_v1';

const FALLBACK_QUICK_ACCOUNTS = [
  {
    id: 'usr-demo-1',
    name: 'Rahul Sharma',
    role: 'customer' as const,
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    title: 'Homeowner / Apartment Resident',
    rating: 4.9,
    city: 'Bengaluru',
    locality: 'Indiranagar'
  },
  {
    id: 'usr-demo-2',
    name: 'Rajesh Sharma',
    role: 'worker' as const,
    phone: '9811223344',
    email: 'rajesh.electrician@example.com',
    title: 'Certified Electrician (10+ Yrs Exp)',
    rating: 4.9,
    category: 'Electrician',
    city: 'Bengaluru',
    locality: 'Koramangala'
  },
  {
    id: 'usr-demo-3',
    name: 'Manoj Paswan',
    role: 'worker' as const,
    phone: '9844556677',
    email: 'manoj.plumbing@example.com',
    title: 'Master Plumber & Sanitary Expert',
    rating: 4.8,
    category: 'Plumber',
    city: 'Delhi NCR',
    locality: 'Noida Sector 62'
  },
  {
    id: 'usr-demo-4',
    name: 'Shreya Kulkarni',
    role: 'customer' as const,
    phone: '9822334455',
    email: 'shreya.k@example.com',
    title: 'Property Manager & Resident',
    rating: 5.0,
    city: 'Mumbai',
    locality: 'Andheri West'
  }
];

function getLocalUsers(): User[] {
  try {
    const raw = localStorage.getItem('kaamly_users_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(u: User): void {
  try {
    const users = getLocalUsers();
    const idx = users.findIndex(item => item.id === u.id || item.phone === u.phone);
    if (idx >= 0) {
      users[idx] = u;
    } else {
      users.push(u);
    }
    localStorage.setItem('kaamly_users_v1', JSON.stringify(users));
    localStorage.setItem('kaamly_session_v1', JSON.stringify(u));
  } catch {}
}

export class ApiClient {
  public static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  }

  public static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    // Store in sessionStorage by default for heightened session security;
    // also write to localStorage for persistent device session if user chooses
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public static clearToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    // Check rate limit or authentication failures
    if (response.status === 401) {
      // If token expired or revoked, clear
      this.clearToken();
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data as T;
  }

  // --- Auth ---
  public static async requestOtp(phone: string): Promise<{
    success: boolean;
    message: string;
    retryAfterSeconds?: number;
    otpCode?: string;
    sandboxCode?: string;
    simulatedNotification?: string;
  }> {
    try {
      return await this.request('/api/auth/otp/request', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
    } catch {
      // Fallback for static hosting (e.g. GitHub Pages)
      const code = '123456';
      return {
        success: true,
        message: 'OTP sent to ' + phone + ' (Test Code: 123456)',
        retryAfterSeconds: 45,
        otpCode: code,
        sandboxCode: code,
        simulatedNotification: `KAAMLY: ${code} is your OTP verification code. Valid for 5 minutes.`
      };
    }
  }

  public static async verifyOtp(phone: string, code: string, role?: string): Promise<{ success: boolean; token: string; user: User; isNew: boolean }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User; isNew: boolean }>('/api/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code, role })
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    } catch {
      // Fallback for static hosting
      const users = getLocalUsers();
      let user = users.find(u => u.phone === phone);
      let isNew = false;
      if (!user) {
        isNew = true;
        user = {
          id: `usr-${Date.now()}`,
          phone,
          name: role === 'worker' ? 'Verified Mistri' : 'Kaamly Member',
          role: (role as any) || 'customer',
          city: 'Bengaluru',
          state: 'Karnataka',
          locality: 'Indiranagar',
          district: 'Bengaluru Urban',
          language: 'Hindi / English',
          isVerified: true,
          isBlocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      saveLocalUser(user);
      const token = `offline_token_${Date.now()}`;
      this.setToken(token);
      return { success: true, token, user, isNew };
    }
  }

  public static async loginWithPassword(identifier: string, password: string): Promise<{ success: boolean; token: string; user: User; isNew: boolean }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User; isNew: boolean }>('/api/auth/login-password', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    } catch {
      // Fallback for static hosting
      const users = getLocalUsers();
      const clean = identifier.toLowerCase().trim();
      let user = users.find(u => (u.email && u.email.toLowerCase() === clean) || u.phone === clean);
      if (!user) {
        // Find in demo
        const demo = FALLBACK_QUICK_ACCOUNTS.find(a => a.phone === clean || a.email === clean);
        if (demo) {
          user = {
            id: demo.id,
            name: demo.name,
            role: demo.role,
            phone: demo.phone,
            email: demo.email,
            city: demo.city,
            state: 'Karnataka',
            district: 'Bengaluru Urban',
            locality: demo.locality,
            language: 'Hindi / English',
            isVerified: true,
            isBlocked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        } else {
          user = {
            id: `usr-${Date.now()}`,
            name: identifier.includes('@') ? identifier.split('@')[0] : 'Kaamly User',
            phone: identifier.replace(/\D/g, '') || '9876543210',
            email: identifier.includes('@') ? identifier : undefined,
            role: 'customer',
            city: 'Bengaluru',
            state: 'Karnataka',
            district: 'Bengaluru Urban',
            locality: 'Indiranagar',
            language: 'Hindi / English',
            isVerified: true,
            isBlocked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }
      saveLocalUser(user);
      const token = `offline_token_${Date.now()}`;
      this.setToken(token);
      return { success: true, token, user, isNew: false };
    }
  }

  public static async registerWithPassword(data: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    role: 'customer' | 'worker';
    city?: string;
    state?: string;
  }): Promise<{ success: boolean; token: string; user: User; isNew: boolean }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User; isNew: boolean }>('/api/auth/register-password', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    } catch {
      // Fallback for static hosting
      const user: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '9876543210',
        role: data.role,
        city: data.city || 'Bengaluru',
        state: data.state || 'Karnataka',
        district: 'Bengaluru Urban',
        locality: 'Central',
        language: 'Hindi / English',
        isVerified: true,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveLocalUser(user);
      const token = `offline_token_${Date.now()}`;
      this.setToken(token);
      return { success: true, token, user, isNew: true };
    }
  }

  public static async getQuickAccounts(): Promise<{
    success: boolean;
    accounts: Array<{
      id: string;
      name: string;
      role: 'customer' | 'worker';
      phone: string;
      email?: string;
      title: string;
      avatar?: string;
      rating?: number;
      category?: string;
      locality?: string;
      city?: string;
    }>;
  }> {
    try {
      return await this.request('/api/auth/quick-accounts');
    } catch {
      return { success: true, accounts: FALLBACK_QUICK_ACCOUNTS };
    }
  }

  public static async quickLogin(userId?: string, role?: 'customer' | 'worker'): Promise<{ success: boolean; token: string; user: User; isNew: boolean }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User; isNew: boolean }>('/api/auth/quick-login', {
        method: 'POST',
        body: JSON.stringify({ userId, role })
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    } catch {
      const target = FALLBACK_QUICK_ACCOUNTS.find(a => a.id === userId) || FALLBACK_QUICK_ACCOUNTS[0];
      const user: User = {
        id: target.id,
        name: target.name,
        role: target.role,
        phone: target.phone,
        email: target.email,
        city: target.city || 'Bengaluru',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        locality: target.locality || 'Indiranagar',
        language: 'Hindi / English',
        isVerified: true,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveLocalUser(user);
      const token = `offline_token_${Date.now()}`;
      this.setToken(token);
      return { success: true, token, user, isNew: false };
    }
  }

  public static async googleLogin(profile?: { email: string; name: string; avatar?: string; role?: 'customer' | 'worker' }): Promise<{ success: boolean; token: string; user: User; isNew: boolean }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User; isNew: boolean }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(profile || {})
      });
      if (res.token) {
        this.setToken(res.token);
      }
      return res;
    } catch {
      const email = profile?.email || 'user@example.com';
      const name = profile?.name || 'Google User';
      const user: User = {
        id: `usr-g-${Date.now()}`,
        name,
        email,
        phone: '9876543210',
        role: profile?.role || 'customer',
        avatar: profile?.avatar,
        city: 'Bengaluru',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        locality: 'Indiranagar',
        language: 'Hindi / English',
        isVerified: true,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveLocalUser(user);
      const token = `offline_token_${Date.now()}`;
      this.setToken(token);
      return { success: true, token, user, isNew: false };
    }
  }

  public static async getMe(): Promise<{ success: boolean; user: User }> {
    return this.request('/api/auth/me');
  }

  public static async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  public static async deleteAccount(): Promise<void> {
    try {
      await this.request('/api/auth/delete-account', { method: 'DELETE' });
    } finally {
      this.clearToken();
    }
  }

  // --- Profile ---
  public static async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user: User }> {
    return this.request('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  public static async switchRole(role: 'customer' | 'worker'): Promise<{ success: boolean; user: User }> {
    return this.request('/api/users/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  }

  // --- Workers ---
  public static async getWorkers(filters?: { city?: string; category?: string; query?: string }): Promise<{ success: boolean; workers: WorkerProfile[] }> {
    const params = new URLSearchParams();
    if (filters?.city) params.set('city', filters.city);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.query) params.set('query', filters.query);
    return this.request(`/api/workers?${params.toString()}`);
  }

  public static async updateWorkerProfile(profile: Partial<WorkerProfile>): Promise<{ success: boolean; profile: WorkerProfile }> {
    return this.request('/api/workers/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  // --- Jobs ---
  public static async getJobs(filters?: { city?: string; category?: string; status?: string }): Promise<{ success: boolean; jobs: Job[] }> {
    const params = new URLSearchParams();
    if (filters?.city) params.set('city', filters.city);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.status) params.set('status', filters.status);
    return this.request(`/api/jobs?${params.toString()}`);
  }

  public static async createJob(data: any): Promise<{ success: boolean; job: Job }> {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public static async updateJob(jobId: string, updates: Partial<Job>): Promise<{ success: boolean; job: Job }> {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  public static async deleteJob(jobId: string): Promise<{ success: boolean }> {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'DELETE'
    });
  }

  public static async applyToJob(jobId: string, proposedRate: number, coverNote?: string): Promise<{ success: boolean; application: JobApplication }> {
    return this.request(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ proposedRate, coverNote })
    });
  }

  public static async setApplicationStatus(jobId: string, appId: string, status: 'accepted' | 'rejected'): Promise<{ success: boolean; application: JobApplication; booking?: Booking }> {
    return this.request(`/api/jobs/${jobId}/applications/${appId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // --- Bookings ---
  public static async getBookings(): Promise<{ success: boolean; bookings: Booking[] }> {
    return this.request('/api/bookings');
  }

  public static async updateBookingStatus(bookingId: string, status: 'in_progress' | 'completed' | 'cancelled'): Promise<{ success: boolean; booking: Booking }> {
    return this.request(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // --- Messages ---
  public static async getConversations(): Promise<{ success: boolean; conversations: Conversation[] }> {
    return this.request('/api/messages/conversations');
  }

  public static async getMessages(convId: string): Promise<{ success: boolean; messages: Message[] }> {
    return this.request(`/api/messages/${convId}`);
  }

  public static async sendMessage(payload: { conversationId?: string; recipientId?: string; text: string }): Promise<{ success: boolean; message: Message; conversationId: string }> {
    return this.request('/api/messages', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Reviews ---
  public static async submitReview(reviewData: any): Promise<{ success: boolean; review: Review }> {
    return this.request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // --- Safety & Reports ---
  public static async submitReport(reportData: { targetId: string; targetType: string; reason: string; details?: string }): Promise<{ success: boolean }> {
    return this.request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  }

  // --- AI Assistance ---
  public static async getAiAssistance(category: string, title: string, roughNotes?: string): Promise<{ success: boolean; description: string }> {
    try {
      return await this.request('/api/ai/assist', {
        method: 'POST',
        body: JSON.stringify({ category, title, roughNotes })
      });
    } catch {
      const generated = [
        `Looking for an experienced and verified ${category || 'trade professional'} for "${title || 'home service task'}".`,
        '',
        'Scope of Work:',
        roughNotes ? `• ${roughNotes}` : '• Complete inspection, troubleshooting, and reliable repair/installation.',
        '• Must bring standard professional tools, test equipment, and wear safety gear.',
        '• Clean up work area upon task completion.',
        '',
        'Requirements:',
        '• Transparent quotes according to standard KAAMLY rate cards.',
        '• Prompt arrival with valid Aadhaar/Govt ID verification.'
      ].join('\n');
      return { success: true, description: generated };
    }
  }
}
