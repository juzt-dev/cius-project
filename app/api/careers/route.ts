import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { careersRateLimit, getClientIp } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const careerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  position: z.string().min(2, 'Position is required'),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    if (careersRateLimit) {
      const ip = getClientIp(request);
      const { success, limit, remaining, reset } = await careersRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for careers API');
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
    const validatedData = careerSchema.parse(body);

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

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully', id: career.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }

    apiLogger.error({ error }, 'Career application error');
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
