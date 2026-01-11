/**
 * Contact Server Action Tests
 * Tests for submitContactAction with mocked Prisma, Email, and Rate Limiting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContactAction } from './contact';

// Hoist mock objects
const mockContactRateLimit = vi.hoisted(() => ({
  limit: vi.fn(),
}));

// Mock headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() =>
    Promise.resolve({
      get: vi.fn((header: string) => {
        if (header === 'x-forwarded-for') return '127.0.0.1';
        if (header === 'x-real-ip') return '127.0.0.1';
        return null;
      }),
    })
  ),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    contact: {
      create: vi.fn(),
    },
  },
}));

// Mock Email Service
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
  emailTemplates: {
    contactConfirmation: vi.fn((name: string) => `<p>Thank you ${name}</p>`),
  },
}));

// Mock Rate Limiting
vi.mock('@/lib/rate-limit', () => ({
  contactRateLimit: mockContactRateLimit,
}));

// Mock Logger
vi.mock('@/lib/logger', () => ({
  apiLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Import mocked modules
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

describe('submitContactAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limit allows request
    mockContactRateLimit.limit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
      pending: Promise.resolve(),
    });
  });

  describe('Successful Submissions', () => {
    it('should create contact and send email', async () => {
      const mockContact = {
        id: 'contact-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message from user',
        createdAt: new Date('2026-01-11'),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('message', 'Test message from user');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Contact form submitted successfully');
      if (result.success) {
        expect(result.id).toBe('contact-id-123');
      }

      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message from user',
        },
      });

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'john@example.com',
        subject: 'Thank you for contacting us',
        html: expect.any(String),
      });

      expect(emailTemplates.contactConfirmation).toHaveBeenCalledWith('John Doe');
    });

    it('should handle various valid email formats', async () => {
      const testEmails = [
        'simple@example.com',
        'user+tag@example.com',
        'user.name@example.co.uk',
        'user_name@example-domain.com',
      ];

      for (const email of testEmails) {
        vi.clearAllMocks();
        mockContactRateLimit.limit.mockResolvedValue({
          success: true,
          limit: 10,
          remaining: 9,
          reset: Date.now() + 3600000,
          pending: Promise.resolve(),
        });

        const mockContact = {
          id: `contact-${email}`,
          name: 'Test User',
          email,
          message: 'Test message',
          createdAt: new Date(),
        };

        vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
        vi.mocked(sendEmail).mockResolvedValueOnce({
          success: true,
          data: { id: 'mock-email-id' },
        });

        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', email);
        formData.append('message', 'Test message');

        const result = await submitContactAction(formData);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Validation Errors', () => {
    it('should return error for invalid email', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'invalid-email');
      formData.append('message', 'Test message');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Validation failed');
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0].message).toContain('Invalid email');
      }
    });

    it('should return error for missing name', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('message', 'Test message');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Validation failed');
      }
    });

    it('should return error for name too short', async () => {
      const formData = new FormData();
      formData.append('name', 'A');
      formData.append('email', 'test@example.com');
      formData.append('message', 'Test message');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.[0].message).toContain('at least 2 characters');
      }
    });

    it('should return error for missing email', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('message', 'Test message');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for message too short', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('message', 'Short');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.[0].message).toContain('at least 10 characters');
      }
    });

    it('should return error for missing message', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
    });
  });

  describe('Database Errors', () => {
    it('should return error on database failure', async () => {
      vi.mocked(prisma.contact.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('message', 'Test message here');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Internal server error');
      }
    });
  });

  describe('Email Service Failures', () => {
    it('should return error if email fails', async () => {
      const mockContact = {
        id: 'contact-123',
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Test message',
        createdAt: new Date(),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Email service down'));

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('message', 'Test message here');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 error when rate limit is exceeded', async () => {
      mockContactRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('message', 'Test message here');

      const result = await submitContactAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Too many requests. Please try again later.');
        expect(result.limit).toBe(10);
        expect(result.remaining).toBe(0);
        expect(result.reset).toBeDefined();
      }
    });

    it('should not call database or email when rate limited', async () => {
      mockContactRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('message', 'Test message here');

      await submitContactAction(formData);

      expect(prisma.contact.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
});
