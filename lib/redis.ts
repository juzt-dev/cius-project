import { Redis } from '@upstash/redis';
import { redisLogger } from '@/lib/logger';

// Initialize Redis only if credentials are available
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Helper functions for caching
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    if (!redis) {
      redisLogger.debug({ key }, 'Redis not configured, skipping cache GET');
      return null;
    }
    try {
      const data = await redis.get<T>(key);
      return data;
    } catch (error) {
      redisLogger.error({ error, key }, 'Redis GET failed');
      return null;
    }
  },

  set: async <T>(key: string, value: T, expirationInSeconds?: number): Promise<void> => {
    if (!redis) {
      redisLogger.debug({ key }, 'Redis not configured, skipping cache SET');
      return;
    }
    try {
      if (expirationInSeconds) {
        await redis.set(key, value, { ex: expirationInSeconds });
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      redisLogger.error({ error, key }, 'Redis SET failed');
    }
  },

  del: async (key: string): Promise<void> => {
    if (!redis) {
      redisLogger.debug({ key }, 'Redis not configured, skipping cache DEL');
      return;
    }
    try {
      await redis.del(key);
    } catch (error) {
      redisLogger.error({ error, key }, 'Redis DEL failed');
    }
  },

  invalidatePattern: async (pattern: string): Promise<void> => {
    if (!redis) {
      redisLogger.debug({ pattern }, 'Redis not configured, skipping invalidatePattern');
      return;
    }
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      redisLogger.error({ error, pattern }, 'Redis invalidate pattern failed');
    }
  },
};
