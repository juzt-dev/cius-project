/**
 * Report API Route Tests
 * Tests for POST /api/report endpoint with Prisma and Email mocking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

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

// Import mocked modules
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

describe('POST /api/report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Submissions', () => {
    it('should create report download record and send email', async () => {
      const mockReport = {
        id: 'report-id-123',
        email: 'user@example.com',
        downloadedAt: new Date('2026-01-07'),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Report download link sent to your email');
      expect(json.id).toBe('report-id-123');

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

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'repeat@example.com',
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
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

        const request = new Request('http://localhost:3000/api/report', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });

        const response = await POST(request as any);
        expect(response.status).toBe(201);
      }
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 for invalid email', async () => {
      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.errors[0].message).toContain('Invalid email');
    });

    it('should return 400 for missing email', async () => {
      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('should return 400 for empty string email', async () => {
      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: '',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 for email with spaces', async () => {
      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user @example.com',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 for email without @', async () => {
      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'userexample.com',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 for email without domain', async () => {
      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(400);
    });
  });

  describe('Database Errors', () => {
    it('should return 500 on database error', async () => {
      vi.mocked(prisma.reportDownload.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await POST(request as any);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Internal server error');
    });

    it('should return 500 on database timeout', async () => {
      vi.mocked(prisma.reportDownload.create).mockRejectedValueOnce(new Error('Query timeout'));

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(500);
    });
  });

  describe('Email Service Failures', () => {
    it('should return 500 if email fails', async () => {
      const mockReport = {
        id: 'report-123',
        email: 'test@example.com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Email service down'));

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(500);
    });

    it('should return 500 on email rate limit', async () => {
      const mockReport = {
        id: 'report-456',
        email: 'test@example.com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockRejectedValueOnce(new Error('Rate limit exceeded'));

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await POST(request as any);

      expect(response.status).toBe(500);
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

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'USER@EXAMPLE.COM',
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });

    it('should handle mixed case email', async () => {
      const mockReport = {
        id: 'mixed-id',
        email: 'User@Example.Com',
        downloadedAt: new Date(),
      };

      vi.mocked(prisma.reportDownload.create).mockResolvedValueOnce(mockReport);
      vi.mocked(sendEmail).mockResolvedValueOnce({ success: true, data: { id: 'mock-email-id' } });

      const request = new Request('http://localhost:3000/api/report', {
        method: 'POST',
        body: JSON.stringify({
          email: 'User@Example.Com',
        }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    });
  });
});
