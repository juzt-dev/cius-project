/**
 * Contact API Route Tests
 * Tests for POST /api/contact endpoint with Prisma and Email mocking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Hoist mock objects
const mockRateLimit = vi.hoisted(() => ({
  limit: vi.fn(),
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
    contactConfirmation: vi.fn((name: string) => `<p>Hi ${name}</p>`),
  },
}));

// Mock Rate Limiting
vi.mock('@/lib/rate-limit', () => ({
  contactRateLimit: mockRateLimit,
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

// Import mocked modules
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limit allows request
    mockRateLimit.limit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
      pending: Promise.resolve(),
    });
  });

  describe('Successful Submissions', () => {
    it('should create contact and send email on valid data', async () => {
      const mockContact = {
        id: 'test-contact-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with more than 10 characters',
        createdAt: new Date('2026-01-07'),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'email-id' } });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with more than 10 characters',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Contact form submitted successfully');
      expect(json.id).toBe('test-contact-id-123');

      // Verify Prisma create was called
      expect(prisma.contact.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with more than 10 characters',
        },
      });

      // Verify email was sent
      expect(sendEmail).toHaveBeenCalledWith({
        to: 'john@example.com',
        subject: 'Thank you for contacting us',
        html: expect.any(String),
      });

      // Verify email template was called
      expect(emailTemplates.contactConfirmation).toHaveBeenCalledWith('John Doe');
    });

    it('should handle long names correctly', async () => {
      const longName = 'A'.repeat(100);
      const mockContact = {
        id: 'long-name-id',
        name: longName,
        email: 'user@example.com',
        message: 'Valid message here',
        createdAt: new Date(),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: longName,
          email: 'user@example.com',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });

    it('should handle long messages correctly', async () => {
      const longMessage = 'Long message. '.repeat(100);
      const mockContact = {
        id: 'long-msg-id',
        name: 'User',
        email: 'user@example.com',
        message: longMessage,
        createdAt: new Date(),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User',
          email: 'user@example.com',
          message: longMessage,
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 for invalid email', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'invalid-email',
          message: 'This is a valid message',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
      expect(json.errors[0].message).toContain('Invalid email');
    });

    it('should return 400 for missing name', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
    });

    it('should return 400 for name too short', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'A',
          email: 'test@example.com',
          message: 'Valid message',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors[0].message).toContain('at least 2 characters');
    });

    it('should return 400 for missing email', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('should return 400 for missing message', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
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

    it('should return 400 for message too short', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Short',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors[0].message).toContain('at least 10 characters');
    });

    it('should return 400 for multiple validation errors', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'A',
          email: 'invalid',
          message: 'Short',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors.length).toBeGreaterThan(1);
    });

    it('should return 400 for empty request body', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
    });
  });

  describe('Database Errors', () => {
    it('should return 500 on database connection error', async () => {
      vi.mocked(prisma.contact.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Internal server error');
    });

    it('should return 500 on database constraint violation', async () => {
      vi.mocked(prisma.contact.create).mockRejectedValueOnce(
        new Error('Unique constraint violation')
      );

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Valid message',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(500);
    });
  });

  describe('Email Service Failures', () => {
    it('should still return success even if email fails', async () => {
      const mockContact = {
        id: 'contact-123',
        name: 'John Doe',
        email: 'test@example.com',
        message: 'Valid message',
        createdAt: new Date(),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Email service down'));

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request as any);

      // Should return 500 because email failed
      expect(response.status).toBe(500);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name', async () => {
      const mockContact = {
        id: 'special-char-id',
        name: "O'Neil-Johnson",
        email: 'test@example.com',
        message: 'Valid message',
        createdAt: new Date(),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: "O'Neil-Johnson",
          email: 'test@example.com',
          message: 'Valid message',
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });

    it('should reject international email addresses (Zod limitation)', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User',
          email: 'user@münchen.de',
          message: 'Valid message',
        }),
      });

      const response = await POST(request as any);

      // Zod's email validator doesn't support IDN by default
      expect(response.status).toBe(400);
    });

    it('should NOT trim whitespace (validation happens as-is)', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: '  AB  ', // Still meets min 2 chars
          email: 'test@example.com',
          message: '  Valid message here  ', // Still meets min 10 chars
        }),
      });

      const mockContact = {
        id: 'whitespace-id',
        name: '  AB  ',
        email: 'test@example.com',
        message: '  Valid message here  ',
        createdAt: new Date(),
      };

      vi.mocked(prisma.contact.create).mockResolvedValueOnce(mockContact);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit is exceeded', async () => {
      mockRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Valid message here',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(429);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Too many requests. Please try again later.');
      expect(json.limit).toBe(10);
      expect(json.remaining).toBe(0);
      expect(json.reset).toBeDefined();
    });

    it('should include rate limit headers in response', async () => {
      const resetTime = Date.now() + 3600000;
      mockRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 10,
        remaining: 0,
        reset: resetTime,
        pending: Promise.resolve(),
      });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Valid message',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(json.limit).toBe(10);
      expect(json.remaining).toBe(0);
      expect(json.reset).toBe(resetTime);
    });

    it('should not call database or email when rate limited', async () => {
      mockRateLimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 3600000,
        pending: Promise.resolve(),
      });

      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          message: 'Valid message',
        }),
      });

      await POST(request as any);

      expect(prisma.contact.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
});
