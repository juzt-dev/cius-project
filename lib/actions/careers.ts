/**
 * Careers Application Server Action
 * Handles career application submissions with validation, rate limiting, and email
 */

'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { careersRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const careersSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  position: z.string().min(2, 'Position is required'),
  message: z.string().optional(),
});

export type CareersFormData = z.infer<typeof careersSchema>;

export type CareersActionResult =
  | { success: true; message: string; id: string }
  | {
      success: false;
      message: string;
      errors?: z.ZodIssue[];
      limit?: number;
      remaining?: number;
      reset?: number;
    };

export async function submitCareersAction(formData: FormData): Promise<CareersActionResult> {
  try {
    // Rate limiting
    if (careersRateLimit) {
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
      const { success, limit, remaining, reset } = await careersRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for careers form');
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
      name: formData.get('name'),
      email: formData.get('email'),
      position: formData.get('position'),
      message: formData.get('message') || undefined,
    };

    // Validate input
    const validatedData = careersSchema.parse(rawData);

    // Save to database
    const career = await prisma.career.create({
      data: validatedData,
    });

    // Send confirmation email
    await sendEmail({
      to: validatedData.email,
      subject: 'Career Application Received',
      html: emailTemplates.careerApplication(validatedData.name, validatedData.position),
    });

    apiLogger.info(
      { careerId: career.id, position: validatedData.position },
      'Career application submitted'
    );

    return {
      success: true,
      message: 'Application submitted successfully',
      id: career.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      };
    }

    apiLogger.error({ error }, 'Career application error');
    return {
      success: false,
      message: 'Internal server error',
    };
  }
}
