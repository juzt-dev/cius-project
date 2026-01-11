/**
 * Careers Server Action Tests
 * Tests for submitCareersAction with mocked Prisma, Email, and Rate Limiting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitCareersAction } from './careers';

// Hoist mock objects
const mockCareersRateLimit = vi.hoisted(() => ({
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
    career: {
      create: vi.fn(),
    },
  },
}));

// Mock Email Service
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
  emailTemplates: {
    careerApplication: vi.fn((name: string, position: string) => `<p>Hi ${name}, ${position}</p>`),
  },
}));

// Mock Rate Limiting
vi.mock('@/lib/rate-limit', () => ({
  careersRateLimit: mockCareersRateLimit,
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

describe('submitCareersAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limit allows request
    mockCareersRateLimit.limit.mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 3600000,
      pending: Promise.resolve(),
    });
  });

  describe('Successful Submissions', () => {
    it('should create career application with all fields', async () => {
      const mockCareer = {
        id: 'career-id-123',
        name: 'Jane Smith',
        email: 'jane@example.com',
        position: 'Senior Developer',
        message: 'I have 5 years of experience',
        createdAt: new Date('2026-01-11'),
      };

      vi.mocked(prisma.career.create).mockResolvedValueOnce(mockCareer);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('name', 'Jane Smith');
      formData.append('email', 'jane@example.com');
      formData.append('position', 'Senior Developer');
      formData.append('message', 'I have 5 years of experience');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Application submitted successfully');
      if (result.success) {
        expect(result.id).toBe('career-id-123');
      }

      expect(prisma.career.create).toHaveBeenCalledWith({
        data: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          position: 'Senior Developer',
          message: 'I have 5 years of experience',
        },
      });

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'jane@example.com',
        subject: 'Career Application Received',
        html: expect.any(String),
      });

      expect(emailTemplates.careerApplication).toHaveBeenCalledWith(
        'Jane Smith',
        'Senior Developer'
      );
    });

    it('should create application without optional message', async () => {
      const mockCareer = {
        id: 'career-no-msg',
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Junior Dev',
        message: null,
        createdAt: new Date(),
      };

      vi.mocked(prisma.career.create).mockResolvedValueOnce(mockCareer);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('position', 'Junior Dev');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(true);
    });

    it('should handle long position titles', async () => {
      const longPosition = 'Senior Full Stack Software Engineer with DevOps Experience';
      const mockCareer = {
        id: 'long-pos-id',
        name: 'User',
        email: 'user@example.com',
        position: longPosition,
        message: null,
        createdAt: new Date(),
      };

      vi.mocked(prisma.career.create).mockResolvedValueOnce(mockCareer);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('name', 'User');
      formData.append('email', 'user@example.com');
      formData.append('position', longPosition);

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(true);
    });
  });

  describe('Validation Errors', () => {
    it('should return error for invalid email', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'invalid-email');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.[0].message).toContain('Invalid email');
      }
    });

    it('should return error for missing name', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for name too short', async () => {
      const formData = new FormData();
      formData.append('name', 'A');
      formData.append('email', 'test@example.com');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.[0].message).toContain('at least 2 characters');
      }
    });

    it('should return error for missing email', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for missing position', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
    });

    it('should return error for position too short', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('position', 'A');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors?.[0].message).toContain('Position is required');
      }
    });
  });

  describe('Database Errors', () => {
    it('should return error on database failure', async () => {
      vi.mocked(prisma.career.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Internal server error');
      }
    });
  });

  describe('Email Service Failures', () => {
    it('should return error if email fails', async () => {
      const mockCareer = {
        id: 'career-123',
        name: 'John Doe',
        email: 'test@example.com',
        position: 'Developer',
        message: null,
        createdAt: new Date(),
      };

      vi.mocked(prisma.career.create).mockResolvedValueOnce(mockCareer);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Email service down'));

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
    });
  });

  describe('Optional Message Field', () => {
    it('should accept application with empty message', async () => {
      const mockCareer = {
        id: 'empty-msg-id',
        name: 'User',
        email: 'user@example.com',
        position: 'Dev',
        message: '',
        createdAt: new Date(),
      };

      vi.mocked(prisma.career.create).mockResolvedValueOnce(mockCareer);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const formData = new FormData();
      formData.append('name', 'User');
      formData.append('email', 'user@example.com');
      formData.append('position', 'Dev');
      formData.append('message', '');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should return error when rate limit is exceeded', async () => {
      mockCareersRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('position', 'Developer');

      const result = await submitCareersAction(formData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Too many requests. Please try again later.');
        expect(result.limit).toBe(5);
        expect(result.remaining).toBe(0);
        expect(result.reset).toBeDefined();
      }
    });

    it('should not call database or email when rate limited', async () => {
      mockCareersRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'test@example.com');
      formData.append('position', 'Developer');

      await submitCareersAction(formData);

      expect(prisma.career.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
});
