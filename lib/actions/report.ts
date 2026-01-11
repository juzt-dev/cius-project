/**
 * Report Download Server Action
 * Handles report download requests with validation, rate limiting, and email delivery
 */

'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { reportRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const reportSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ReportFormData = z.infer<typeof reportSchema>;

export type ReportActionResult =
  | { success: true; message: string; id: string }
  | {
      success: false;
      message: string;
      errors?: z.ZodIssue[];
      limit?: number;
      remaining?: number;
      reset?: number;
    };

export async function submitReportAction(formData: FormData): Promise<ReportActionResult> {
  try {
    // Rate limiting
    if (reportRateLimit) {
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
      const { success, limit, remaining, reset } = await reportRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for report download');
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          limit,
          remaining,
          reset,
        };
      }
    }

    // Extract form data
    const rawData = {
      email: formData.get('email'),
    };

    // Validate input
    const validatedData = reportSchema.parse(rawData);

    // Save to database
    const report = await prisma.reportDownload.create({
      data: validatedData,
    });

    // Send report email
    await sendEmail({
      to: validatedData.email,
      subject: 'Your Report is Ready',
      html: emailTemplates.reportDownload(validatedData.email),
    });

    apiLogger.info(
      { reportId: report.id, email: validatedData.email },
      'Report download requested'
    );

    return {
      success: true,
      message: 'Report download link sent to your email',
      id: report.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      };
    }

    apiLogger.error({ error }, 'Report download error');
    return {
      success: false,
      message: 'Internal server error',
    };
  }
}
