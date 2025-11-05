import { Redis } from '@upstash/redis';

// Initialize Redis only if credentials are available
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Helper functions for caching
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    if (!redis) {
      console.log('Redis not configured, skipping cache GET:', key);
      return null;
    }
    try {
      const data = await redis.get<T>(key);
      return data;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  set: async <T>(key: string, value: T, expirationInSeconds?: number): Promise<void> => {
    if (!redis) {
      console.log('Redis not configured, skipping cache SET:', key);
      return;
    }
    try {
      if (expirationInSeconds) {
        await redis.set(key, value, { ex: expirationInSeconds });
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  del: async (key: string): Promise<void> => {
    if (!redis) {
      console.log('Redis not configured, skipping cache DEL:', key);
      return;
    }
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  invalidatePattern: async (pattern: string): Promise<void> => {
    if (!redis) {
      console.log('Redis not configured, skipping invalidatePattern:', pattern);
      return;
    }
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis invalidate pattern error:', error);
    }
  },
};
