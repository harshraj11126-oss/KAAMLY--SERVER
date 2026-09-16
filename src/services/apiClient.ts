import { User, WorkerProfile, Job, JobApplication, Booking, Message, Conversation, Review } from '../types';

const TOKEN_KEY = 'kaamly_auth_token_v1';

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
  public static async requestOtp(phone: string): Promise<{ success: boolean; message: string; retryAfterSeconds?: number; sandboxCode?: string }> {
    return this.request('/api/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  }

  public static async verifyOtp(phone: string, code: string, role?: string): Promise<{ success: boolean; token: string; user: User; isNew: boolean }> {
    const res = await this.request<{ success: boolean; token: string; user: User; isNew: boolean }>('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code, role })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
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
    return this.request('/api/ai/assist', {
      method: 'POST',
      body: JSON.stringify({ category, title, roughNotes })
    });
  }
}
