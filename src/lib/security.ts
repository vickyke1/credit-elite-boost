import { z } from "zod";
import DOMPurify from "dompurify";

// Security configuration
export const SECURITY_CONFIG = {
  MAX_INPUT_LENGTH: 1000,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  MAX_ATTEMPTS_PER_WINDOW: 10
} as const;

// Input sanitization schemas
export const ssnSchema = z.string()
  .regex(/^\d{3}-\d{2}-\d{4}$/, "Invalid SSN format")
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => val.length === 9, "SSN must be 9 digits")
  .refine(val => val !== "000000000", "Invalid SSN")
  .refine(val => !val.startsWith("000"), "Invalid area number")
  .refine(val => !val.startsWith("666"), "Invalid area number")
  .refine(val => !val.startsWith("9"), "Invalid area number");

export const emailSchema = z.string()
  .email("Invalid email format")
  .max(254, "Email too long");

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone format")
  .max(20, "Phone number too long");

export const nameSchema = z.string()
  .min(1, "Name is required")
  .max(50, "Name too long")
  .regex(/^[a-zA-Z\s\-']+$/, "Invalid characters in name");

export const transactionIdSchema = z.string()
  .min(10, "Transaction ID too short")
  .max(100, "Transaction ID too long")
  .regex(/^[a-zA-Z0-9]+$/, "Invalid transaction ID format");

// Content sanitization
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true }
  });
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
};

// Rate limiting utility (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
    
    const keyAttempts = this.attempts.get(key) || [];
    const recentAttempts = keyAttempts.filter(time => time > windowStart);
    
    this.attempts.set(key, recentAttempts);
    
    return recentAttempts.length >= SECURITY_CONFIG.MAX_ATTEMPTS_PER_WINDOW;
  }

  recordAttempt(key: string): void {
    const keyAttempts = this.attempts.get(key) || [];
    keyAttempts.push(Date.now());
    this.attempts.set(key, keyAttempts);
  }
}

// Create global rate limiter instance
export const globalRateLimiter = new RateLimiter();