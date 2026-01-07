/**
 * Test Mocks
 * Centralized mock factories for testing
 */

import { vi } from 'vitest';

/**
 * Prisma Client Mock
 * Mock factories for Prisma models (Contact, Career, ReportDownload)
 *
 * @example
 * ```typescript
 * vi.mock('@/lib/prisma', () => ({
 *   prisma: mockPrisma,
 * }));
 * ```
 */
export const mockPrisma = {
  contact: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  career: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  reportDownload: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
};

/**
 * Email Service Mock
 * Mock for sendEmail function with successful response by default
 *
 * @example
 * ```typescript
 * vi.mock('@/lib/email', () => ({
 *   sendEmail: mockSendEmail,
 *   emailTemplates: mockEmailTemplates,
 * }));
 * ```
 */
export const mockSendEmail = vi.fn().mockResolvedValue({
  success: true,
  data: { id: 'email-id' },
});

/**
 * Email Templates Mock
 * Mock factories for email templates
 */
export const mockEmailTemplates = {
  contactConfirmation: vi.fn((name: string) => `<p>Hi ${name}</p>`),
  careerApplication: vi.fn(
    (name: string, position: string) => `<p>Hi ${name}, Position: ${position}</p>`
  ),
  reportDownload: vi.fn((email: string) => `<p>Email: ${email}</p>`),
};

/**
 * Next.js Router Mock
 * Mock for Next.js useRouter hook
 *
 * @example
 * ```typescript
 * vi.mock('next/navigation', () => ({
 *   useRouter: () => mockRouter,
 *   usePathname: vi.fn(() => '/'),
 * }));
 * ```
 */
export const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

/**
 * Next.js Link Component Mock
 * Mock for Next.js Link component
 *
 * @example
 * ```typescript
 * vi.mock('next/link', () => ({
 *   default: ({ children, href }: any) => <a href={href}>{children}</a>,
 * }));
 * ```
 */
export const mockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a href={href}>{children}</a>
);

/**
 * Next.js Image Component Mock
 * Mock for Next.js Image component
 *
 * @example
 * ```typescript
 * vi.mock('next/image', () => ({
 *   default: (props: any) => <img {...props} />,
 * }));
 * ```
 */
export const mockImage = (props: any) => <img {...props} />;

/**
 * Framer Motion Mock
 * Mock for Framer Motion components
 *
 * @example
 * ```typescript
 * vi.mock('framer-motion', () => ({
 *   motion: mockFramerMotion,
 *   useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
 *   useTransform: () => ({ get: () => '0vh' }),
 * }));
 * ```
 */
export const mockFramerMotion = {
  div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
};

/**
 * Redis Cache Mock
 * Mock for Redis cache functions
 *
 * @example
 * ```typescript
 * vi.mock('@/lib/redis', () => ({
 *   cache: mockRedisCache,
 * }));
 * ```
 */
export const mockRedisCache = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(true),
  del: vi.fn().mockResolvedValue(true),
  invalidatePattern: vi.fn().mockResolvedValue(true),
};

/**
 * Upstash Redis Mock
 * Mock for @upstash/redis Redis client
 *
 * @example
 * ```typescript
 * vi.mock('@upstash/redis', () => ({
 *   Redis: vi.fn(() => mockUpstashRedis),
 * }));
 * ```
 */
export const mockUpstashRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
};

/**
 * Resend Mock
 * Mock for Resend email service
 *
 * @example
 * ```typescript
 * vi.mock('resend', () => ({
 *   Resend: vi.fn(() => mockResend),
 * }));
 * ```
 */
export const mockResend = {
  emails: {
    send: vi.fn().mockResolvedValue({ id: 'email-id' }),
  },
};
