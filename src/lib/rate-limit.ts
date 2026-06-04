/**
 * Simple in-memory rate limiter
 * For production, consider using Vercel KV or Upstash Redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  /**
   * Time window in seconds
   */
  window: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request is rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.window * 1000;

  let entry = store.get(identifier);

  // Reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    store.set(identifier, entry);
  }

  entry.count++;

  const success = entry.count <= config.limit;
  const remaining = Math.max(0, config.limit - entry.count);

  return {
    success,
    limit: config.limit,
    remaining,
    reset: entry.resetAt,
  };
}

/**
 * Get client identifier (IP address) from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from Vercel headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Contact form: 3 submissions per hour per IP
  contact: {
    limit: 3,
    window: 60 * 60, // 1 hour
  },
  // Admin login: 5 attempts per hour per IP
  adminLogin: {
    limit: 5,
    window: 60 * 60, // 1 hour
  },
  // Admin operations: 100 requests per minute
  adminApi: {
    limit: 100,
    window: 60, // 1 minute
  },
} as const;
