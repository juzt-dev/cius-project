import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { reportRateLimit, getClientIp } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const reportSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    if (reportRateLimit) {
      const ip = getClientIp(request);
      const { success, limit, remaining, reset } = await reportRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for report API');
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
    const validatedData = reportSchema.parse(body);

    // Save download record
    const report = await prisma.reportDownload.create({
      data: {
        email: validatedData.email,
      },
    });

    // Send download link email
    await sendEmail({
      to: validatedData.email,
      subject: 'Your Report is Ready',
      html: emailTemplates.reportDownload(validatedData.email),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Report download link sent to your email',
        id: report.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }

    apiLogger.error({ error }, 'Report download error');
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
