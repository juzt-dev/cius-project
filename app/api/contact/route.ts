import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { contactRateLimit, getClientIp } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    if (contactRateLimit) {
      const ip = getClientIp(request);
      const { success, limit, remaining, reset } = await contactRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for contact API');
        return NextResponse.json(
          {
            success: false,
            message: 'Too many requests. Please try again later.',
            limit,
            remaining,
            reset,
          },
          { status: 429 }
        );
      }
    }

    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

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

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }

    apiLogger.error({ error }, 'Contact form error');
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
