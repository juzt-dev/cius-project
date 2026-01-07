import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

const reportSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
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

    console.error('Report download error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
