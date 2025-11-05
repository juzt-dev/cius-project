import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Helper functions for caching
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await redis.get<T>(key);
      return data;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  set: async <T>(key: string, value: T, expirationInSeconds?: number): Promise<void> => {
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
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  invalidatePattern: async (pattern: string): Promise<void> => {
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
