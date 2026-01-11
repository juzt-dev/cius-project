/**
 * Contact Form Server Action
 * Handles contact form submissions with validation, rate limiting, and email
 */

'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { contactRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactActionResult =
  | { success: true; message: string; id: string }
  | {
      success: false;
      message: string;
      errors?: z.ZodIssue[];
      limit?: number;
      remaining?: number;
      reset?: number;
    };

export async function submitContactAction(formData: FormData): Promise<ContactActionResult> {
  try {
    // Rate limiting
    if (contactRateLimit) {
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
      const { success, limit, remaining, reset } = await contactRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for contact form');
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
      message: formData.get('message'),
    };

    // Validate input
    const validatedData = contactSchema.parse(rawData);

    // Save to database
    const contact = await prisma.contact.create({
      data: validatedData,
    });

    // Send confirmation email
    await sendEmail({
      to: validatedData.email,
      subject: 'Thank you for contacting us',
      html: emailTemplates.contactConfirmation(validatedData.name),
    });

    apiLogger.info({ contactId: contact.id, email: validatedData.email }, 'Contact form submitted');

    return {
      success: true,
      message: 'Contact form submitted successfully',
      id: contact.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      };
    }

    apiLogger.error({ error }, 'Contact form error');
    return {
      success: false,
      message: 'Internal server error',
    };
  }
}
