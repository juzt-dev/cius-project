import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

/**
 * Rate limiting configuration for API routes
 * Uses Upstash Redis with sliding window algorithm
 */

// Contact form: 10 requests per hour per IP
export const contactRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      prefix: 'ratelimit:contact',
      analytics: true,
    })
  : null;

// Careers form: 5 requests per hour per IP
export const careersRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'ratelimit:careers',
      analytics: true,
    })
  : null;

// Report download: 20 requests per hour per IP
export const reportRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 h'),
      prefix: 'ratelimit:report',
      analytics: true,
    })
  : null;

/**
 * Helper to get client IP from request headers
 * Handles x-forwarded-for, x-real-ip, and direct connection
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}
