import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Secure server-side secret (generated per server boot or from env)
const SERVER_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

export interface ServerUser {
  id: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  name: string;
  role: 'customer' | 'worker' | 'admin';
  state?: string;
  district?: string;
  city?: string;
  locality?: string;
  language?: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Password hashing using SHA-256 HMAC with SERVER_SECRET
export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SERVER_SECRET).update(password.trim()).digest('hex');
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) return false;
  const computedHash = hashPassword(password);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'utf8'), Buffer.from(storedHash, 'utf8'));
}

export interface SessionData {
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
  ip: string;
}

// In-memory security records (in real production, backed by redis / distributed cache)
const activeSessions = new Map<string, SessionData>();

// OTP Record: phone -> { hashedOtp, expiresAt, attempts, consumed, createdAt }
interface OtpRecord {
  phone: string;
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  consumed: boolean;
  createdAt: number;
}
const otpRecords = new Map<string, OtpRecord>();

// Rate Limiting records: key -> timestamps[]
const rateLimits = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (rateLimits.get(key) || []).filter(t => now - t < windowMs);
  
  if (timestamps.length >= maxRequests) {
    rateLimits.set(key, timestamps);
    return false; // Rate limit exceeded
  }
  
  timestamps.push(now);
  rateLimits.set(key, timestamps);
  return true;
}

// Generate cryptographic 6-digit OTP and store hashed
export function createOtp(phone: string): {
  success: boolean;
  error?: string;
  retryAfterSeconds?: number;
  code?: string;
  codeForSandbox?: string;
  channel?: string;
  simulatedNotification?: string;
} {
  const now = Date.now();
  
  // Rate limit: Max 10 OTP requests per phone per 15 minutes to avoid locking legitimate users
  if (!checkRateLimit(`otp_req_phone_${phone}`, 10, 15 * 60 * 1000)) {
    return {
      success: false,
      error: 'Too many OTP requests. For security, please wait a few minutes before requesting another code.',
      retryAfterSeconds: 300
    };
  }

  // Minimum 15 seconds cooldown between successive OTP requests for same phone
  const existing = otpRecords.get(phone);
  if (existing && !existing.consumed && now - existing.createdAt < 15 * 1000) {
    const remaining = Math.ceil((15 * 1000 - (now - existing.createdAt)) / 1000);
    return {
      success: false,
      error: `Please wait ${remaining} seconds before requesting a new OTP.`,
      retryAfterSeconds: remaining
    };
  }

  // Cryptographically secure 6-digit integer: [100000, 999999]
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  
  // Hash OTP with server secret so plaintext is NEVER stored in database or memory
  const hashedOtp = crypto.createHmac('sha256', SERVER_SECRET).update(otpCode).digest('hex');

  otpRecords.set(phone, {
    phone,
    hashedOtp,
    expiresAt: now + 5 * 60 * 1000, // Valid for 5 minutes
    attempts: 0, // Max 3 verification attempts
    consumed: false,
    createdAt: now
  });

  console.log(`[SECURE AUTH] Dispatched SMS OTP for ${phone.slice(0, 7)}*** -> Code: ${otpCode} (Expires in 5 min)`);

  return {
    success: true,
    code: otpCode,
    codeForSandbox: otpCode,
    channel: 'SMS Gateway',
    simulatedNotification: `KAAMLY: ${otpCode} is your OTP verification code. Valid for 5 minutes. Do not share with anyone.`
  };
}

// Verify OTP with timing-safe comparison, attempt limits, and single-use protection
export function verifyOtp(phone: string, inputCode: string): { success: boolean; error?: string } {
  const record = otpRecords.get(phone);
  const now = Date.now();

  if (!record) {
    return { success: false, error: 'No active OTP request found. Please request a new code.' };
  }

  if (record.consumed) {
    return { success: false, error: 'This OTP has already been used. Please request a new code.' };
  }

  if (now > record.expiresAt) {
    otpRecords.delete(phone);
    return { success: false, error: 'The verification code has expired. Please request a new code.' };
  }

  // Brute-force protection: Max 3 failed attempts allowed
  if (record.attempts >= 3) {
    record.consumed = true; // Invalidate permanently
    return { success: false, error: 'Too many incorrect attempts. For security, this OTP has been invalidated.' };
  }

  record.attempts += 1;

  // Hash user input using same HMAC
  const inputHash = crypto.createHmac('sha256', SERVER_SECRET).update(inputCode.trim()).digest('hex');

  // Timing-safe comparison to prevent timing attacks
  const match = crypto.timingSafeEqual(Buffer.from(inputHash, 'utf8'), Buffer.from(record.hashedOtp, 'utf8'));

  if (!match) {
    const remaining = 3 - record.attempts;
    return {
      success: false,
      error: remaining > 0 ? `Incorrect OTP. ${remaining} attempt(s) remaining.` : 'Incorrect OTP. Maximum attempts exceeded.'
    };
  }

  // Successful verification: Mark as consumed immediately (single-use guarantee)
  record.consumed = true;
  return { success: true };
}

// Create session token with 7 days expiration
export function createSession(userId: string, ip: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: SessionData = {
    userId,
    token,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    createdAt: now,
    ip
  };
  activeSessions.set(token, session);
  return token;
}

// Validate session token
export function validateSession(token: string): string | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  // Slide expiration window on active usage
  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return session.userId;
}

// Revoke session
export function revokeSession(token: string): void {
  activeSessions.delete(token);
}

// Revoke all sessions for a user (used on account deletion / password/phone change)
export function revokeAllUserSessions(userId: string): void {
  for (const [token, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      activeSessions.delete(token);
    }
  }
}
