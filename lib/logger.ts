import pino from 'pino';

/**
 * Structured logger using Pino for production-grade logging
 * - JSON logs in production for log aggregation
 * - Pretty colorized logs in development for DX
 * - Child loggers for module-specific context
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

// Module-specific child loggers
export const authLogger = logger.child({ module: 'auth' });
export const emailLogger = logger.child({ module: 'email' });
export const redisLogger = logger.child({ module: 'redis' });
export const apiLogger = logger.child({ module: 'api' });
