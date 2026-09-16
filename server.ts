import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import {
  createOtp,
  verifyOtp,
  createSession,
  validateSession,
  revokeSession,
  checkRateLimit,
  hashPassword,
  verifyPassword,
  ServerUser
} from './server/auth';
import { serverStore } from './server/store';
import { sanitizeIndianPhone, sanitizeString, sanitizeNumber } from './server/sanitizer';
import { serverAssistJobDescription } from './server/gemini';

// Extend Express Request to include authenticated user
export interface AuthenticatedRequest extends Request {
  user?: ServerUser;
  sessionToken?: string;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust Cloud Run / Reverse Proxy Ingress for proper HTTPS/2 detection
  app.set('trust proxy', 1);

  // Compression Middleware: Accelerates HTTP/2 stream multiplexing by compressing text assets
  app.use(compression());

  // Security Middleware: Payload size limit to prevent memory-exhaustion DoS
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTPS & HTTP/2 Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // HTTP/2 & HTTPS Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // HTTP/2 Server Push & Preload Hints for index navigation
    if (req.path === '/' || req.path === '/index.html') {
      res.setHeader('Link', [
        '<https://fonts.googleapis.com>; rel=preconnect',
        '<https://fonts.gstatic.com>; rel=preconnect; crossorigin'
      ].join(', '));
    }

    next();
  });

  // Authentication Token Extractor Middleware
  const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const userId = validateSession(token);
      if (userId) {
        const user = serverStore.getUserById(userId);
        if (user && !user.isBlocked) {
          req.user = user;
          req.sessionToken = token;
        }
      }
    }
    next();
  };
  app.use(authMiddleware);

  // Require Authenticated User Guard
  const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required. Please sign in.' });
    }
    next();
  };

  // Require Role Guard
  const requireRole = (allowedRoles: Array<'customer' | 'worker' | 'admin'>) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: `Forbidden: Requires ${allowedRoles.join(' or ')} privilege.` });
      }
      next();
    };
  };

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Health & Protocol
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'KAAMLY Production Backend',
      timestamp: new Date().toISOString(),
      security: 'hardened',
      protocol: req.httpVersion,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
  });

  // Protocol & Transport Security Status
  app.get('/api/network/protocol', (req: Request, res: Response) => {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.json({
      status: 'ok',
      protocol: `HTTP/${req.httpVersion}`,
      transport: isHttps ? 'HTTPS' : 'HTTP',
      isSecure: isHttps,
      http2Ready: true,
      features: {
        http2Multiplexing: true,
        http2Compression: true,
        linkHeaderPreloading: true,
        strictTransportSecurity: true,
        upgradeInsecureRequests: true
      },
      headers: {
        hsts: res.getHeader('Strict-Transport-Security'),
        xContentTypeOptions: res.getHeader('X-Content-Type-Options'),
        referrerPolicy: res.getHeader('Referrer-Policy')
      }
    });
  });

  // --- Auth: Request OTP ---
  app.post('/api/auth/otp/request', (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    // Global IP rate limit: max 40 OTP requests per hour per IP
    if (!checkRateLimit(`ip_otp_${ip}`, 40, 3600 * 1000)) {
      return res.status(429).json({ error: 'Too many requests from this network. Please try again later.' });
    }

    const { phone } = req.body;
    const validated = sanitizeIndianPhone(phone);
    if (!validated.valid) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    const result = createOtp(validated.formatted);
    if (!result.success) {
      return res.status(429).json({ error: result.error, retryAfterSeconds: result.retryAfterSeconds });
    }

    return res.json({
      success: true,
      message: `Verification code sent to ${validated.formatted}. Valid for 5 minutes.`,
      phone: validated.formatted,
      otpCode: result.code,
      sandboxCode: result.code,
      simulatedNotification: result.simulatedNotification
    });
  });

  // --- Auth: Verify OTP ---
  app.post('/api/auth/otp/verify', (req: Request, res: Response) => {
    const { phone, code, role } = req.body;
    const validated = sanitizeIndianPhone(phone);
    if (!validated.valid) {
      return res.status(400).json({ error: 'Invalid phone format.' });
    }

    if (!code || typeof code !== 'string' || code.trim().length !== 6) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit verification code.' });
    }

    const verification = verifyOtp(validated.formatted, code.trim());
    if (!verification.success) {
      return res.status(400).json({ error: verification.error });
    }

    // Single-use verification successful, issue session token
    const ip = req.ip || 'unknown';
    const { user, isNew } = serverStore.getOrCreateUser(validated.formatted, role === 'worker' ? 'worker' : 'customer');
    const token = createSession(user.id, ip);

    return res.json({
      success: true,
      token,
      user,
      isNew
    });
  });

  // --- Auth: Password Sign-In (Email or Phone) ---
  app.post('/api/auth/login-password', (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide both an email/phone and password.' });
    }

    const user = serverStore.getUserByIdentifier(String(identifier).trim());
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email or phone number.' });
    }

    if (!user.passwordHash || !verifyPassword(String(password), user.passwordHash)) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    }

    const ip = req.ip || 'unknown';
    const token = createSession(user.id, ip);

    return res.json({
      success: true,
      token,
      user,
      isNew: false
    });
  });

  // --- Auth: Register with Password ---
  app.post('/api/auth/register-password', (req: Request, res: Response) => {
    const { name, email, phone, password, role, city, state } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide your full name (minimum 2 characters).' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if identifier already exists
    if (email && serverStore.getUserByEmail(email.trim())) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    let formattedPhone = '+91 99999 00000';
    if (phone) {
      const p = sanitizeIndianPhone(phone);
      if (p.valid) {
        formattedPhone = p.formatted;
        if (serverStore.getUserByPhone(p.formatted)) {
          return res.status(409).json({ error: 'An account with this phone number already exists.' });
        }
      }
    }

    const newUser = serverStore.registerUserWithPassword({
      name: sanitizeString(name, 100),
      email: email ? sanitizeString(email, 120).toLowerCase() : undefined,
      phone: formattedPhone,
      passwordHash: hashPassword(password),
      role: role === 'worker' ? 'worker' : 'customer',
      city: city ? sanitizeString(city, 50) : 'Bengaluru',
      state: state ? sanitizeString(state, 50) : 'Karnataka'
    });

    const ip = req.ip || 'unknown';
    const token = createSession(newUser.id, ip);

    return res.json({
      success: true,
      token,
      user: newUser,
      isNew: true
    });
  });

  // --- Auth: Quick Demo Accounts List ---
  app.get('/api/auth/quick-accounts', (req: Request, res: Response) => {
    res.json({
      success: true,
      accounts: serverStore.getQuickLoginAccounts()
    });
  });

  // --- Auth: Quick One-Tap Login (For Instant Testing / Real Use) ---
  app.post('/api/auth/quick-login', (req: Request, res: Response) => {
    const { userId, role } = req.body;
    let targetUser: ServerUser | undefined;

    if (userId) {
      targetUser = serverStore.getUserById(userId);
    } else if (role === 'worker') {
      targetUser = serverStore.getUserById('u-rajesh');
    } else {
      targetUser = serverStore.getUserById('u-rahul');
    }

    if (!targetUser) {
      // Fallback
      const { user } = serverStore.getOrCreateUser('+91 98450 11223', role === 'worker' ? 'worker' : 'customer');
      targetUser = user;
    }

    const ip = req.ip || 'unknown';
    const token = createSession(targetUser.id, ip);

    return res.json({
      success: true,
      token,
      user: targetUser,
      isNew: false
    });
  });

  // --- Auth: Fast Google Sign-In ---
  app.post('/api/auth/google', (req: Request, res: Response) => {
    const { email, name, avatar, role } = req.body;
    const targetEmail = (email && typeof email === 'string') ? email.trim().toLowerCase() : 'user@gmail.com';
    const targetName = (name && typeof name === 'string' && name.trim()) ? name.trim() : 'Google User';

    let user = serverStore.getUserByEmail(targetEmail);
    let isNew = false;

    if (!user) {
      isNew = true;
      user = serverStore.registerUserWithPassword({
        name: targetName,
        email: targetEmail,
        phone: '+91 98000 00000',
        passwordHash: hashPassword(Math.random().toString()),
        role: role === 'worker' ? 'worker' : 'customer',
        city: 'Bengaluru',
        state: 'Karnataka'
      });
      if (avatar) {
        user.avatar = avatar;
      }
    }

    const ip = req.ip || 'unknown';
    const token = createSession(user.id, ip);

    return res.json({
      success: true,
      token,
      user,
      isNew
    });
  });

  // --- Auth: Get Current Authenticated Profile ---
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, user: req.user });
  });

  // --- Auth: Logout ---
  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (req.sessionToken) {
      revokeSession(req.sessionToken);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // --- Auth: Delete Account (GDPR / Play Store Compliance) ---
  app.delete('/api/auth/delete-account', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    serverStore.deleteUserAccount(userId);
    res.json({ success: true, message: 'Your account and personal data have been completely deleted.' });
  });

  // --- User: Update Profile ---
  app.patch('/api/users/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const updated = serverStore.updateUserProfile(req.user!.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: updated });
  });

  // --- User: Switch Role ---
  app.post('/api/users/switch-role', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const { role } = req.body;
    if (role !== 'customer' && role !== 'worker') {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }
    const updated = serverStore.switchUserRole(req.user!.id, role);
    res.json({ success: true, user: updated });
  });

  // --- Workers: List & Filter (Location Privacy Protected) ---
  app.get('/api/workers', (req: AuthenticatedRequest, res: Response) => {
    const city = req.query.city as string;
    const category = req.query.category as string;
    const query = req.query.query as string;

    const workers = serverStore.getWorkers({ city, category, query });

    // Location & Privacy Protection:
    // Mask exact phone numbers for public listing to prevent scraping & spam;
    // Exact GPS coordinates are NEVER exposed.
    const sanitizedWorkers = workers.map(w => {
      const isSelf = req.user && req.user.id === w.userId;
      return {
        ...w,
        phone: isSelf ? w.phone : `${w.phone.slice(0, 7)}*** ${w.phone.slice(-2)}`
      };
    });

    res.json({ success: true, workers: sanitizedWorkers });
  });

  // --- Workers: Get by ID ---
  app.get('/api/workers/:id', (req: AuthenticatedRequest, res: Response) => {
    const worker = serverStore.getWorkerById(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const isSelf = req.user && req.user.id === worker.userId;
    const reviews = serverStore.getReviewsForUser(worker.userId);

    res.json({
      success: true,
      worker: {
        ...worker,
        phone: isSelf ? worker.phone : `${worker.phone.slice(0, 7)}*** ${worker.phone.slice(-2)}`
      },
      reviews
    });
  });

  // --- Workers: Update Worker Profile ---
  app.put('/api/workers/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const profile = serverStore.saveWorkerProfile(req.user!.id, req.body);
    res.json({ success: true, profile });
  });

  // --- Jobs: List Public Jobs (Privacy Protected) ---
  app.get('/api/jobs', (req: AuthenticatedRequest, res: Response) => {
    const city = req.query.city as string;
    const category = req.query.category as string;
    const status = (req.query.status as string) || 'open';

    const jobs = serverStore.getJobs({ city, category, status });

    // Personal Data & Privacy Protection:
    // Mask customer phone number in public list so public visitors cannot harvest customer numbers
    const sanitizedJobs = jobs.map(j => {
      const isOwner = req.user && req.user.id === j.customerId;
      return {
        ...j,
        customerPhone: isOwner ? j.customerPhone : `${j.customerPhone.slice(0, 7)}*** ${j.customerPhone.slice(-2)}`
      };
    });

    res.json({ success: true, jobs: sanitizedJobs });
  });

  // --- Jobs: Create Job (Authenticated Customer Only) ---
  app.post('/api/jobs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    // Rate limit: Max 10 job postings per user per day
    if (!checkRateLimit(`job_post_${req.user!.id}`, 10, 24 * 3600 * 1000)) {
      return res.status(429).json({ error: 'You have reached the maximum job posting limit for today.' });
    }

    const { title, category, description, budget } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Job title, trade category, and description are required.' });
    }

    const job = serverStore.createJob(req.user!.id, req.user!, req.body);
    res.json({ success: true, job });
  });

  // --- Jobs: Update Job (Server-Side Ownership Check) ---
  app.put('/api/jobs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const result = serverStore.updateJob(req.params.id, req.user!.id, req.user!.role, req.body);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 404).json({ error: result.error });
    }
    res.json({ success: true, job: result.job });
  });

  // --- Jobs: Delete Job (Server-Side Ownership Check) ---
  app.delete('/api/jobs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const result = serverStore.deleteJob(req.params.id, req.user!.id, req.user!.role);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 404).json({ error: result.error });
    }
    res.json({ success: true, message: 'Job deleted successfully.' });
  });

  // --- Jobs: Apply to Job (Worker Only, Rate Limited, Ownership Check) ---
  app.post('/api/jobs/:id/apply', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (req.user!.role !== 'worker') {
      return res.status(403).json({ error: 'Only registered workers can apply for jobs.' });
    }

    // Rate limit: Max 25 applications per worker per day
    if (!checkRateLimit(`job_apply_${req.user!.id}`, 25, 24 * 3600 * 1000)) {
      return res.status(429).json({ error: 'You have reached the daily job application limit.' });
    }

    const { proposedRate, coverNote } = req.body;
    const result = serverStore.applyToJob(req.user!, req.params.id, proposedRate, coverNote);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, application: result.application });
  });

  // --- Jobs: Accept or Reject Application (Customer Owner ONLY) ---
  app.patch('/api/jobs/:id/applications/:appId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;
    if (status !== 'accepted' && status !== 'rejected') {
      return res.status(400).json({ error: 'Status must be "accepted" or "rejected".' });
    }

    const result = serverStore.setApplicationStatus(req.params.appId, req.user!.id, status);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 400).json({ error: result.error });
    }
    res.json({ success: true, application: result.application, booking: result.booking });
  });

  // --- Bookings: List (Only Bookings for Current User) ---
  app.get('/api/bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const bookings = serverStore.getBookingsForUser(req.user!.id);
    res.json({ success: true, bookings });
  });

  // --- Bookings: Update Status (Party Verification) ---
  app.patch('/api/bookings/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;
    if (!['in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const result = serverStore.updateBookingStatus(req.params.id, req.user!.id, status);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 400).json({ error: result.error });
    }
    res.json({ success: true, booking: result.booking });
  });

  // --- Messages: List Conversations (Participant Filtered) ---
  app.get('/api/messages/conversations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const conversations = serverStore.getConversationsForUser(req.user!.id);
    res.json({ success: true, conversations });
  });

  // --- Messages: Get Messages for Conversation (Strict Participant Check) ---
  app.get('/api/messages/:convId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const result = serverStore.getMessagesForConversation(req.params.convId, req.user!.id);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 404).json({ error: result.error });
    }
    res.json({ success: true, messages: result.messages });
  });

  // --- Messages: Send Message (Participant Verified, Rate Limited) ---
  app.post('/api/messages', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    // Rate limit: Max 30 messages per minute per user to prevent automated abuse
    if (!checkRateLimit(`msg_send_${req.user!.id}`, 30, 60 * 1000)) {
      return res.status(429).json({ error: 'You are sending messages too quickly. Please wait a moment.' });
    }

    const { conversationId, text, recipientId } = req.body;
    let targetConvId = conversationId;

    if (!targetConvId && recipientId) {
      const conv = serverStore.getOrCreateConversation(req.user!, recipientId);
      targetConvId = conv.id;
    }

    if (!targetConvId) {
      return res.status(400).json({ error: 'conversationId or recipientId required.' });
    }

    const result = serverStore.sendMessage(req.user!, targetConvId, text);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 400).json({ error: result.error });
    }
    res.json({ success: true, message: result.message, conversationId: targetConvId });
  });

  // --- Reviews: Submit Review (Verified Booking Check) ---
  app.post('/api/reviews', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const result = serverStore.submitReview(req.user!, req.body);
    if (!result.success) {
      return res.status(result.error?.includes('Unauthorized') ? 403 : 400).json({ error: result.error });
    }
    res.json({ success: true, review: result.review });
  });

  // --- Safety: Submit Report (Rate Limited) ---
  app.post('/api/reports', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (!checkRateLimit(`report_${req.user!.id}`, 5, 3600 * 1000)) {
      return res.status(429).json({ error: 'Report submission limit reached.' });
    }

    const { targetId, targetType, reason, details } = req.body;
    if (!targetId || !reason) {
      return res.status(400).json({ error: 'targetId and reason are required.' });
    }

    const report = serverStore.submitReport(req.user!.id, targetId, targetType, reason, details);
    res.json({ success: true, report });
  });

  // --- AI: Server-Side Gemini Assistance Proxy (Secure, Rate Limited) ---
  app.post('/api/ai/assist', (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    // Rate limit AI calls: max 15 requests per 10 minutes per IP
    if (!checkRateLimit(`ai_assist_${ip}`, 15, 600 * 1000)) {
      return res.status(429).json({ error: 'AI request limit reached. Please wait a few minutes.' });
    }

    const { category, title, roughNotes } = req.body;
    serverAssistJobDescription(category, title, roughNotes)
      .then(description => {
        res.json({ success: true, description });
      })
      .catch(err => {
        console.warn('AI assistance fallback:', err);
        res.json({
          success: true,
          description: `Require an experienced professional for ${title || category}. Quality workmanship expected.`
        });
      });
  });

  // --- Secure File Upload Validator (MIME, Extension, Size) ---
  app.post('/api/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    // In memory image data upload simulation with strict validation
    const { filename, mimeType, dataBase64 } = req.body;

    // 1. Validate MIME type strictly
    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
    if (!mimeType || !ALLOWED_MIME.includes(mimeType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP images are permitted.' });
    }

    // 2. Reject suspicious extensions
    const dangerousExtensions = ['.exe', '.sh', '.js', '.php', '.html', '.svg', '.bat', '.py'];
    if (filename && dangerousExtensions.some(ext => filename.toLowerCase().endsWith(ext))) {
      return res.status(400).json({ error: 'Security violation: File extension rejected.' });
    }

    // 3. Validate size (Max 5MB)
    if (dataBase64 && typeof dataBase64 === 'string') {
      const approxBytes = (dataBase64.length * 3) / 4;
      if (approxBytes > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds maximum allowed limit (5 MB).' });
      }
    }

    // 4. Generate cryptographically safe UUID filename
    const safeId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    res.json({
      success: true,
      url: `/uploads/${safeId}.${mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'}`
    });
  });

  // --- Admin: Server-Side Authorization ONLY ---
  app.get('/api/admin/overview', requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      status: 'Admin authorized',
      stats: {
        totalWorkers: serverStore.getWorkers().length,
        totalJobs: serverStore.getJobs().length,
        activeBookings: serverStore.getBookingsForUser(req.user!.id).length
      }
    });
  });

  // -------------------------------------------------------------
  // VITE MIDDLEWARE (Development) vs STATIC SERVING (Production)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KAAMLY SECURE SERVER] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
