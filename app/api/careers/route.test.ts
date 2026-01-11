/**
 * Careers API Route Tests
 * Tests for POST /api/careers endpoint with Prisma and Email mocking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Hoist mock objects
const mockCareersRateLimit = vi.hoisted(() => ({
  limit: vi.fn(),
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
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

// Import mocked modules
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

describe('POST /api/careers', () => {
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
        createdAt: new Date('2026-01-07'),
      };

      vi.mocked(prisma.career.create).mockResolvedValueOnce(mockCareer);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Smith',
          email: 'jane@example.com',
          position: 'Senior Developer',
          message: 'I have 5 years of experience',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Application submitted successfully');
      expect(json.id).toBe('career-id-123');

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

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Junior Dev',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
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

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User',
          email: 'user@example.com',
          position: longPosition,
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 for invalid email', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'invalid-email',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors[0].message).toContain('Invalid email');
    });

    it('should return 400 for missing name', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 for name too short', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'A',
          email: 'test@example.com',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors[0].message).toContain('at least 2 characters');
    });

    it('should return 400 for missing email', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing position', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('should return 400 for position too short', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          position: 'A',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors[0].message).toContain('Position is required');
    });

    it('should return 400 for empty request body', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });
  });

  describe('Database Errors', () => {
    it('should return 500 on database error', async () => {
      vi.mocked(prisma.career.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Internal server error');
    });
  });

  describe('Email Service Failures', () => {
    it('should return 500 if email fails', async () => {
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

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(500);
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

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User',
          email: 'user@example.com',
          position: 'Dev',
          message: '',
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });

    it('should reject application with explicit null message (Zod optional)', async () => {
      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User',
          email: 'user@example.com',
          position: 'Dev',
          message: null, // Zod.optional() doesn't accept explicit null
        }),
      });

      const response = await POST(request as any);

      // Zod optional() only accepts undefined or missing field, not null
      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit is exceeded', async () => {
      mockCareersRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          position: 'Developer',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(429);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Too many requests. Please try again later.');
      expect(json.limit).toBe(5);
      expect(json.remaining).toBe(0);
      expect(json.reset).toBeDefined();
    });

    it('should include rate limit metadata in 429 response', async () => {
      const resetTime = Date.now() + 3600000;
      mockCareersRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: resetTime,
        pending: Promise.resolve(),
      });

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          position: 'Senior Dev',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(json.limit).toBe(5);
      expect(json.remaining).toBe(0);
      expect(json.reset).toBe(resetTime);
    });

    it('should not call database or email when rate limited', async () => {
      mockCareersRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 5,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const request = new Request('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          position: 'Developer',
        }),
      });

      await POST(request as any);

      expect(prisma.career.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
});
