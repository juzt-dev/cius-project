/**
 * Report Server Action Tests
 * Tests for submitReportAction with mocked Prisma, Email, and Rate Limiting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitReportAction } from './report';

// Hoist mock objects
const mockReportRateLimit = vi.hoisted(() => ({
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
    reportDownload: {
      create: vi.fn(),
    },
  },
}));

// Mock Email Service
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
  emailTemplates: {
    reportDownload: vi.fn((email: string) => `<p>Report for ${email}</p>`),
  },
}));

// Mock Rate Limiting
vi.mock('@/lib/rate-limit', () => ({
  reportRateLimit: mockReportRateLimit,
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

describe('submitReportAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limit allows request
    mockReportRateLimit.limit.mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: Date.now() + 3600000,
      pending: Promise.resolve(),
    });
  });

  describe('Successful Submissions', () => {
    it('should create report download record and send email', async () => {
      const mockReport = {
        id: 'report-id-123',
        email: 'user@example.com',
        downloadedAt: new Date('2026-01-11'),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('email', 'user@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Report download link sent to your email');
      if (result.success) {
        expect(result.id).toBe('report-id-123');
      }

      expect(prisma.reportDownload.create).toHaveBeenCalledWith({
        data: {
          email: 'user@example.com',
        },
      });

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'Your Report is Ready',
        html: expect.any(String),
      });

      expect(emailTemplates.reportDownload).toHaveBeenCalledWith('user@example.com');
    });

    it('should handle multiple downloads from same email', async () => {
      const mockReport1 = {
        id: 'report-1',
        email: 'repeat@example.com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport1);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('email', 'repeat@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(true);
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
        mockReportRateLimit.limit.mockResolvedValue({
          success: true,
          limit: 20,
          remaining: 19,
          reset: Date.now() + 3600000,
          pending: Promise.resolve(),
        });

        const mockReport = {
          id: `report-${email}`,
          email,
          downloadedAt: new Date(),
        };

        vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
        vi.mocked(sendEmail).mockResolvedValueOnce({
          success: true,
          data: { id: 'mock-email-id' },
        });

        const formData = new FormData();
        formData.append('email', email);

        const result = await submitReportAction(formData);

        expect(result.success).toBe(true);
      }
    });
  });

  describe('Validation Errors', () => {
    it('should return error for invalid email', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.[0].message).toContain('Invalid email');
      }
    });

    it('should return error for missing email', async () => {
      const formData = new FormData();

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for empty string email', async () => {
      const formData = new FormData();
      formData.append('email', '');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for email with spaces', async () => {
      const formData = new FormData();
      formData.append('email', 'user @example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for email without @', async () => {
      const formData = new FormData();
      formData.append('email', 'userexample.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for email without domain', async () => {
      const formData = new FormData();
      formData.append('email', 'user@');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });
  });

  describe('Database Errors', () => {
    it('should return error on database failure', async () => {
      vi.mocked(prisma.reportDownload.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Internal server error');
      }
    });

    it('should return error on database timeout', async () => {
      vi.mocked(prisma.reportDownload.create).mockRejectedValueOnce(new Error('Query timeout'));

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });
  });

  describe('Email Service Failures', () => {
    it('should return error if email fails', async () => {
      const mockReport = {
        id: 'report-123',
        email: 'test@example.com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Email service down'));

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error on email rate limit', async () => {
      const mockReport = {
        id: 'report-456',
        email: 'test@example.com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Rate limit exceeded'));

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle uppercase email', async () => {
      const mockReport = {
        id: 'upper-id',
        email: 'USER@EXAMPLE.COM',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('email', 'USER@EXAMPLE.COM');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(true);
    });

    it('should handle mixed case email', async () => {
      const mockReport = {
        id: 'mixed-id',
        email: 'User@Example.Com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('email', 'User@Example.Com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should return error when rate limit is exceeded', async () => {
      mockReportRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 20,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await submitReportAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Too many requests. Please try again later.');
        expect(result.limit).toBe(20);
        expect(result.remaining).toBe(0);
        expect(result.reset).toBeDefined();
      }
    });

    it('should include rate limit metadata in error response', async () => {
      const resetTime = Date.now() + 3600000;
      mockReportRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 20,
        remaining: 0,
        reset: resetTime,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('email', 'user@example.com');

      const result = await submitReportAction(formData);

      if (!result.success) {
        expect(result.limit).toBe(20);
        expect(result.remaining).toBe(0);
        expect(result.reset).toBe(resetTime);
      }
    });

    it('should not call database or email when rate limited', async () => {
      mockReportRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 20,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('email', 'test@example.com');

      await submitReportAction(formData);

      expect(prisma.reportDownload.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
});
