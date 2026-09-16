/**
 * KAAMLY Security Sanitizer & Input Validator
 * Protects against XSS, NoSQL/SQL injection, Path Traversal, and Malicious Payloads.
 */

// Basic HTML escaping to prevent stored and reflected XSS
export function sanitizeString(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  
  // Truncate to maximum allowed length to prevent memory exhaustion / DoS
  const trimmed = input.trim().slice(0, maxLength);
  
  // Neutralize dangerous HTML characters and scripts
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Clean phone number (extract digits, ensure valid 10-digit Indian mobile)
export function sanitizeIndianPhone(input: unknown): { valid: boolean; formatted: string } {
  if (typeof input !== 'string') return { valid: false, formatted: '' };
  
  const digits = input.replace(/\D/g, '');
  // Extract last 10 digits if includes 91 country code
  const last10 = digits.length > 10 && digits.startsWith('91') ? digits.slice(-10) : digits;
  
  // Valid Indian mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits
  const isValid = /^[6-9]\d{9}$/.test(last10);
  return {
    valid: isValid,
    formatted: isValid ? `+91 ${last10}` : ''
  };
}

// Validate number in range
export function sanitizeNumber(input: unknown, min = 0, max = 1000000, defaultValue = 0): number {
  const num = Number(input);
  if (isNaN(num)) return defaultValue;
  if (num < min) return min;
  if (num > max) return max;
  return Math.round(num * 100) / 100;
}

// Check safe ID format (alphanumeric and hyphens only, prevent path traversal)
export function isValidId(id: unknown): boolean {
  if (typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]{3,64}$/.test(id);
}

// Clean array of strings (e.g. skills, languages, tags)
export function sanitizeStringArray(arr: unknown, maxItems = 20, maxItemLength = 100): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, maxItems)
    .map(item => sanitizeString(item, maxItemLength))
    .filter(item => item.length > 0);
}
